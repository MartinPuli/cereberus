# 01 — Idea (canónica)

> Versión consolidada con todos los audios (2026-04-13 y 2026-04-14) + aclaraciones posteriores.
> Esta doc manda sobre cualquier contradicción con los 02-10 viejos.

## Problema

En LATAM, el **90% de las ventas B2B informales pasan por WhatsApp**. Ese mercado vive sin control:

- **El dueño no ve**: no sabe a qué clientes contactan sus vendedores, cómo, ni si están dejando ventas en la mesa.
- **El vendedor no sabe**: no tiene forma de priorizar el día. Trabaja a memoria y olfato, sin data de frecuencias ni historial estructurado.
- **El cliente se pierde**: cuando un cliente que pedía 10 empieza a pedir 6, nadie lo nota. Hasta que deja de pedir.

Los ERPs facturan. Los CRMs son tablas muertas. Nadie mastica la data para que se venda más.

## Solución — "El Cerebro"

Un **second brain del negocio** que cualquier empresa alimenta con lo que tiene (aunque sea desordenado) y que opera sobre dos canales:

1. **WhatsApp Meta Business del negocio** — vendedores preguntan "¿qué hago hoy?" y reciben plan priorizado.
2. **Chat web con login multi-usuario** — vendedores y dueño/gerente usan la misma interfaz con más contexto y vista del grafo.

### Las 4 capacidades core

**1. Ingesta multimodal desordenada**
- Imágenes (fotos de facturas, catálogos, etiquetas), audio (mensajes de voz, reuniones), texto (Excels destartalados, WhatsApp históricos, PDFs, notas, reglas de negocio sueltas).
- El Cerebro procesa, estructura, dedupe, relaciona. **Cero setup wizard**.
- Detalle: [13-ingest-multimodal.md](13-ingest-multimodal.md)

**2. Compilación a grafo (GraphRAG + two-DB)**
- DB normalizada clásica (pedidos, clientes, stock, facturas) — "la posta".
- Grafo de conocimiento encima — relaciones tipadas, summaries jerárquicos, temporal.
- Emergen solas **cosas locas**: calendario de frecuencias por cliente, detección de clientes en riesgo, clusters de productos complementarios.

**3. Asistente del vendedor (WhatsApp / chat web)**
- **Morning**: "¿qué hago hoy?" → lista priorizada: a quién contactar, con qué mensaje, por qué.
- **During**: consultas puntuales. "¿Qué le vendí a Juan los últimos 3 meses?", "¿quién más compró lo mismo que Pedro?".
- **EOD (end of day)**: "¿qué hago mañana?" → plan del día siguiente con lo que no se cerró hoy + oportunidades nuevas.

**4. Asistente del dueño/gerente (web app)**
- Vista del Cerebro (graph view navegable, partes del cerebro).
- **Sugerencias de estrategias de campañas** por segmento — el agente propone, el dueño aprueba, el sistema ejecuta.
- Detalle catálogo: [14-estrategias-campanas.md](14-estrategias-campanas.md)

## Usuarios

| Usuario | Canal | Qué hace |
|---------|-------|----------|
| Vendedor | WhatsApp Meta Business del negocio | Pregunta al agente qué hacer, ejecuta campañas, cierra pedidos |
| Vendedor | Chat web con login | Misma conversación + grafo + archivos, en oficina |
| Dueño/gerente | Web app | Ve el cerebro, aprueba campañas, configura reglas, ingestа fuentes |
| Cliente final | (NO habla con el agente) | Recibe WhatsApp del vendedor humano |

## Tesis

> "Siguen siendo agentes, solo que su DB/RAG hace que los resultados sean de mejor calidad."

El diferencial no es un agente nuevo — es la **base de conocimiento**. Dos DBs (normalizada + grafo) operadas por IA, alimentadas con cualquier formato, visualizables como grafo vivo, consumidas por vendedores en el canal que ya usan (WhatsApp).

## Referencia de producto

**Galo** es el caso real / beachhead. Hoy Galo tiene clientes pagando que todavía no venden más por tenerlos. El Cerebro es la capa de inteligencia que cierra ese loop: vendedores que saben qué hacer, dueños que ven el estado real del negocio, data masticada en accionables.

## Modelo de negocio

- **No por comisión de venta** (las ventas son informales, no nos van a pagar).
- **SaaS por conversación + por base de clientes del negocio** (modelo Twilio-like + Segment-like).
- **Tiers** por volumen (mensajes/mes, clientes en el grafo, cantidad de vendedores conectados).

Detalle: [08-modelo-negocio.md](08-modelo-negocio.md) (necesita realinear a B2B).

## Estrategia del hackathon

Decisión de equipo (audios 12:43 AM y 12:44 AM):

- **No es para validación en producción** — es para **demostrar que es tremendo**.
- **Tecnológicamente disruptivo** (Two-DB + Graph RAG + multimodal) + **chamuyo con fundamento**.
- Construido en 24 horas sobre un caso real (Galo) aunque el corte sea un mock.
- Antes del hackathon: charlar con Tomi para entender el pain real de Galo y alinear la narrativa.

## Por qué ahora

- **Graph RAG mainstream** (Microsoft 2024, papers abiertos, implementaciones en Kuzu/Neo4j/LightRAG).
- **Claude extrae entidades y relaciones con calidad de humano** — el cuello de botella del grafo automático se rompió.
- **Karpathy adoptó obsidian-skills de kepano** — señal de que Obsidian + agentes + markdown es stack estandarizado.
- **WhatsApp Business Cloud API** madura y ubicua en LATAM.
- **Multimodal input** (imagen/audio) barato y bueno en Claude 4.6 y otros modelos.

## MVP del hackathon — alcance

**Scope mínimo para demo "tremendo"**:

1. Ingesta: que coma un Excel desordenado + 3 imágenes + 2 audios de un negocio mock (o Galo real si tenemos permiso).
2. Compilación: grafo visible en web con ~50 nodos y relaciones tipadas.
3. Agente vendedor: responde "¿qué hago hoy?" por WhatsApp **o** chat web con 3-5 acciones priorizadas.
4. Agente dueño: muestra 2-3 estrategias de campaña sugeridas con botón "lanzar".
5. Demo: grafo interactivo en vivo + WhatsApp real con vendedor ficticio.

**No MVP**:
- Multi-tenant real.
- Integraciones con ERPs.
- Billing.
- Panel de administración completo.

## Alcance visual del pitch

El momento **wow** tiene que ser el grafo del negocio visualizado — eso es lo que nadie más tiene y lo que Martin remarcó varias veces: "ver el cerebro", "visualizar", "no tablas".

## Decisiones pendientes

1. ¿La ejecución de campañas masivas sale del Meta Business API del negocio o cada vendedor manda desde su WhatsApp personal? Probable: primero desde Meta Business (más simple técnicamente), los follow-ups individuales por el vendedor.
2. Dataset del demo: mock 100% o pedirle a Galo data real anonimizada.
3. Lineup: quién pitchea (Martin), quién corre el demo técnico, quién codea qué durante las 24h.
4. Charla con Tomi — cuando y con qué agenda.
