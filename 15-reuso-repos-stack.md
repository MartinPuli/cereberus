# 15 — Plan de fork + cómo funca end-to-end

> Estrategia: **no construimos de cero, forkeamos**. Combinamos dos repos open source maduros, agregamos la capa visual de grafo y el chat del vendedor. Foco total en el demo visual.

---

## TL;DR en una frase

**Forkeamos [llmwiki](https://github.com/lucasastorian/llmwiki) (frontend + upload + MCP a Claude ya funciona) + embebemos [Graphiti](https://github.com/getzep/graphiti) como motor del grafo temporal + agregamos Cytoscape.js para el hero visual + un chat mockeado o real para el vendedor.**

---

## Qué viene de cada repo

### llmwiki — el scaffolding del producto ✅

Lo que ya tiene resuelto:

- Upload drag&drop de PDFs, Office, imágenes.
- Backend FastAPI con auth, storage S3, DB Postgres (Supabase).
- Frontend Next.js 16 + React 19 + Tailwind + Radix UI.
- Integración MCP con Claude para que el LLM lea sources y escriba wiki.
- Viewer de sources original (útil para "ver de dónde salió cada fact").
- Licencia Apache 2.0 → libre para forkear.

**Stack exacto**:

```
web/        → Next.js frontend
api/        → FastAPI backend
mcp/        → MCP server (Claude integration)
converter/  → Office → PDF
supabase/   → DB migrations
```

### Graphiti — el cerebro temporal ✅

Lo que ya tiene resuelto:

- Extracción automática de entidades y relaciones desde texto.
- Grafo **bi-temporal** (cuándo pasó en el mundo real + cuándo se ingirió) — tu feature de "ver cómo cambió en el tiempo" **ya viene de fábrica**.
- Ingesta incremental (cada nuevo episodio actualiza el grafo sin recomputar). Esto es lo que hace que "el Cerebro aprenda con cada nuevo doc".
- Kuzu embedded → **cero setup de DB externa** para el MVP.
- Hybrid search (semántica + keyword + graph traversal).
- Trabaja con Claude vía Anthropic SDK.

### Lo que construimos nosotros (≈ 30% del trabajo total)

1. **Graph viewer visual** (Cytoscape.js o React Flow) — el hero del demo.
2. **Chat "vendedor"** — UI tipo WhatsApp mock con respuestas del agente.
3. **Cards de sugerencia de campañas** — UI del dueño/gerente.
4. **Ingesta multimodal** (audio, imagen) — extender llmwiki para que soporte más formatos.
5. **Puente Graphiti ↔ llmwiki** — escribir episodes al grafo cuando se sube un source.

---

## Arquitectura integrada

```
┌──────────────────────────────────────────────────────────────────┐
│  USUARIOS                                                         │
│  • Dueño (web)    • Vendedor (web chat + WhatsApp mock)          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│  FRONTEND (Next.js — fork de llmwiki + customizaciones)          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐          │
│  │ Upload zone  │  │ Graph Viewer │  │ Chat "vendedor"│          │
│  │ (ya existe)  │  │ (NUEVO —     │  │ (NUEVO —       │          │
│  │ + audio/img  │  │  Cytoscape)  │  │  WhatsApp mock)│          │
│  └──────────────┘  └──────────────┘  └────────────────┘          │
│  ┌──────────────────────────────────────────────────┐             │
│  │ Campaign Suggestion Cards (NUEVO)                │             │
│  └──────────────────────────────────────────────────┘             │
└────────────────────────────┬─────────────────────────────────────┘
                             │ REST + WebSocket (ya existe)
┌────────────────────────────▼─────────────────────────────────────┐
│  BACKEND (FastAPI — fork de llmwiki)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │ Upload API   │  │ MCP a Claude │  │ Graph API (NUEVO)   │    │
│  │ (ya existe)  │  │ (ya existe)  │  │ /graph /nodes /etc  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘    │
│         │                 │                      │                │
│         │ al llegar source│                      │                │
│         ▼                 ▼                      ▼                │
│  ┌───────────────────────────────────────────────────────┐       │
│  │ Conversor multimodal (NUEVO)                          │       │
│  │ • audio → Whisper → text                              │       │
│  │ • image → Claude Vision → text + metadata             │       │
│  │ • text → passthrough                                  │       │
│  └────────────┬──────────────────────────────────────────┘       │
│               │                                                    │
│               ▼                                                    │
│  ┌───────────────────────────────────────────────────────┐       │
│  │ GRAPHITI (librería Python embebida)                   │       │
│  │ • graphiti.add_episode(text, source)                  │       │
│  │ • graphiti.search(query) → hybrid retrieval           │       │
│  │ • graphiti.get_graph() → nodes + edges para viz       │       │
│  └──────────────┬────────────────────────────────────────┘       │
│                 │                                                  │
│                 ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ KUZU (embedded graph DB — un archivo local)          │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ Supabase (Postgres) — auth, sources raw, llmwiki og  │        │
│  └──────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Cómo funca end-to-end (los 3 flujos del demo)

### Flujo 1 — Ingesta: "subo cualquier cosa, el cerebro la come"

```
1. Dueño arrastra al Cerebro:
   → 1 Excel "pedidos2025.xlsx"
   → 3 fotos de facturas (JPG)
   → 2 audios WhatsApp (OGG)
   → 1 PDF de lista de precios

2. llmwiki backend recibe, guarda en S3.

3. Conversor multimodal (nuevo código):
   → audio.ogg → Whisper → texto transcripto
   → factura.jpg → Claude Vision prompt: "extraé items, precios, cliente, fecha"
   → excel.xlsx → pandas + Claude: "inferí qué columnas son qué"
   → pdf.pdf → ya lo hace llmwiki

4. Cada source convertido a texto → se pasa a Graphiti como episode:
   graphiti.add_episode(
     name="factura_042",
     episode_body=<texto extraído>,
     source=EpisodeType.text,
     reference_time=<fecha del doc>,
     source_description="Foto de factura subida el 14/4"
   )

5. Graphiti internamente:
   → Llama a Claude para extraer entidades y relaciones.
   → Resuelve duplicados (¿este "Juan" es el mismo Juan de otros docs?).
   → Actualiza el grafo temporal (si hay contradicción con fact previo,
      invalida el viejo en vez de borrarlo — bi-temporal).

6. Frontend recibe WebSocket updates:
   → "300 clientes, 1200 productos, 8500 relaciones extraídas"
   → Graph Viewer empieza a animarse con nodos nuevos apareciendo.
```

**Moment wow**: pasos 5-6 visibles en pantalla en tiempo real.

---

### Flujo 2 — Vendedor: "¿qué hago hoy?"

```
1. Vendedor abre chat (web o WhatsApp mock) y pregunta:
   "¿qué hago hoy?"

2. Frontend manda la query al backend.

3. Backend:
   a) graphiti.search("customers overdue today") → top nodos
   b) Build context: top clientes atrasados + último producto + razón
   c) Prompt a Claude:
      "Sos un agente que ayuda al vendedor. Con este contexto,
       devolvé 5 acciones priorizadas para hoy, con cliente,
       mensaje sugerido y razón."
   d) Claude responde con JSON estructurado

4. Frontend muestra 5 cards accionables:
   ┌─────────────────────────────────────────┐
   │ #1  Juan Pérez                          │
   │ Pidió mermelada cada 30 días. Atrasado. │
   │ 📱 "Hola Juan, ¿repongo mermelada?"    │
   │ [Mandar por WhatsApp]  [Saltear]        │
   └─────────────────────────────────────────┘

5. Vendedor marca acciones hechas → feedback vuelve al grafo
   (aprende qué sugerencias funcionan).
```

**Moment wow**: 5 cards que se generan en 3 segundos con contexto real.

---

### Flujo 3 — Dueño: sugerencia y lanzamiento de campaña

```
1. Dueño abre web app → ve el grafo + tab "Campañas sugeridas".

2. Al entrar, backend corre rutinariamente:
   a) graphiti.search("customers late no response in 7 days")
   b) graphiti.search("products just restocked with interest")
   c) Claude genera propuestas de campaña en base al output

3. Frontend muestra cards:
   ┌────────────────────────────────────────────┐
   │ 💡 Sugerencia de campaña                  │
   │ Tipo: Clientes atrasados                   │
   │ Audiencia: 23 clientes                     │
   │ Revenue potencial: ~$45k ARS               │
   │ PREVIEW (Juan): "Hola Juan, hace 42 días.."│
   │ [Ver los 23] [Editar] [Descartar] [Lanzar]│
   └────────────────────────────────────────────┘

4. Dueño hace click "Lanzar" →
   → backend ejecuta la campaña (mock del WhatsApp o Twilio sandbox real)
   → graphiti.add_episode(camp_id, targets, ...) — queda en el grafo
   → grafo refleja nuevas `TARGETED_BY` edges en vivo

5. Pantalla muestra animación de mensajes saliendo → respuestas llegando.
```

**Moment wow**: paso 5. Los mensajes "vuelan" del dueño al WhatsApp de los 23 clientes, y empiezan a volver respuestas en el grafo.

---

## Los 5 hero moments para el demo

En orden durante los 3 minutos del pitch (ver [12-pitch-presentacion-3min.md](12-pitch-presentacion-3min.md)):

| # | Moment | Duración | Qué se ve |
|---|--------|----------|-----------|
| 1 | Ingesta multimodal | ~8s | Drag&drop de Excel + fotos + audios, barra de progreso, contador entidades |
| 2 | Grafo cobrando vida | ~10s | Cytoscape animado con nodos apareciendo en vivo, colores por tipo |
| 3 | Chat vendedor | ~10s | Pregunta "¿qué hago hoy?" → 5 cards con acciones concretas |
| 4 | Sugerencia de campaña | ~10s | Card de campaña aparece en panel del dueño → click lanzar |
| 5 | Part-of-brain zoom | ~15s | Click en un cliente → subgrafo navegable con su historia |

Total: ~53s de pantalla visual. Resto (107s) es narrativa del pitcher sobre esos visuales.

---

## Setup local paso a paso (pre-hackathon)

### Día -7 a -3 (prep)

```bash
# 1. Clonar llmwiki como base
git clone https://github.com/lucasastorian/llmwiki.git cerebro
cd cerebro
git remote rename origin upstream
git remote add origin <tu repo vacío>

# 2. Seguir el setup del README de llmwiki
#    - crear Supabase project
#    - crear S3 bucket
#    - configurar Claude MCP
#    - instalar deps (Next.js + FastAPI)

# 3. Dejar corriendo llmwiki como vino. Validar que uploads funcionen.

# 4. Agregar Graphiti al backend
cd api
pip install graphiti-core[kuzu]  # Kuzu embedded, cero setup extra

# 5. Crear módulo nuevo api/app/brain/
mkdir -p app/brain
touch app/brain/__init__.py
touch app/brain/graphiti_client.py
touch app/brain/multimodal_converter.py
touch app/brain/campaign_engine.py
```

### Día -2 (integración)

Crear los 3 módulos nuevos:

**`api/app/brain/graphiti_client.py`**

```python
from graphiti_core import Graphiti
from graphiti_core.nodes import EpisodeType

class BrainClient:
    def __init__(self):
        self.g = Graphiti(
            uri="./brain.kuzu",  # embedded file
            llm_client=...,      # Claude
        )

    async def ingest(self, text: str, source_name: str, ref_time):
        return await self.g.add_episode(
            name=source_name,
            episode_body=text,
            source=EpisodeType.text,
            reference_time=ref_time,
        )

    async def search(self, query: str, limit=10):
        return await self.g.search(query, limit=limit)

    async def get_graph_snapshot(self):
        # Para el Graph Viewer del frontend
        return {"nodes": [...], "edges": [...]}
```

**`api/app/brain/multimodal_converter.py`**

```python
# Funciones: convert_audio, convert_image, convert_excel
# Usar Whisper API + Claude Vision + pandas
# Devolver texto normalizado
```

**`api/app/brain/campaign_engine.py`**

```python
# Templates de las 7 campañas core (ver 14-estrategias-campanas.md)
# Por cada tipo: query Graphiti + armar mensaje + guardar sugerencia
```

### Día -1 (frontend visual)

```bash
cd web
npm install cytoscape cytoscape-react-wrapper react-cytoscapejs
```

Crear 3 componentes:

- `components/GraphViewer.tsx` — Cytoscape.js conectado a `/graph/snapshot`
- `components/VendorChat.tsx` — UI tipo WhatsApp con bubbles + cards de acción
- `components/CampaignCard.tsx` — card del dueño con preview + botones

### Día 0 (hackathon)

Focus total:

1. **Horas 1-2**: mocks con data semilla (meter 1 empresa ficticia con 50 clientes, 20 productos, 200 mensajes históricos).
2. **Horas 3-4**: pulir visuales, Cytoscape lindo, animaciones.
3. **Horas 5-6**: grabar **video de respaldo** del demo completo (fallback).
4. **Horas 7-8**: ensayar pitch con la demo.

Si queda tiempo: WhatsApp real vía Twilio sandbox.

---

## Qué cortar si estamos apretados de tiempo

Prioridad de cortes (cortar de abajo hacia arriba):

1. **Modo "vendedor vía WhatsApp real"** → mostrar solo chat web. WhatsApp queda como "está wired pero mostramos la versión web".
2. **Conversión de audio** → hardcodear 1 audio transcripto a mano. Mostrar que "el sistema lo hace", con video pre-grabado si hace falta.
3. **Conversión de imagen** → ídem.
4. **Multi-usuario / roles** → un solo usuario dueño que alterna entre vistas.
5. **Graph viewer fancy** → si Cytoscape pelea, usar screenshot estático animado.

**Lo que NO se corta**:

- Upload funcionando en vivo con algún tipo de archivo.
- Graph view visible con nodos reales.
- Chat vendedor con respuesta real de Claude.
- Card de sugerencia de campaña visible.

---

## Riesgos técnicos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Graphiti no extrae bien con data ficticia | Pre-ingestar el dataset la noche anterior, verificar |
| Kuzu tiene bugs en edge cases | Plan B: switch a Neo4j Aura (30 min de config) |
| MCP de llmwiki no conecta con Graphiti directo | Saltarse MCP, usar API REST FastAPI → Graphiti directo |
| Cytoscape lento con >500 nodos | Limitar snapshot inicial a 100 nodos + lazy load |
| WhatsApp Twilio sandbox pide verificación | Demo con mock UI, preparar video real off-stage |
| Demo se cae en vivo | Video pre-grabado listo en carpeta "backup" |

---

## Checklist previo a subir a escenario

- [ ] Demo grabado en video (full 3min, sin fallas).
- [ ] Dataset ficticio pre-cargado y verificado.
- [ ] Graph view se ve lindo con este dataset (colores, layout).
- [ ] Claude API key con saldo suficiente.
- [ ] WiFi garantizado (hotspot del celu de backup).
- [ ] Laptop con batería + cargador.
- [ ] Pitch ensayado 3 veces completo con timings.
- [ ] Slides base armadas con los hero moments.
- [ ] Frases clave memorizadas (no leer).

---

## Time budget realista (hackathon de 24-48h)

Asumiendo hackathon de 24 horas efectivas:

| Actividad | Horas |
|-----------|-------|
| Setup + smoke test (llmwiki funcionando, Graphiti instalado) | 2 |
| Integración Graphiti ↔ backend | 3 |
| Conversor multimodal (al menos 1 formato nuevo extra) | 2 |
| Graph Viewer (Cytoscape) | 4 |
| Chat vendedor UI + lógica | 3 |
| Campaign Cards UI + 1 campaña core funcionando | 3 |
| Data semilla + testing end-to-end | 2 |
| Pulido visual + animaciones | 2 |
| Grabación video backup + ensayo pitch | 3 |
| **Total** | **24h** |

Con 48h hay margen para WhatsApp real, más campañas, diseño más fino.

---

## Archivos que vamos a tocar (si alguien del equipo quiere mapear)

### De llmwiki (modificar)

- `web/app/` — agregar páginas `graph`, `chat-vendedor`, `campanas`.
- `web/components/` — agregar `GraphViewer`, `VendorChat`, `CampaignCard`.
- `api/app/routes/` — agregar endpoints `/graph`, `/vendor/ask`, `/campaigns`.
- `api/app/services/ingest.py` — enganchar Graphiti después de convertir a texto.

### Nuevos módulos

- `api/app/brain/graphiti_client.py`
- `api/app/brain/multimodal_converter.py`
- `api/app/brain/campaign_engine.py`
- `api/app/seed/fake_company.py` (dataset ficticio)

### De llmwiki (NO tocar, dejar como está)

- Auth, sessions, S3 uploads básicos, MCP original (lo dejamos como "modo wiki clásico" por si se rompe lo nuevo).

---

## Referencias

- [getzep/graphiti](https://github.com/getzep/graphiti) — Apache 2.0
- [lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki) — Apache 2.0, live: [llmwiki.app](https://llmwiki.app)
- [Cytoscape.js](https://js.cytoscape.org/) — MIT, graph visualization
- [Karpathy LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
