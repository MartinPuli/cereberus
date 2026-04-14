# 05 — Técnico

## Arquitectura general

```
                          ┌─────────────────────────────┐
                          │     CLIENTE FINAL           │
                          │     (WhatsApp)              │
                          └──────────────┬──────────────┘
                                         │
                         WhatsApp Business Cloud API
                                         │
┌────────────────────────────────────────▼──────────────────────┐
│                      AGENTE CORE                              │
│  ┌─────────────┐   ┌────────────┐   ┌─────────────┐           │
│  │ Orchestrator│ ← │ Claude API │ → │ Tool layer  │           │
│  │   (LangGraph│   │ (Sonnet 4.6│   │  - search   │           │
│  │    / own)   │   │  + caching)│   │  - write    │           │
│  └──────┬──────┘   └────────────┘   │  - campaign │           │
│         │                            │  - escalate │           │
│         │                            └─────────────┘           │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────┐
│            CAPA DE CONOCIMIENTO (GRAPH RAG)                  │
│  ┌─────────────────┐   ┌─────────────────┐                   │
│  │  Neo4j / Kuzu   │ ← │ Extractor LLM   │ ← conversaciones │
│  │  (graph store)  │   │ (entities, edges)│                  │
│  └────────┬────────┘   └─────────────────┘                   │
│           │                                                   │
│  ┌────────▼────────┐   ┌─────────────────┐                   │
│  │ Community det.  │ → │ Summaries tree  │                   │
│  │ (Leiden)        │   │ (local + global)│                   │
│  └─────────────────┘   └─────────────────┘                   │
│                                                              │
│  ┌──────────────────────────────────────────┐                │
│  │ Query engine: local search + global      │                │
│  └──────────────────────────────────────────┘                │
└──────────────────────────────────────────────────────────────┘
          ▲                                       ▲
          │                                       │
┌─────────┴──────────┐                ┌───────────┴──────────┐
│ INVENTARIO / ERP   │                │  PANEL ESCALADOR     │
│ (webhook / poll)   │                │  (Next.js / Tauri)   │
└────────────────────┘                └──────────────────────┘
                                                 ▲
                                                 │
                                      ┌──────────┴─────────┐
                                      │ VISTA DEL GRAFO    │
                                      │ (Obsidian / Cytos.)│
                                      └────────────────────┘
```

## Stack tecnologico propuesto

| Capa | Tecnologia | Por que |
|------|------------|---------|
| Orquestacion de agente | **LangGraph** (o custom con Claude + tool use) | Control fino del estado, interrupts para escalacion |
| LLM principal | **Claude Sonnet 4.6** con prompt caching | Calidad + costo; cache reduce tokens en conversaciones largas |
| LLM extractor (grafo) | **Claude Haiku 4.5** batch | Volumen alto, pipeline offline, barato |
| Graph store | **Kuzu** (embedded) para MVP / **Neo4j** (hosted) para prod | Kuzu es rapido local y open source; Neo4j escala con Aura |
| Vector store (complementario) | **Qdrant** / **pgvector** | Para lookup rapido en extractor, no es la capa principal |
| Backend | **FastAPI** (Python) + **Celery** para jobs | Python por ecosystem de AI; Celery para cron + extractor async |
| WhatsApp gateway | **WhatsApp Business Cloud API** (Meta) o **Twilio WhatsApp** | Oficial, obligatorio para producción |
| Panel escalador | **Next.js 15** + **shadcn/ui** | Rapido de construir, dev familiar |
| Graph viewer | **Cytoscape.js** o iframe **Obsidian Graph** con export | Visualizacion mainstream, embedding posible |
| Deploy | **Railway** / **Fly.io** para backend, **Vercel** para panel | Simple para MVP, escalable despues |
| Infra glue | **Docker Compose** dev, **Terraform** despues | Estandar |

## Graph RAG — pipeline detallado

### 1. Ingesta de conversaciones

Cada mensaje WhatsApp entra al sistema con:
- `from`, `to`, `timestamp`, `body`, `media_ids`
- Se guarda raw en tabla `messages` (Postgres).
- Se marca para extractor async.

### 2. Extractor (Claude Haiku, batch)

Por cada chunk de conversacion (por sesion o por N mensajes):

```
System prompt: "Sos un extractor de entidades y relaciones. 
De este texto extraé:
- Entidades: cliente, producto, categoria, marca, talle, color, evento.
- Relaciones: (cliente) -pregunta_por-> (producto, con_contexto), 
              (cliente) -compra-> (producto, timestamp, cantidad),
              (cliente) -menciona-> (marca/categoria).
Devolvé JSON estricto."
```

Output → parseado → upsert al grafo (deduplicacion de entidades por similarity + hash).

### 3. Construccion del grafo

Nodos tipados:

- `Customer(id, phone, name, ...)`
- `Product(id, sku, name, category, ...)`
- `Category`, `Brand`, `Campaign`, `Conversation`, `Message`, `Order`

Aristas tipadas:

- `INTERESTED_IN(Customer → Product, strength, first_seen, last_seen)`
- `PURCHASED(Customer → Product, qty, timestamp, amount)`
- `PARTICIPATED_IN(Customer → Conversation)`
- `TARGETED_BY(Customer → Campaign, status)`
- `STOCKED(Product, qty, timestamp)` (node-level property historica)

### 4. Community detection (periodico)

- Corre **Leiden** (via `networkx` o `graph-tool`) semanal.
- Identifica clusters de clientes con intereses similares, clusters de productos complementarios.
- Guarda `community_id` como property de nodos.

### 5. Summaries jerarquicos

Por cada community:
- LLM genera summary textual ("este cluster de 40 clientes prefieren marcas deportivas premium, compran c/60 dias en promedio").
- Summaries de summaries (arbol).
- Se indexan en vector store para retrieval rapido al momento de queries globales.

### 6. Query time

**Local search**: query del usuario/agente → entidades mencionadas → traversal N saltos → contexto construido → Claude responde.

**Global search**: query agregada ("clientes perdidos este trimestre") → map sobre summaries de communities → reduce → Claude sintetiza.

## Integraciones clave

### Inventario / ERP

- **Webhook** si el ERP lo soporta (Holded, Zoho, Odoo).
- **Polling** cada 15 min si no (con diff).
- **Upload manual** CSV como fallback dia 1.

### WhatsApp Business

- Meta Cloud API (recomendado).
- Alternativa: Twilio WhatsApp API si hay limites Meta.
- Session management: 24h rolling window (regla Meta), usar template messages para re-engage.

### Panel escalador

- Web simple con auth (Clerk / Auth.js).
- Realtime: Supabase Realtime o simple polling.
- Mobile-friendly (el dueño lo revisa desde celular).

## Prompts clave (esbozos)

### Prompt del agente (system)

```
Sos un agente de ventas que opera sobre WhatsApp para <nombre_negocio>.
Tenés acceso a:
- Herramienta search_graph(query) — consulta el grafo de conocimiento del negocio.
- Herramienta send_message(text) — responde al cliente.
- Herramienta schedule_followup(days, reason) — agenda recontacto.
- Herramienta escalate_to_human(reason, summary) — pasa la conversacion al humano.

Reglas:
1. Si no sabés algo, consultá el grafo antes de responder.
2. Si detectás <condiciones de escalacion>, usá escalate.
3. Mantené el tono <tono_configurado>.
4. Nunca inventes stock, precios ni promesas.
```

### Prompt del extractor

```
Input: conversacion de WhatsApp entre vendedor y cliente.
Output: JSON con entities[] y relations[]. Schema estricto.
Rules: deduplicar; no inventar; si ambiguo, marcar confidence < 0.7.
```

### Prompt de escalation summary

```
Generá un resumen de 3-5 lineas para el humano:
- Que quiere el cliente
- Que intenté yo
- Por que escaló
- Sugerencia de proximo paso
```

## Consideraciones de diseño

### Prompt caching

Conversaciones largas → usar **Anthropic prompt caching** con breakpoints en:
1. System prompt (estatico).
2. Catalogo + reglas del negocio (cambia raro).
3. Grafo relevante pre-cargado (cambia por conversacion).

Ahorro esperado: 70-90% de tokens en conversaciones largas.

### Costos estimados (MVP)

- Extractor (Haiku batch): ~$0.25 / 1M input tokens → ~$5/mes por negocio con 10k msgs/mes.
- Agente (Sonnet con cache): ~$3/MTok input sin cache, $0.30 con cache → ~$15-30/mes por negocio activo.
- Graph store: Kuzu gratis (self-hosted), Neo4j Aura $65/mes+.
- WhatsApp: conversations billing Meta, ~$0.005-0.05 por conversacion iniciada.
- **Total por cliente PyME activo**: ~$40-80/mes de infra + variable por volumen.

### Observabilidad

- **Langfuse** o **Arize Phoenix** para trazar cada decision del agente.
- Metrics clave: % escalaciones, tiempo respuesta, conversion por campana, tokens/mes.

### Seguridad

- Aislamiento multi-tenant a nivel DB (schema por cliente o filtros obligatorios).
- Secretos en vault (Doppler / 1Password CLI).
- Rate limits por tenant.
- Auditoria: cada accion del agente queda logueada con hash firmado.
