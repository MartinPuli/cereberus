# 12 — Pitch 3 min (guión para presentación de fondo)

> Guión de 3 minutos alineado con la idea canónica: "El Cerebro" — ingesta multimodal + GraphRAG + agente de vendedores + sugerencias de campañas al dueño. Vía WhatsApp Business y chat web multi-usuario.

**Duración total**: 3:00 ± 0:10
**Tono**: directo, confiado, "tecnológicamente disruptivo + chamuyo con fundamento" (decisión de equipo).
**Moment wow**: el grafo del negocio visualizado en vivo.

---

## Arco del pitch

| Bloque | Tiempo | Objetivo | Slide de fondo |
|--------|--------|----------|----------------|
| 1. Hook | 0:00-0:20 | Frenar al jurado | Foto WhatsApp + frase impactante |
| 2. Pain triple | 0:20-0:55 | Meter el problema con concretos | 3 bullets + screenshots reales |
| 3. Insight | 0:55-1:25 | Por qué nadie lo resolvió | Two-DB diagram |
| 4. El Cerebro | 1:25-2:15 | Qué hace + cómo se usa | Ingesta → grafo → WhatsApp + campañas |
| 5. Demo wow | 2:15-2:40 | Momento visual | Grafo interactivo en vivo |
| 6. Cierre | 2:40-3:00 | "Es tremendo" | Logos + caso Galo + call to action |

---

## Guión completo

### Bloque 1 — Hook (0:00 - 0:20) — 20s

**Slide**: Screenshot de 47 conversaciones WhatsApp sin leer. Frase grande:
**"En LATAM, el 90% de las ventas B2B pasan por acá. Y nadie las está mirando."**

**Voz**:

> "En Latinoamérica, el 90% de las ventas B2B no pasan por un ERP, ni por un e-commerce, ni por un CRM. Pasan por **esto**: WhatsApp. Miles de millones de dólares en pedidos informales, y nadie los está midiendo, ni optimizando, ni entendiendo."

---

### Bloque 2 — Pain triple (0:20 - 0:55) — 35s

**Slide**: 3 columnas, animadas.

- **El dueño no ve**: no sabe a qué clientes contactan sus vendedores, cómo, ni si hay upselling.
- **El vendedor no sabe**: entra a trabajar sin prioridad clara. Trabaja de memoria.
- **El cliente se pierde**: pedía 10 mermeladas, ahora pide 6. Nadie lo nota hasta que deja de pedir.

**Voz**:

> "El pain es triple. El dueño paga sueldos y no ve nada: no sabe a quién contactan los vendedores ni cómo. El vendedor tampoco sabe: no tiene forma de priorizar el día, trabaja a olfato. Y el cliente — el que venía pidiendo diez unidades y ahora pide seis — se va. Y nadie se enteró. Los ERPs te facturan y listo. Los CRMs son tablas muertas. **Nadie está masticando esta data para que se venda más.**"

---

### Bloque 3 — Insight Two-DB (0:55 - 1:25) — 30s

**Slide**: Diagrama limpio con las dos bases.

```
    DB NORMALIZADA              EL CEREBRO (GraphRAG)
    ──────────────              ─────────────────────
    Pedidos                     Clientes ── INTERESTED_IN ──→ Productos
    Clientes                        │
    Stock                       PURCHASED_WITH_FREQUENCY
    Facturas                        │
    La posta.                   Campañas ← TRIGGERED_BY ── StockEvents
                                Resúmenes jerárquicos. Visualizable.
```

**Voz**:

> "El insight: este problema no se resuelve con otro CRM ni otro chatbot. Se resuelve **cambiando la estructura de la data**. Montamos dos bases. Una normalizada — la posta: pedidos, clientes, stock. Y arriba, **un cerebro** construido por IA que come **cualquier cosa** que el negocio tire adentro: Excel destartalados, WhatsApp históricos, fotos de facturas, audios de reuniones. Lo procesa y arma un grafo de conocimiento del negocio entero."

---

### Bloque 4 — El Cerebro en uso (1:25 - 2:15) — 50s

**Slide**: Tríptico.

- Izquierda: pantalla mostrando ingesta multimodal (imagen + audio + Excel entrando al sistema).
- Centro: WhatsApp del vendedor con mensaje del agente: "Hoy contactá a Juan..."
- Derecha: web app del dueño mostrando sugerencias de campañas.

**Voz**:

> "Cómo se usa. El dueño sube lo que tenga — imágenes, audios, textos, planillas, lo que sea. **Cero setup**. El Cerebro lo compila y emergen cosas locas: calendario de frecuencias por cliente, clusters de productos que se compran juntos, clientes atrasados, oportunidades de upsell.

> Y ahí empiezan dos flujos. **Uno, el vendedor**: por WhatsApp Meta Business o por chat web con login, pregunta: '¿qué hago hoy?'. El agente le responde: 'Contactá a Juan. Pedía diez mermeladas, últimas dos compras bajaron a seis. Ofrecele los estuches nuevos — le vendiste paté hace dos semanas.' Concreto. Accionable. Al final del día: '¿qué hago mañana?' y el agente arma el plan del siguiente día.

> **Dos, el dueño**: abre la web app, ve el cerebro y recibe **sugerencias de estrategias de campañas** — clientes atrasados, clientes que no respondieron, habituales, antiguos dormidos, ofertas, renovación de stock. El dueño aprueba, se disparan como mensajes masivos de WhatsApp segmentados."

---

### Bloque 5 — Demo wow (2:15 - 2:40) — 25s

**Slide**: Graph view en vivo — Obsidian Graph View o Cytoscape rotando. Zoom sobre un cluster.

**Voz**:

> "Miren esto. [pausa, dejarlos mirar] Este es el cerebro real de un negocio que vende por WhatsApp. Cada punto es un cliente o un producto. Las líneas, relaciones extraídas por Claude de conversaciones, pedidos, audios. [click] Este cliente preguntó tres veces por algo que no teníamos — ahora lo tenemos. [otro click] Este cluster: cuarenta clientes con patrón de compra similar. **Esto no existe en ningún CRM del mercado.** Y lo construimos automáticamente desde un Excel desordenado."

---

### Bloque 6 — Cierre (2:40 - 3:00) — 20s

**Slide**: Logos — Anthropic Claude, GraphRAG, Karpathy, kepano/obsidian-skills, Galo. Frase final:
**"Así se digitaliza el B2B informal de LATAM."**

**Voz**:

> "Por qué ahora. Claude procesa imagen, audio y texto con calidad de humano. GraphRAG es mainstream. Karpathy y el CEO de Obsidian empujaron este stack hace días. La ventana está abierta. Lo probamos con Galo, caso real en Argentina. **Esto no es un chatbot. Es la forma en que el B2B informal de LATAM se va a digitalizar. Gracias.**"

---

## Variantes por jurado

### Jurado técnico

Estirar Bloque 3 (Two-DB) + Bloque 5 (demo). Bajar Pain.

Frases candidatas:
- "Extractor multimodal con Claude Sonnet 4.6 — imagen, audio, texto en el mismo pipeline."
- "Community detection con Leiden, summaries jerárquicos à la Microsoft GraphRAG."
- "Kuzu embedded para el MVP, Neo4j Aura para prod. Prompt caching con breakpoints sobre catálogo + subgrafo relevante."

### Jurado producto/negocio

Estirar Bloque 2 (Pain) + Bloque 4 (uso). Bajar Insight.

Frases candidatas:
- "Cobramos por mensaje procesado + tamaño de la base de clientes. No por comisión — en LATAM informal nadie te paga comisión."
- "Dos millones de PyMEs en LATAM venden así. Ticket mensual $150 USD es justo."
- "Caso real: Galo. 15 clientes pagando. El cuello de botella es exactamente este."

---

## Notas de entrega

### Lo que tiene que transmitir

1. **Claridad del pain triple** — dueño, vendedor, cliente — sin buzzwords.
2. **Disrupción técnica** — Two-DB + ingesta multimodal + grafo, no "otro chatbot".
3. **Visual wow** — el grafo en vivo es la killer visual. Reservarle 25 segundos limpios.
4. **Confianza** — no leer. Pausas deliberadas en Bloque 5.

### Lo que NO decir

- "Revoluciona la industria" / "Next-gen AI" / "Disrupts sales" — buzzwords vacíos.
- "Mejor que Salesforce / Pipedrive" — no somos un CRM, no competimos directo.
- "100% automatizado" — el vendedor humano sigue siendo el que cierra.
- "Va a ser el próximo [X famoso]" — cringe.

### Atuendo visual

- Una imagen clave por bloque. Slides no saturados.
- Screenshots reales > mockups.
- Grafo en vivo **tiene que andar**. Backup: video de 20s grabado.
- Fuente grande, buen contraste.

### Contingencia

- **Si el demo falla**: "les muestro el video mientras reconecto" — video listo en desktop.
- **Si se cae internet**: grafo local + demo grabado.
- **Si se pasa de 3 min**: cortar Bloque 5 a 15s, mantener cierre fuerte.

---

## Slides sugeridos (para quien arme el deck)

1. **Portada** (0:00-0:20): foto WhatsApp + frase hook grande.
2. **3 pains** (0:20-0:55): 3 columnas con iconos + frases cortas.
3. **Two-DB** (0:55-1:25): diagrama limpio, minimalista.
4. **Tríptico del Cerebro** (1:25-2:15): ingesta / vendedor WhatsApp / dueño web campaigns.
5. **Demo en vivo** (2:15-2:40): graph view interactivo (o video fallback).
6. **Cierre** (2:40-3:00): logos + caso Galo + frase final.

---

## Cheatsheet final para el pitcher

- **Pain en 3**: dueño no ve, vendedor no sabe, cliente se pierde.
- **Solución en 4 pilares**: ingesta multimodal, compila a grafo, asistente vendedor WhatsApp, sugerencias de campañas al dueño.
- **Diferencial en 1 frase**: "dos DBs — normalizada + cerebro grafo — alimentadas por IA desde cualquier formato".
- **Caso real en 1 frase**: "Galo, 15 clientes B2B en Argentina, este es su pain real".
- **Cierre en 1 frase**: "así se digitaliza el B2B informal de LATAM".
