# 13 — Ingesta multimodal universal

> "Las empresas tiran info de cualquier tipo — imágenes, texto, audio, cualquier cosa — y el Cerebro la procesa."

Uno de los diferenciales más fuertes del pitch. Este doc detalla cómo funciona.

---

## Principio

**El sistema ordena, no el usuario.** La empresa no tiene que limpiar, estructurar, ni mapear nada antes de cargarlo. Tira lo que tiene y el Cerebro lo absorbe.

Esto mata el anti-patrón clásico de "setup wizard de 20 pasos" que matan la adopción en PyMEs.

---

## Formatos soportados

| Categoría | Formatos | Ejemplos reales del negocio |
|-----------|----------|------------------------------|
| **Imagen** | JPG, PNG, HEIC, PDF escaneado | Fotos de facturas, pizarrones, etiquetas, estanterías, pantallazos de WhatsApp, catálogos impresos |
| **Audio** | MP3, M4A, OGG, WAV | Notas de voz del dueño, reuniones con vendedores, calls con clientes, audios de WhatsApp |
| **Texto** | TXT, DOCX, PDF texto, MD, emails | Notas sueltas, contratos, listas de precios, reglas de negocio escritas |
| **Tabular** | XLSX, CSV, TSV | Excels de pedidos desordenados, listas de clientes, exports de ERP |
| **Conversacional** | Export WhatsApp (.txt/.zip), chats web | Históricos de años de conversaciones con clientes |
| **Estructurado** | JSON, XML | Exports de ERP/CRM existentes |

---

## Pipeline de ingesta

```
UPLOAD (drag&drop / API / WhatsApp inbound)
    ↓
TIPO DETECTION (mime + firma + sniff content)
    ↓
├── IMAGEN → Claude Vision → texto + bounding boxes + semántica
├── AUDIO → Whisper/Deepgram transcript → texto
├── TEXTO → passthrough + OCR si es scan
├── TABULAR → parser + schema inference
├── CONVERSACIONAL → WhatsApp parser → (speaker, timestamp, body)[]
└── ESTRUCTURADO → schema mapper
    ↓
CHUNK + ENRICH (contexto — de qué negocio, en qué fecha, subido por quién)
    ↓
LLM EXTRACTOR (Claude Sonnet/Haiku con schema estricto)
    → JSON: entities[] + relations[] + confidence scores
    ↓
VALIDATOR (schema + sanity checks)
    ↓
NORMALIZER (teléfonos E.164, nombres canónicos, productos dedup)
    ↓
ENTITY RESOLUTION (fuzzy + embedding + review queue)
    ↓
GRAPH UPSERT (idempotente, con source tracking)
    ↓
TRIGGER CHECK (¿hay campañas nuevas que disparar?)
```

---

## Por tipo — qué extrae el Cerebro

### Imagen

**Casos típicos**:

- **Foto de factura**: proveedor, items, cantidades, precios, fecha → nodos `Order`, `OrderItem`, `Product`, `Supplier`, relaciones `PURCHASED_FROM`.
- **Foto de estantería**: productos detectados, stock estimado → updates a `Product.stock_snapshot`.
- **Pantallazo de WhatsApp**: cliente, mensaje, timestamp → procesa como mensaje normal.
- **Pizarrón/anotación manual**: texto + semántica → notas asociadas al contexto.
- **Catálogo impreso**: productos con precios → bulk create `Product`.

**Tool**: Claude Sonnet 4.6 con vision + prompt de extracción estructurada.

### Audio

**Casos típicos**:

- **Nota de voz del dueño**: "me llamó Juan, quiere 10 unidades para el viernes, le dije sí pero no sé si tenemos" → `Conversation`, `Customer`, `INTERESTED_IN`, plus flag de verificar stock.
- **Reunión con vendedores**: decisiones estratégicas → `BusinessRule`s actualizados, `Campaign`s propuestas.
- **Call con cliente**: reclamo, pedido, negociación → análogo al WhatsApp.
- **Audio WhatsApp de cliente**: transcripción + procesado como mensaje.

**Tool**: Whisper large-v3 o Deepgram → texto → extractor LLM estándar.

### Texto / docs

**Casos típicos**:

- **Excel desordenado de pedidos**: LLM infiere columnas (aunque se llamen "col1, col2, cli, $") → mapea a `Order`, `Customer`, `Product`.
- **PDF de contrato**: cláusulas relevantes → `BusinessRule`s o notas.
- **Email/lista de precios**: catálogo → bulk `Product`.
- **Notas del dueño**: reglas sueltas, promesas a clientes, recordatorios → nodos con tags.

### Conversacional (WhatsApp export)

Gold mine. Un export de WhatsApp de años puede generar miles de nodos:

- Cada conversación → `Conversation`.
- Clientes mencionados/contactados → `Customer`.
- Productos pedidos/consultados → `Product` + `INTERESTED_IN` / `PURCHASED`.
- Objeciones recurrentes → tags.
- Patrones de frecuencia → alimentan `Customer.median_gap_days`.

---

## Prompt del extractor (esbozo)

```text
Eres un extractor de entidades y relaciones para el Cerebro de un negocio B2B.

Input: <contenido> (puede ser texto, transcripción de audio, o descripción de imagen).
Contexto: negocio=<nombre>, categoría=<categoría>, fecha_fuente=<fecha>.

Extrae:

ENTIDADES (tipo, id_sugerido, propiedades):
- Customer (name, phone, company, location, tags)
- Product (name, sku, category, brand, price_mentioned, notes)
- Order (timestamp, total, status)
- Category, Brand, Conversation, StockEvent, BusinessRule, Staff

RELACIONES (from, rel_type, to, propiedades):
- INTERESTED_IN (strength 0-1, reason)
- PURCHASED (qty, amount, date)
- MENTIONED_IN (conversation_id, position)
- COMPLAINS_ABOUT (subject, severity)

Reglas:
- Nunca inventes data. Si no está claro, marca confidence < 0.7.
- Teléfonos en E.164.
- Fechas en ISO 8601.
- Productos: nombre canónico + variantes observadas.

Output: JSON estricto.
```

---

## Entity Resolution (deduplicación)

Problema: la misma empresa la llamaron "Ferretería San Juan", "San Juan", "Juan de la ferretería" en distintas fuentes.

Proceso:

1. **Hash determinístico** por clave fuerte (teléfono E.164 normalizado, email).
2. **Fuzzy match** sobre nombres (Levenshtein + phonetic + embedding similarity).
3. **Context-aware matching** — usa contexto ("el de la ferretería" + teléfono en el Excel → match).
4. **Threshold por tipo**:
   - Auto-merge si similarity > 0.95.
   - Review queue si 0.7-0.95.
   - Nueva entidad si < 0.7.
5. **SAME_AS edges** cuando hay merge (historial de consolidación preservado).

---

## Source tracking

Cada nodo y edge guarda sus **fuentes**:

```
Customer(id=c123).sources = [
  { type: "whatsapp_export", file: "ventas-2025.zip", line: 3421, confidence: 0.92 },
  { type: "audio", file: "reunion_marzo.m4a", timestamp: "12:34", confidence: 0.85 },
  { type: "image", file: "factura_042.jpg", bbox: [...], confidence: 0.98 }
]
```

**Por qué**: auditoría, explicabilidad ("¿por qué pensás que Juan está interesado en X?"), y re-processing cuando mejoran los modelos.

---

## Re-processing

Cuando mejora el extractor (nuevo prompt, modelo nuevo), reprocessamos sources guardados sin re-pedir uploads:

- Diff entre grafo anterior y nuevo → updates.
- Flag de cambios significativos para revisión del dueño.

---

## Streaming vs batch

- **Streaming**: WhatsApp entrante y uploads pequeños (< 1MB) → extractor en < 30s.
- **Batch**: uploads grandes (historial de 2 años de WhatsApp, Excel de 10k filas) → Claude Haiku batch API (50% descuento), procesa en 1-24h.
- **Priority lane**: uploads flaggeados como "urgente, voy a pitchar mañana" saltan la cola.

---

## Demo moment de ingesta (para el hackathon)

En el pitch, 10 segundos de este flujo visible:

1. Dueño arrastra al Cerebro:
   - 1 Excel "pedidos2025.xlsx"
   - 3 fotos de facturas
   - 2 audios de WhatsApp
   - 1 export de WhatsApp
2. En pantalla aparece barra de progreso por tipo + contador de entidades creándose.
3. 20-30 segundos después: "300 clientes, 1200 productos, 8500 relaciones extraídas".
4. Click → graph view se ilumina.

Si ese momento se ve bien, el jurado ya está convencido.

---

## Costos aproximados (escala PyME)

| Operación | Modelo | Costo aprox |
|-----------|--------|-------------|
| Extractor texto | Claude Haiku 4.5 | $0.80/MTok input, $4/MTok output |
| Extractor imagen | Claude Sonnet 4.6 | $3/MTok + ~$0.005 por imagen |
| Transcripción audio | Whisper large-v3 (self-host) o Deepgram | ~$0.006/minuto |
| Embedding dedup | Voyage / OpenAI | ~$0.13/MTok |
| Graph store | Kuzu self-host / Neo4j Aura $65/mes | |

Para una PyME con 5k mensajes/mes + 10 archivos/semana: ~$10-30/mes en ingesta.

---

## Guardrails

- **PII**: los datos sensibles (DNI, tarjetas) se detectan y se cifran o scrubean.
- **Consentimiento**: el dueño acepta términos explícitos sobre ingestar conversaciones con clientes (compliance WhatsApp / privacidad).
- **Data retention**: configurable por negocio (default: 2 años).
- **Derecho al olvido**: un cliente puede pedir eliminación → cascade delete en grafo (o anonymización según política).
