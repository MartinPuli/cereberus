# 11 — Design Patterns

Patrones de diseño aplicados al Cerebro. Sirven como lenguaje común del equipo y checklist técnico-narrativo para el pitch.

> Alineado con la idea canónica: ingesta multimodal + GraphRAG + agente para vendedores (WhatsApp / chat web) + sugerencias de campañas al dueño.

---

## 1. Patrones de arquitectura

### 1.1 Two-DB Pattern (el corazón)

Dos bases conviviendo:

- **DB normalizada** (Postgres/MySQL): registro de verdad. Pedidos, clientes, stock, facturas.
- **El Cerebro (Graph DB: Kuzu/Neo4j)**: relaciones tipadas extraídas por IA, summaries jerárquicos, propiedades temporales.

**Sync**: eventos de la normalizada → pipeline ETL/LLM → upsert al grafo. La normalizada manda; el grafo es la capa de razonamiento.

**Por qué**: la normalizada no responde "¿a quién contacto hoy y por qué?". El grafo sí. Pero sin la normalizada se pierde auditoría y ERP integration.

### 1.2 Ingesta multimodal universal

El Cerebro come **cualquier cosa** que el negocio tire adentro:

- **Imagen** → Claude Vision extrae texto y semántica (fotos de facturas, catálogos, etiquetas, pizarrones, estanterías).
- **Audio** → transcripción (Whisper / Deepgram) + extracción de entidades → grafo.
- **Texto** → PDFs, Excels desordenados, WhatsApp históricos, notas sueltas, reglas de negocio.
- **Sin setup wizard**: el sistema ordena, no el usuario.

Detalle: [13-ingest-multimodal.md](13-ingest-multimodal.md).

### 1.3 Perceive-Reason-Act Loop

```
PERCEIVE  → mensaje nuevo, evento stock, pregunta del vendedor
  ↓
REASON    → query al grafo + contexto + reglas
  ↓
ACT       → responder al vendedor / proponer campaña / etc.
  ↓
LEARN     → resultado se persiste en el grafo
```

Loop cerrado: cada acción enriquece al grafo para la siguiente.

### 1.4 Recommend, don't decide (core B2B)

El vendedor humano sigue vendiendo. El Cerebro **no lo reemplaza** — le dice:

> "Hoy contactá a Juan. Pedía 10, ahora 6. Ofrecele estuches. A María el talle 42 que esperaba. A Pedro no lo llames, está molesto."

El humano ejecuta con un tap. El Cerebro aprende del resultado.

**Por qué**: ventas B2B informales son de relación, no se automatizan. Se **amplifican**.

### 1.5 Multi-surface agent

Mismo cerebro, múltiples canales:

- **WhatsApp Meta Business del negocio** — para vendedores en la calle.
- **Chat web multi-usuario** — vendedores en la oficina con más contexto + grafo visible + archivos.
- **Web app del dueño** — no conversacional; visualiza cerebro + aprueba campañas + configura reglas.

### 1.6 Human-in-the-Loop aprobación

Tres capas de decisión:

1. **Cerebro propone** (campaña, mensaje, acción).
2. **Humano aprueba** (dueño o vendedor, según la acción).
3. **Sistema ejecuta** (manda WhatsApp, actualiza grafo).

Si la confianza del Cerebro > umbral por N días, ciertas acciones pueden auto-aprobarse (configurable).

---

## 2. Patrones de Knowledge Graph / Graph RAG

### 2.1 Entity Resolution

Un cliente puede aparecer como "Juan", "Juan P.", "el de la ferretería", con dos teléfonos distintos, en un audio y en un Excel:

- Normalización (teléfono E.164, trim, lowercase).
- Fuzzy matching (Levenshtein + phonetic).
- Embedding similarity para ambiguos.
- Review queue para bajo-confianza → humano resuelve.
- Merge o `SAME_AS` edge.

### 2.2 Hierarchical Summaries (GraphRAG Microsoft)

Community detection (Leiden) → summary por comunidad → summary de summaries → árbol.

- Queries locales: traversal directo.
- Queries globales ("¿qué pasó este trimestre?"): map-reduce sobre summaries del árbol.

### 2.3 Temporal Nodes

Cada propiedad importante tiene historia:

```
Customer.median_gap_days      → actual
Customer.median_gap_history[] → (value, timestamp)[]
Product.stock_history[]       → (qty, timestamp)[]
```

Habilita: "este cliente compraba cada 30 días, ahora cada 45", "¿por qué el Cerebro sugirió esto en esta fecha?".

### 2.4 Typed Edges con strength decay

Aristas con propiedades:

- `strength` (0-1)
- `first_seen`, `last_seen`
- `sources[]` (qué mensajes/audios/imágenes la crearon)

Decay configurable: intención de hace 6 meses pesa menos que la de esta semana.

### 2.5 Extract-Normalize-Upsert

Claude como extractor multimodal:

```
Input (imagen/audio/texto) → LLM con schema estricto
                           → JSON entities + relations
                           → Validator
                           → Normalizer (canonical forms)
                           → Graph upsert idempotente
```

### 2.6 Messy Input → Structured Graph

Entrada desordenada (Excel feo, WhatsApp en crudo, foto movida, audio con ruido). El pipeline tolera y estructura. **Nunca pedirle al usuario que ordene**.

---

## 3. Patrones de conversación con vendedor

### 3.1 Daily Briefing Pattern

Vendedor abre WhatsApp / chat web → primera interacción del día → "¿qué hago hoy?" → Cerebro devuelve lista priorizada (5-10 acciones).

Cada acción: cliente + mensaje sugerido + razón en una línea.

### 3.2 End-of-Day Review Pattern

Fin del día → vendedor reporta cierres (o el Cerebro infiere de WhatsApp) → Cerebro genera plan de mañana con:

- Lo que no se cerró hoy.
- Oportunidades nuevas del día.
- Campañas pendientes.

### 3.3 Context on demand

Vendedor pregunta puntual:

- "¿Qué le vendí a Juan los últimos 3 meses?"
- "¿Quién más compra como Pedro?"
- "¿Tengo algo para ofrecer a María hoy?"

Cerebro responde con narrativa + datos.

### 3.4 Thread Memory

Cada vendedor tiene su hilo continuo. En la conversación 5 el Cerebro recuerda que en la 1 el vendedor dijo "estoy en Mar del Plata toda la semana" → sugiere clientes de la zona.

### 3.5 Tone Matching

El Cerebro adopta el tono del vendedor y del negocio. Configurable + aprendido.

---

## 4. Patrones de disparo / triggers

### 4.1 Morning cron

Cada día, por vendedor, genera el briefing y lo manda al WhatsApp.

### 4.2 Event-driven (stock, pedidos, nuevos clientes)

Webhook de inventario → evalúa triggers de campaña → si hay match → notifica al dueño con sugerencia.

### 4.3 Frequency-driven

Cron diario: por cliente, evalúa gap vs mediana histórica. Si excede umbral → sugiere acción al vendedor.

### 4.4 Curiosity-driven (feature futura)

Cerebro detecta anomalía ("este producto se pregunta 5x esta semana, no estaba en radar") → propone investigación o campaña.

---

## 5. Patrones de UX / producto

### 5.1 Conversational-first

La interfaz principal del vendedor **es un chat** (WhatsApp o web). No tiene que aprender una app. Todo es conversación.

### 5.2 Dashboard del dueño: Graph + Campañas

Dos secciones dominantes:

- **Visualización del cerebro** (grafo navegable — "ver parte del cerebro").
- **Cola de campañas sugeridas** con un solo botón: "Aprobar y lanzar".

Todo lo demás (configuración, logs, reglas) es secundario.

### 5.3 Actionable-first

Cada insight viene con acción:

- Mal: "20% de tus clientes están inactivos".
- Bien: "Estos 14 clientes se fueron. Click para lanzar campaña de reactivación."

### 5.4 Zero-setup ingest

Pain del audio: "puede recibir un Excel desordenado". Onboarding come lo que sea:

- Arrastrar archivos (imagen, audio, Excel, PDF).
- Pegar texto suelto.
- Conectar WhatsApp Meta Business.
- El sistema pregunta solo si algo es crítico y ambiguo.

### 5.5 Recommend → Approve → Execute

UX de la acción:

1. Cerebro recomienda (ej. "mandar campaña de stock nuevo a estos 40 clientes").
2. Dueño aprueba con un tap (o edita antes).
3. Sistema ejecuta (mensajes masivos vía Meta Business API).

### 5.6 Part-of-Brain view

"Ver parte del cerebro" (literal del audio): click en cualquier cluster, cliente, producto → subgrafo navegable con contexto.

---

## 6. Patrones de campañas

### 6.1 Campaign = audience × message × timing

Cada campaña se define por:

- **Audience**: segmento del grafo (filtro).
- **Message**: template personalizable (con slots llenados por IA por cada cliente).
- **Timing**: now, scheduled, triggered.

Detalle: [14-estrategias-campanas.md](14-estrategias-campanas.md).

### 6.2 Segment-by-graph-pattern

Los segmentos son patterns en el grafo, no tags manuales:

- Atrasados: `gap_actual > 1.5 × mediana`.
- Habituales: `gap < 1 × mediana` y `compras > 6 últimos meses`.
- Interesados sin comprar: `INTERESTED_IN pero no PURCHASED en N días`.
- Antiguos dormidos: `última compra > 180 días` + `lifetime_value > threshold`.

### 6.3 Personalization templating

Mensaje: 80% template, 20% llenado por Claude por cada cliente (nombre, último producto, contexto).

### 6.4 Rate limit por negocio + por cliente

- No más de N mensajes/día desde el Meta Business.
- No más de M mensajes/semana al mismo cliente.
- Respetar opt-out inmediato.

---

## 7. Patrones de infra / operación

### 7.1 Prompt Caching

Con Claude: breakpoints en system + catálogo + subgrafo relevante. Ahorro 70-90% tokens en conversaciones largas.

### 7.2 Batched Extraction

Ingesta de archivos masivos → cola → batch con Claude Haiku (50% descuento) → upsert al grafo.

### 7.3 Observability Trace

Cada decisión del Cerebro deja trace: input, query al grafo, plan, acciones, outcome. Langfuse / Phoenix / propio. Clave para debug y confianza del cliente.

### 7.4 Multi-Tenant Isolation

Cada negocio → su subgrafo aislado con `tenant_id`. Filtros obligatorios en toda query.

### 7.5 Idempotent Actions

Cada acción con `idempotency_key`. No duplicar mensajes, no disparar campañas dos veces.

---

## 8. Anti-patrones (lo que NO hacemos)

| Anti-patrón | Por qué no |
|-------------|------------|
| Chatbot directo al cliente final | El vendedor humano vende mejor. Somos copiloto del vendedor. |
| Dashboard de métricas | No vende. Accionables sí. |
| Setup wizard de 20 pasos | Ingesta universal primero, config después. |
| RAG vectorial puro sobre todo | No responde queries agregadas. Grafo + vector complementario. |
| Campañas masivas sin filtro | Quema la confianza. Filtrar por patrón en el grafo siempre. |
| Hardcode de reglas por negocio | Reglas en config, no en código. |
| Tablas como primer ciudadano | El grafo es la vista principal para el dueño. |

---

## 9. Los patrones que más venden en el pitch

Para la presentación, estos son los que hay que mostrar en acción:

1. **Two-DB Pattern** → slide del Bloque 3 del pitch.
2. **Ingesta multimodal universal** → slide del Bloque 4, parte izquierda del tríptico.
3. **Conversational-first / Daily Briefing** → slide del Bloque 4, parte central (WhatsApp).
4. **Recommend → Approve → Execute de campañas** → slide del Bloque 4, parte derecha (dueño).
5. **Part-of-Brain view** → Bloque 5, el momento wow del demo.

Si el demo muestra estos 5 en 3 minutos, el pitch está ganado.
