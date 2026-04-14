# 07 — CRM como grafo

## La tesis

El CRM clasico es una base relacional: `customers`, `products`, `orders`, `interactions`. Modelado asi, **pierde las relaciones finas** que hacen a las queries que importan:

- "Clientes que preguntaron por X sin comprarlo y compraron Y (el competidor interno) en los ultimos 60 dias" — requiere joins caros y logica semantica.
- "Que productos se mencionan juntos en las conversaciones, aunque no se compren juntos" — imposible sin NLP sobre mensajes.
- "Comunidades de clientes con patrones de compra similares" — requiere clustering ad-hoc.

El **CRM como grafo** convierte estas en queries de traversal naturales.

## Schema del grafo

### Nodos

| Tipo | Atributos clave |
|------|-----------------|
| `Customer` | id, phone, name, first_contact, lifetime_value, preferred_channel, opt_in |
| `Product` | id, sku, name, category_id, brand_id, price_current, stock_current |
| `Category` | id, name, parent_id |
| `Brand` | id, name |
| `Conversation` | id, customer_id, channel, started_at, ended_at, status |
| `Message` | id, conversation_id, sender, body, timestamp, intent_tags |
| `Order` | id, customer_id, total, timestamp, status |
| `OrderItem` | order_id, product_id, qty, price_paid |
| `Campaign` | id, trigger_type, started_at, template_id, status |
| `StockEvent` | product_id, delta, reason, timestamp |
| `Escalation` | conversation_id, reason, assigned_to, status, resolved_at |

### Aristas (tipadas, con propiedades)

| Arista | Desde → Hacia | Propiedades |
|--------|---------------|-------------|
| `INTERESTED_IN` | Customer → Product | strength, first_seen, last_seen, sources[] |
| `PURCHASED` | Customer → Product | qty, amount, timestamp, order_id |
| `MENTIONED_IN` | Product → Message | position, sentiment |
| `PARTICIPATED_IN` | Customer → Conversation | role |
| `TRIGGERED_BY` | Campaign → StockEvent | |
| `TARGETED_BY` | Customer → Campaign | status, sent_at, opened_at, replied_at |
| `CONVERTED_FROM` | Order → Campaign | conversion_window |
| `BELONGS_TO` | Product → Category | |
| `MADE_BY` | Product → Brand | |
| `SIMILAR_TO` | Customer → Customer | similarity_score, basis |
| `COMPLEMENTS` | Product → Product | lift, support |
| `ESCALATED_TO` | Escalation → User(staff) | at, accepted_at |

### Properties temporales

Clave: **nodos y aristas tienen historia**. Ejemplos:

- `Product.stock_current` es el actual; `StockEvent`s guardan los deltas historicos.
- `Customer.lifetime_value` se recalcula; historico en snapshots mensuales.
- `INTERESTED_IN.strength` cambia; guardamos `strength_history[]` con timestamps.

Esto habilita el feature "historial temporal de nodos" del pitch.

## Queries tipicas (en "pseudocodigo Cypher")

### 1. Stock-triggered (Feature A)

```cypher
MATCH (p:Product {id: $stocked_product_id})
MATCH (c:Customer)-[r:INTERESTED_IN]->(p)
WHERE r.strength >= 0.5
  AND NOT EXISTS {
    MATCH (c)-[pur:PURCHASED]->(p)
    WHERE pur.timestamp > datetime() - duration('P60D')
  }
  AND NOT EXISTS {
    MATCH (c)-[:TARGETED_BY]->(camp:Campaign)
    WHERE camp.product_id = p.id
      AND camp.started_at > datetime() - duration('P7D')
  }
  AND c.opt_in = true
RETURN c
ORDER BY r.strength DESC, r.last_seen DESC
LIMIT 100
```

### 2. Clientes atrasados (Feature B)

```cypher
MATCH (c:Customer)-[pur:PURCHASED]->(:Product)
WITH c, 
     duration.between(pur.timestamp, datetime()).days AS gap_current,
     c.median_gap_days AS gap_typical
WHERE gap_current > 1.5 * gap_typical
  AND c.opt_in = true
  AND NOT EXISTS {
    MATCH (c)-[:TARGETED_BY]->(camp:Campaign)
    WHERE camp.trigger_type = 'frequency'
      AND camp.started_at > datetime() - duration('P30D')
  }
RETURN c, gap_current, gap_typical
ORDER BY (gap_current - gap_typical) DESC
```

### 3. Analisis global (dueño pregunta)

> "¿Que clientes se perdieron este trimestre y por que?"

```cypher
MATCH (c:Customer)
WHERE c.last_purchase < datetime() - duration('P90D')
  AND c.first_contact < datetime() - duration('P180D')
WITH c
MATCH (c)-[:PARTICIPATED_IN]->(conv:Conversation)
WHERE conv.ended_at > datetime() - duration('P120D')
RETURN c, 
       collect(conv.last_intent) AS intents,
       collect(conv.unresolved_reason) AS reasons
```

Resultado → LLM genera narrativa: "perdimos 40 clientes; 15 fue por falta de stock en X, 10 por precio, 8 por experiencia pobre, 7 sin motivo claro."

### 4. Cross-sell con explicacion

```cypher
MATCH (c:Customer {id: $customer_id})-[:PURCHASED]->(p1:Product)
MATCH (other:Customer)-[:PURCHASED]->(p1)
MATCH (other)-[:PURCHASED]->(p2:Product)
WHERE NOT (c)-[:PURCHASED]->(p2)
RETURN p2, count(DISTINCT other) AS co_buyers
ORDER BY co_buyers DESC
LIMIT 5
```

## Como se construye el grafo (ingestion)

### Fuentes de data

1. **Conversaciones WhatsApp** (streaming) → Messages → Customers, Products mencionados, INTERESTED_IN
2. **Pedidos** (webhook del ERP o manual) → Orders, OrderItems, PURCHASED
3. **Stock events** (webhook inventario) → StockEvents
4. **Catalogo** (CSV / API) → Products, Categories, Brands

### Pipeline

```
raw event → validador → normalizador → extractor (si texto) → upsert al grafo
```

- **Validador**: schema check, deduplicacion basica por clave natural.
- **Normalizador**: phone numbers formato E.164, product names canonicos, etc.
- **Extractor LLM**: Claude Haiku extrae entidades y relaciones de texto libre.
- **Upsert**: graph store (Kuzu/Neo4j).

### Resolucion de entidades

Clave: un cliente puede aparecer en varios canales con nombres distintos ("Juan", "Juan P", "el de la bicicleta roja").

- Fuzzy match por telefono + nombre + contexto → same_as edge o merge.
- Si ambiguo → marcar `needs_human_review`.

### Deduplicacion de productos

Igual problema: "zapatillas Nike air max 42" vs "zapatilla Nike airmax talle 42" vs "nike 42".

- Embedding + fuzzy match.
- Umbral de similaridad → merge automatico.
- Below threshold → review queue.

## Diferencia con CRM tabular en la practica

### Pregunta del dueño: "¿Que productos tengo que reponer urgente?"

**CRM tabular**: reporte de "productos con stock < 5". Lista plana. Si preguntas *por que* urgente, tenes que hacer mas queries manuales.

**CRM grafo**: el agente corre query que cruza stock bajo con `INTERESTED_IN.strength` acumulado + velocidad de rotacion historica + conversaciones recientes preguntando por ese producto. Responde:

> "Los 3 productos mas urgentes son: Nike Air Max 42 (stock 1, 8 personas preguntaron esta semana), Adidas Superstar (stock 2, 3 conversaciones en curso con intencion clara), Puma RS-X (stock 0 hace 6 dias, 12 clientes esperando)."

Eso no lo hace un CRM tabular sin codigo custom.

## Visibilidad para el humano

El grafo vive en Kuzu/Neo4j, pero el dueño lo ve via:

1. **Dashboard "pregunta libre"**: escribís pregunta, el agente corre query + genera narrativa.
2. **Graph view**: Cytoscape.js con filtros; nodos y aristas coloreados por tipo.
3. **Export a Obsidian**: cada nodo como archivo markdown con frontmatter + wikilinks; el dueño abre su vault y navega con graph view nativo.
