# 08 — Modelo de negocio

## Market

### Beachhead: WhatsApp commerce LatAm

- **Argentina, Mexico, Colombia, Peru, Chile**: mercados con altisima penetracion de WhatsApp como canal de venta.
- **Tamaño**: estimado 2M+ PyMEs venden activamente por WhatsApp en LatAm.
- **Segmento objetivo inicial**: negocios con 100-2000 unidades vendidas/mes por WhatsApp. Con empleados atendiendo (no solo-owner), ticket promedio $20-200 USD. Estructura: indumentaria, deportivos, cosmetica, mascotas, ferreterias pequeñas, repuestos, tech accessories.
- **Criterio de fit**: necesitan tener **catalogo con rotacion** (stock cambia) y **base de clientes recurrentes**. Las dos features core no sirven para negocios sin recurrencia (venta unica).

### Ampliacion futura

- Retail fisico con canal WhatsApp (cadenas pequeñas de 2-10 locales).
- Mayoristas B2B que toman pedidos por WhatsApp.
- Verticales adyacentes: e-commerce con chat integrado, DMs de Instagram.

## Pricing propuesto

### Modelo: SaaS mensual + variable por volumen

| Plan | Precio | Incluye | Para quien |
|------|--------|---------|------------|
| Starter | $49/mes | 1 WhatsApp, 500 clientes en grafo, 2k mensajes/mes, panel basico | PyME chica |
| Growth | $149/mes | 1 WhatsApp, 5k clientes, 10k mensajes, panel + graph view | PyME en crecimiento |
| Pro | $349/mes | 3 WhatsApp, 25k clientes, 50k mensajes, API access, customizacion | Cadenas / operaciones serias |
| Enterprise | custom | Multi-tenant, SLA, soporte dedicado, on-premise opcional | Grandes |

Variables:
- **Por sobre-consumo**: $X por 1000 mensajes extra, $Y por 1000 clientes extra.
- **WhatsApp conversation fees** (cobra Meta): pass-through + 10% markup.

### Rationale del pricing

- **Benchmark**: Treble/Callbell/Cliengo cobran $30-120/mes por chatbot WhatsApp. Nosotros premium (+30-50%) por el diferencial de grafo + proactividad.
- **Valor percibido**: si recuperamos 2 ventas/mes que antes se perdian → ROI evidente.
- **Unit economics**: gross margin objetivo 70%+ (costo infra ~$40-80/mes por cliente activo, precio $149+).

## Go-to-market

### Fase 1: Design partner (mes 0-3)

- **1-3 negocios** reales (empezar con SoyGalo u otro contacto directo).
- Precio: **gratis** a cambio de feedback, data real para entrenar y logo de caso.
- Foco: que el producto funcione end-to-end en 1 caso real. Sin producto-market fit no hay GTM.

### Fase 2: Early adopters pagos (mes 3-9)

- **10-30 clientes** en LATAM, preferentemente Argentina para iteracion rapida.
- Canales de adquisicion:
  1. **Warm intro** via red de Martin (hackathons, comunidad AI Collective, ex compañeros de trabajo con PyMEs).
  2. **Content marketing**: videos de casos reales, "antes y despues con el agente", thread Twitter/LinkedIn.
  3. **Demos en eventos** PyMEs (Expo Emprendedor, CACE, etc.).
- Precio: Starter/Growth.
- Foco: **retencion** (churn <5% mensual).

### Fase 3: Escalado (mes 9-24)

- **100-500 clientes**.
- Canales:
  1. **Self-serve**: landing + onboarding guiado + free trial 14 dias.
  2. **Partner program**: consultoras PyME, integradores de ERP/tiendanube, agencias digitales.
  3. **Referidos**: descuento por referidos activos.
  4. **SEO / content**: "como no perder ventas por stock" + casos.
- Expansion geografica: Mexico, Colombia.

## Competencia

### Directa

| Competidor | Como compite | Diferencia nuestra |
|------------|--------------|--------------------|
| Callbell | CRM + chatbots WhatsApp (plantillas) | Sin grafo, sin proactividad, sin escalacion inteligente |
| Treble | Campanas WhatsApp, segmentacion | Segmentacion con tags manuales; no razona, solo filtra |
| Cliengo / Landbot | Chatbots WhatsApp basicos | Reactivos, no proactivos, no tienen memoria |
| Tiendanube + chat | E-commerce con chat anadido | Son tienda primero, chat secundario |

### Indirecta

- **CRM clasicos** (Pipedrive, Holded, Zoho) con integracion WhatsApp → no tienen agente AI autonomo.
- **Chatbots AI genericos** (Chatbase, Voiceflow) → no verticales WhatsApp commerce LatAm.
- **Tiendanube/Shopify con sus agentes propios** → lock-in al e-commerce, no al canal WhatsApp.

### Hacer nada (null hypothesis)

- El negocio pierde ventas pero vive. Es nuestro mayor competidor.
- Respuesta: demostrar ROI claro y rapido (pagar el producto en una campana exitosa).

## Unit economics (proyeccion MVP)

Asumiendo cliente promedio Growth ($149/mes):

- **Ingreso mensual por cliente (ARPU)**: $149
- **Costo variable (infra + LLM + WhatsApp)**: ~$50
- **Gross margin**: ~$99 (66%)
- **CAC objetivo**: <$300 (payback ~3 meses)
- **LTV objetivo**: >$2000 (retencion 18-24 meses)
- **LTV/CAC**: >6x

## Riesgos del modelo

1. **Churn alto en PyMEs**: las PyMEs quiebran, cambian de sistema, tienen ciclos irregulares. Hay que tener offboarding decente y posibilidad de reactivar.
2. **Dependencia de Meta**: WhatsApp Business API puede cambiar reglas, precios, politicas. Mitigacion: diversificar canal (agregar Instagram DM, Telegram como secundario).
3. **Costos LLM**: un salto de precio de Anthropic / OpenAI rompe margen. Mitigacion: prompt caching, modelos pequeños para extractor, benchmarks con open source (Llama, Qwen) como plan B.
4. **Commoditizacion**: en 2-3 años, CRMs integran grafo + agente por default. Ventana de oportunidad: moats en data propietaria (benchmarks de negocios reales), integraciones profundas, brand en vertical.

## Moats defendibles

1. **Data propietaria**: patrones de compra + intereses anonimizados → mejores defaults para nuevos clientes.
2. **Templates por vertical**: prompts, reglas y schemas de grafo optimizados para cada vertical (indumentaria, deportivos, etc.) → mejor onboarding que generalistas.
3. **Integraciones profundas**: con ERPs LatAm (Holded, Tiendanube, Alegra) → switching cost alto.
4. **Brand en vertical**: ser "el agente para PyMEs que venden por WhatsApp" antes que sea obvio.

## Metricas que vamos a trackear

### Producto

- MAU (PyMEs activas)
- Mensajes/mes procesados
- Escalaciones/mes (y calidad)
- Conversion de campanas stock-triggered
- Reactivaciones exitosas (frecuencia)

### Negocio

- MRR, ARR
- Churn mensual (por segmento)
- CAC / LTV por canal
- NRR (net revenue retention) — expansion es clave
- NPS

### Tecnicas

- P50/P99 latencia de respuesta del agente
- % escalaciones correctas (evaluadas por humano)
- Costo LLM por cliente/mes
- Uptime

## Outputs posibles del hackathon

1. **Demo funcional con 1 PyME real** (SoyGalo).
2. **Pitch deck con numeros reales** del design partner.
3. **Landing simple** con waitlist para early adopters.
4. **Eleccion de modelo**: si el hackathon funciona tecnicamente, la decision siguiente es si **Atlas Corp / SoyGalo** lanzan esto como producto interno o como spin-off.
