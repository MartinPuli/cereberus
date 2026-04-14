# 06 — Second Brain aplicado

## La idea trasladada

El paradigma de **LLM Knowledge Bases** (post de Karpathy) dice: el LLM no solo contesta, **construye y mantiene** una base de conocimiento estructurada. El humano aporta fuentes y preguntas; el LLM hace el bookkeeping.

Martin vive este paradigma personalmente (su wiki `wikiAssitant/` corre asi). Este proyecto **lo traslada al negocio**: el CRM del cliente es un "second brain del negocio" que el agente construye, mantiene y opera.

## Mapeo directo: personal → negocio

| Second brain personal | Second brain del negocio |
|-----------------------|--------------------------|
| `raw/` con articulos, PDFs, fotos | Conversaciones WhatsApp, pedidos, catalogo, stock events |
| `wiki/` con markdown compilado | Grafo de conocimiento con entidades y relaciones |
| Obsidian como frontend del usuario | Panel + graph view para dueño del negocio |
| `index.md` y summaries auto-mantenidos | Community summaries + narrative briefs generados por LLM |
| Wiki-ingest skill | Extractor LLM (Haiku) que procesa cada mensaje |
| Wiki-query skill | Query engine del agente (local + global search) |
| Obsidian-skills de kepano | Tool layer que opera sobre el grafo |

## Por que esto importa

### 1. Fuente unica

Hoy el conocimiento del negocio esta disperso: memoria del dueño, notas en WhatsApp del vendedor, planilla de pedidos, CRM a medias, Instagram DMs. Todo no-consultable en conjunto.

Con el second brain del negocio, **todo se unifica en el grafo**. Una sola consulta responde con todo el contexto.

### 2. Mantenimiento automatico

El dueño nunca "limpia el CRM". El agente ingiere continuamente y el linter semanal corrige inconsistencias (duplicados, datos faltantes, nodos huerfanos).

### 3. Evoluciona con el negocio

El grafo no es schema rigido — crece con la data. Si aparece una nueva categoria, un nuevo tipo de cliente, una nueva dimension (ej. "cliente con presupuesto ajustado"), emerge naturalmente como cluster.

### 4. Narrable

El dueño puede preguntar al sistema "¿que paso en el negocio el mes pasado?" y el second brain genera un **brief narrativo**, no una tabla. Como un chief of staff que leyo todo y te cuenta lo importante.

## Que tomamos de obsidian-skills

El set de skills publicado por kepano ([[entities/obsidian-skills]]) cubre:

- **Wikilinks perfectos** — para cross-referencing entre entidades del grafo en vistas markdown.
- **JSON Canvas** — para representar sub-grafos navegables visualmente.
- **Bases con filtros y formulas** — util para views tipo "clientes VIP este trimestre" configurables sin codigo.
- **Obsidian CLI** — util si queremos exportar el grafo a vault Obsidian del dueño (opcional).

**Decision**: para el MVP no dependemos de Obsidian como app. Pero **tomamos el paradigma** y las convenciones (markdown + wikilinks + frontmatter) como **formato de export**, para que el dueño pueda abrir su grafo en Obsidian si quiere una vista "humana".

## Lo que este proyecto agrega al paradigma

El paradigma original de Karpathy/kepano asume **un humano + un LLM** sobre conocimiento **personal** (notas, papers, research).

Nosotros lo extendemos a:

- **Multi-agente**: agente conversacional + extractor + community + query engine, orquestados.
- **Conocimiento de negocio vivo**: no papers estaticos, eventos en tiempo real (stock, conversaciones, pedidos).
- **Multi-tenant**: varios negocios, cada uno con su grafo aislado.
- **Accion**: el agente no solo responde, **actua** (manda mensajes, dispara campanas, escala).

## Loop de mantenimiento (analog a linting del wiki)

Cada semana (cron):

1. **Detectar inconsistencias**: cliente con dos numeros, producto con dos SKUs, etc.
2. **Rellenar gaps**: clientes sin categoria → inferir por compras pasadas.
3. **Proponer nuevas entidades**: si aparecen muchas menciones de una marca no registrada, crear nodo.
4. **Reportar al dueño**: "esta semana tu grafo gano X clientes, Y productos, Z relaciones. Estas 3 cosas requieren tu ojo."

Este loop es lo que hace que el second brain **crezca en calidad** sin trabajo manual.

## Referencias en el wiki personal de Martin

- [[concepts/llm-knowledge-bases]]
- [[concepts/wiki-compilation]]
- [[concepts/data-ingest-pipeline]]
- [[concepts/rag-vs-index-retrieval]]
- [[concepts/wiki-linting]]
- [[entities/obsidian-skills]]
- [[entities/kepano]]
- [[entities/andrej-karpathy]]
