# 19 — Catálogo de datos que una empresa puede tirar al Cerebro

> Lista concreta de fuentes que una PyME realmente tiene desparramadas por el negocio, el formato típico, qué extrae el Cerebro de cada una, y qué valor agrega al grafo.
> Sirve para tres cosas: (1) armar el seed dataset del demo, (2) mostrar en el pitch la amplitud de la ingesta, (3) responder "¿qué le pido al cliente para onboarding?".

---

## Principio core

**La empresa tira lo que tiene, en el formato en que lo tiene.** El Cerebro no pide estructura. Si está desordenado, el Cerebro lo ordena.

Regla del onboarding: "arrastrá todo lo que tengas de los últimos 2 años al drop zone. Lo que no pueda procesar te lo aviso. No filtres nada."

---

## Los 10 bloques de data ingestables

### 1. Conversaciones WhatsApp (la fuente más valiosa)

| Qué | Formato | Ejemplo real |
|-----|---------|--------------|
| Export de chat WhatsApp | `.txt` o `.zip` | Chat con Juan Pérez de los últimos 2 años |
| Historial de grupo | `.txt` | "Grupo Ventas Buenos Aires" con 12 vendedores |
| Media de chats | JPG, OGG, MP4, PDF | Fotos de productos pedidos, audios, contratos |
| Screenshots de chats | PNG | Captura del pedido que el cliente hizo por WhatsApp |

**Qué extrae el Cerebro**:
- `Customer`: nombre, teléfono, zona, tono de comunicación, idioma preferido.
- `Product` mentions: "mandame 10 de la rubia" → "Cerveza Quilmes 1L".
- `INTERESTED_IN` edges: "¿tenés el shampoo Pantene?" → edge a producto aunque no haya comprado.
- `PURCHASED` edges: "dale, mandame 5" → edge con timestamp.
- `FREQUENCY`: gap histórico entre pedidos del mismo cliente.
- `OBJECTION` tags: "me pareció caro", "llegó tarde", "no tenías el talle".
- `PREFERENCES`: "siempre el pago por transferencia", "entrega los martes".
- `RELATIONSHIP_CONTEXT`: cumpleaños, hijos, hobbies mencionados casualmente.

**Valor único**: lo que ningún ERP captura. Es el 80% del pain addressable.

---

### 2. Pedidos y facturas

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Export de ventas del ERP | CSV, XLSX | "ventas_2024.xlsx" con 15k filas |
| Facturas electrónicas AFIP | XML, PDF | Facturas tipo A/B/C |
| Remitos | PDF escaneado | Remito con firma del cliente |
| Tickets de caja | PNG / foto | Ticket de venta presencial |
| Nota de pedido escrita a mano | JPG, foto | Cuaderno del vendedor con pedidos |

**Qué extrae**:
- `Order`: fecha, cliente, total, items.
- `OrderItem`: producto, cantidad, precio pagado.
- `Payment`: método, monto, fecha.
- Historia de precios por producto (varía con el tiempo).
- Patrones de fin de mes, estacionalidad.

**Valor**: la "posta" del negocio. Alimenta la DB normalizada y el grafo temporal.

---

### 3. Catálogo de productos

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Lista de precios | XLSX, PDF | "Lista Precios Abril 2026" con 500 SKUs |
| Catálogo visual | PDF, JPG | Catálogo de mayorista con fotos |
| Inventario actual | XLSX, CSV | Stock en tiempo real |
| Fichas técnicas | PDF | Especificaciones del producto |
| Fotos de productos | JPG, PNG | Imágenes para mostrar al cliente |
| Video de producto | MP4 | Demostraciones cortas |

**Qué extrae**:
- `Product`: nombre canónico, SKU, categoría, marca, precio, variantes (talles, colores).
- `Category`, `Brand`: jerarquías.
- `Stock`: cantidades actuales.
- `ProductImage`: asociada para reutilizar en campañas.
- `COMPLEMENTS` / `SUBSTITUTE` entre productos (inferido).

**Valor**: el grafo sabe vender — conecta "lo que el cliente quiere" con "lo que la empresa tiene".

---

### 4. Base de clientes (CRM existente, por pobre que sea)

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Excel de clientes | XLSX | Columnas tipo "nombre, tel, dirección, último pedido" |
| Export de ERP | CSV | Exportación desordenada del CRM |
| Agenda del vendedor | Contactos del celu, VCF | 600 contactos en el teléfono |
| Lista de clientes VIP | TXT, notas sueltas | Post-it digital con "los importantes" |
| Tags manuales | Labels de WhatsApp | "Cliente fiel", "No llamar", "Nuevo" |

**Qué extrae**:
- `Customer` con deduplicación cross-fuente (¿"Juan" del WhatsApp = "Juan Pérez" del Excel?).
- Segmentos implícitos: VIP, riesgo, habitual, dormido.
- Relaciones: "cliente de Pedro (vendedor)".

**Valor**: consolidación. La empresa ya tiene la data, el Cerebro la une.

---

### 5. Audios (la fuente subestimada)

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Notas de voz del dueño | OGG, M4A | "Me llamó Juan, quiere 100 unidades para el viernes" |
| Audios de WhatsApp del cliente | OGG | Cliente pide productos por audio |
| Grabación de reunión de ventas | MP3, WAV | Reunión semanal de 45 min |
| Call con cliente | M4A | Conversación de negociación |
| Podcast/video de capacitación interna | MP3, MP4 | Cómo atender clientes difíciles |

**Qué extrae**:
- Transcripción → texto → mismo pipeline que WhatsApp.
- Intenciones, decisiones, pedidos, quejas.
- Tone analysis (cliente enojado → flag de alerta).
- Nombres de productos pronunciados (aunque mal dichos).

**Valor**: el 30% de la info del negocio viene por audio en LATAM. Nadie más la procesa.

---

### 6. Imágenes (cerebro visual)

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Fotos de facturas físicas | JPG | Factura del proveedor escaneada |
| Fotos de pizarrones | JPG | Pizarrón con "pedidos del día" |
| Fotos de estanterías | JPG | Para contar stock visualmente |
| Screenshots de competencia | PNG | Precios de la competencia |
| Flyers de promos propias | JPG, PDF | Flyer que se manda por WhatsApp |
| Etiquetas de productos | JPG | Foto de etiqueta con código de barras |

**Qué extrae** (Claude Vision):
- Texto OCR + contexto semántico.
- Items, cantidades, precios de facturas.
- Stock estimado de estanterías.
- Comparativos de precio.
- SKUs desde códigos de barras.

**Valor**: lo que hoy se fotografía y nunca se procesa, ahora vive en el grafo.

---

### 7. Documentos y archivos (el cementerio de info)

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Contratos con proveedores | PDF, DOCX | Acuerdo de descuentos |
| Propuestas comerciales | PDF, PPTX | Ofertas a clientes grandes |
| Planillas de control interno | XLSX | "Cobranza pendiente", "Deudas" |
| Notas de reuniones | DOCX, MD, TXT | Actas |
| Políticas internas | PDF | "Reglas de descuento por volumen" |
| Emails | EML, HTML | Correo corporativo con clientes |

**Qué extrae**:
- `BusinessRule`: reglas de pricing, descuentos, entregas.
- `Agreement`: acuerdos con clientes VIP.
- `CommitmentsPending`: promesas no cumplidas.
- Contexto histórico de decisiones.

**Valor**: la memoria institucional que vive en carpetas y nadie lee.

---

### 8. Campañas previas y marketing

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Historia de campañas de WhatsApp | TXT, screenshots | Mensajes enviados en el último año |
| Creatividades antiguas | JPG, MP4 | Flyers, videos promo |
| Métricas de campaña | XLSX, PDF | "Campaña Hot Sale 2025" — 300 enviados, 45 respuestas |
| Templates de mensajes | TXT, DOCX | Los 10 mensajes tipo que usa el vendedor |
| Listas de segmentación | XLSX | "VIP Buenos Aires", "Atrasados diciembre" |

**Qué extrae**:
- Templates que funcionan (A/B implícito de qué mensaje convirtió).
- Segmentos ya conocidos por la empresa.
- Métricas históricas para calibrar expectativas.

**Valor**: el Cerebro empieza **sabiendo** qué campañas le funcionaron a la empresa, no desde cero.

---

### 9. Datos operativos del día a día

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Rutas de vendedores | XLSX, Google Maps export | "Lunes: zona norte, martes: oeste" |
| Turnos y horarios | CSV | Horarios de atención por día |
| Gastos operativos | XLSX | Fletes, combustible, hospedaje |
| Pronóstico de ventas | XLSX | Targets del mes |
| Comisiones de vendedores | XLSX | Qué cobra cada uno |

**Qué extrae**:
- `Route`, `Schedule`, `Territory` por vendedor.
- Asociación vendedor ↔ zona ↔ clientes.
- Costos por cliente (ayuda a priorizar).

**Valor**: geografía e incentivos del negocio — nadie lo modela, nosotros sí.

---

### 10. Contexto externo (competencia y mercado)

| Qué | Formato | Ejemplo |
|-----|---------|---------|
| Listas de precios competencia | PDF, JPG | Screenshot de precios del competidor |
| Menciones en redes | Texto copy-paste | "Vi que en X venden esto más barato" |
| Noticias del sector | URL, PDF | Artículos sobre regulaciones |
| Tendencias de demanda | XLSX | Qué se vende en otras provincias |

**Qué extrae**:
- `Competitor`, `PriceBenchmark`.
- Relative positioning (somos más baratos / caros en X).
- Context para recomendaciones.

**Valor**: el Cerebro sabe **dónde** está parada la empresa en el mercado.

---

## Tabla resumen — qué subir para una demo completa

Para el demo del hackathon de Ferretería San Martín, con solo estos 10 archivos alcanza:

| # | Archivo | Formato | Tamaño | Qué aporta al demo |
|---|---------|---------|--------|---------------------|
| 1 | `ventas_2024_2025.xlsx` | Excel | ~2MB | 500 pedidos históricos |
| 2 | `clientes.xlsx` | Excel desordenado | ~100KB | 50 clientes con data mezclada |
| 3 | `lista_precios_abril26.pdf` | PDF | ~500KB | 80 productos con precios |
| 4 | `whatsapp_ventas_export.txt` | Texto WhatsApp | ~5MB | 2 años de chats con clientes |
| 5 | `factura_proveedor_042.jpg` | Imagen | ~1MB | Foto de factura para OCR |
| 6 | `estanteria_sector_A.jpg` | Imagen | ~2MB | Foto de stock |
| 7 | `nota_voz_luis_reunion.m4a` | Audio | ~3MB | Reunión del dueño con vendedores |
| 8 | `audio_cliente_pedido.ogg` | Audio | ~500KB | WhatsApp de voz del cliente |
| 9 | `reglas_descuento.docx` | Word | ~50KB | Política de descuento por volumen |
| 10 | `campanas_previas_2025.xlsx` | Excel | ~200KB | Historial de campañas |

**Total**: ~15MB. Procesable en 3-5 minutos con Claude Haiku.

**Al final del processing, el grafo tiene**:
- ~50 `Customer` nodes con deduplicación cross-fuente.
- ~80 `Product` nodes con categorías inferidas.
- ~500 `PURCHASED` edges.
- ~200 `INTERESTED_IN` edges (sólo WhatsApp).
- ~15 `OBJECTION` tags.
- ~5 `BusinessRule` nodes.

Gráfico bonito, suficientes relaciones para que las queries del vendedor y las sugerencias de campaña saquen resultados creíbles.

---

## Qué NO aceptamos (en el MVP)

Honestidad para el jurado:

| Formato | Por qué NO en MVP |
|---------|-------------------|
| Video largo (+10 min) | Costo de processing alto, ROI bajo |
| Imágenes técnicas (CAD, renders) | Fuera de scope B2B comercial |
| Data cifrada / bases SQL binarias | Requiere conector específico |
| APIs custom | Post-MVP con integraciones planeadas |
| Manuscritos cursivos ilegibles | OCR falla, mejor que el usuario tipee |

Se menciona en el pitch con honestidad: "en MVP procesamos los 10 bloques más comunes. Formatos raros quedan para v2 con integraciones custom."

---

## Onboarding ideal — lo que le pedimos al cliente real

Cuando se cierra un cliente (post-hackathon, producción), el mensaje de bienvenida es:

```
¡Bienvenido al Cerebro! Para que empiece a trabajar por vos,
tirá todo esto al drop zone (arrastrando o con el selector):

🗂️ Obligatorios (sin esto el Cerebro arranca muy pobre):
   - Export de tu WhatsApp de ventas (últimos 2 años)
   - Excel o CSV con tus ventas históricas
   - Excel o PDF con tu lista de clientes
   - Lista de precios actual

📸 Recomendados (te van a dar 3x más valor):
   - Fotos de facturas de proveedores (las últimas 10)
   - Audios de notas de voz tuyas sobre clientes/ventas
   - Screenshots de campañas que hiciste y funcionaron

💼 Si lo tenés:
   - Políticas internas de descuento o pricing
   - Rutas y zonas de tus vendedores
   - Métricas de campañas previas

🚫 No hace falta ordenar nada. El Cerebro ordena solo.

Una vez subido: tardamos 5-30 min (según volumen) y te avisamos
cuando el Cerebro esté listo para operar.
```

---

## Valor por fuente — ranking práctico

Si la empresa solo sube 1 cosa, que sea esta. Si suma una segunda, que sea la próxima.

| Prioridad | Fuente | Por qué |
|-----------|--------|---------|
| 1 | WhatsApp export | Tiene relaciones, intenciones, frecuencias, objeciones |
| 2 | Ventas históricas (Excel/ERP) | Structura el esqueleto del grafo |
| 3 | Lista de clientes | Dedupe + contactos + segmentos |
| 4 | Lista de precios | Productos canónicos |
| 5 | Notas de voz del dueño | Contexto que no vive en data estructurada |
| 6 | Fotos de facturas de proveedores | Cierra el loop compra → venta |
| 7 | Campañas previas | Calibra expectativas y estilos |
| 8 | Políticas internas | Reglas que el Cerebro respeta |
| 9 | Rutas de vendedores | Solo si tienen fuerza de ventas distribuida |
| 10 | Competencia | Nice to have |

---

## Para el pitch — línea clave

> "La empresa tira lo que tiene, como lo tiene. Excel desordenados, WhatsApp de 2 años, fotos de facturas, audios del dueño, notas en carpetas. El Cerebro come todo, lo ordena solo, y lo devuelve como grafo navegable. Cero setup wizard. Cero fricción. La PyME más informal de LATAM puede arrancar en 5 minutos."

---

## Referencias cruzadas

- Pipeline técnico de ingesta: [13-ingest-multimodal.md](13-ingest-multimodal.md)
- Priorización features hackathon: [16-features-prioritarias-5h.md](16-features-prioritarias-5h.md)
- Seed dataset para demo: (por crear, basado en este catálogo)
