# 14 — Catálogo de estrategias de campañas

> El Cerebro le sugiere al dueño estrategias de campañas. El dueño aprueba. El sistema ejecuta como mensajes masivos segmentados por WhatsApp Business.

**Campaña = Audience × Message × Timing.**

---

## Principio

Cada campaña es:

1. **Audience**: segmento del grafo (no tags manuales — pattern en el grafo).
2. **Message**: template con slots personalizables por cliente, llenados por Claude.
3. **Timing**: cuándo se dispara (inmediato, programado, triggered).

El dueño ve la campaña sugerida + la audiencia exacta + preview del mensaje por 3 clientes aleatorios + botón **"Aprobar y lanzar"**.

---

## Las 7 campañas core

### 1. Clientes atrasados

**Audience**: clientes que superaron su frecuencia típica de compra.

```
MATCH (c:Customer)
WHERE c.last_purchase < datetime() - duration(c.median_gap_days × 1.5)
  AND c.lifetime_value > threshold
  AND c.opt_in = true
  AND NOT EXISTS { -- no contactados por esto en últimos 14 días
    MATCH (c)-[:TARGETED_BY]->(camp:Campaign {type: 'late_customer'})
    WHERE camp.started_at > datetime() - duration('P14D')
  }
```

**Mensaje template**:
> "Hola {name}, hace {gap_days} días que no nos compraste {usual_product}. ¿Necesitas reponer? Tenemos {current_stock_note}."

**Cuándo**: cron diario, agrupa por vendedor y le manda como briefing "hoy tenés estos 8 atrasados".

---

### 2. Clientes atrasados que NO respondieron

**Audience**: clientes que recibieron campaña "atrasados" pero no respondieron en 7 días.

**Diferencia clave**: tono distinto (más suave), mensaje distinto (no repetir lo mismo), quizás oferta para destrabar.

**Mensaje template**:
> "Hola {name}, entiendo que anduviste con mil cosas. Te dejo sabiendo que {current_offer_or_stock}. Si necesitas algo, acá estoy."

**Cuándo**: 7 días después de la campaña "atrasados" sin respuesta. Máximo 1 re-intento.

---

### 3. Clientes habituales (mantenimiento)

**Audience**: clientes con compra regular, dentro de ventana normal, alto LTV.

```
MATCH (c:Customer)
WHERE c.last_purchase >= datetime() - duration(c.median_gap_days × 0.8)
  AND c.purchase_count_last_6m >= 6
  AND c.lifetime_value >= threshold_high
```

**Uso**: cross-sell, heads-up de stock nuevo relevante, fidelización. **No es reactivación**, es mantenimiento.

**Mensaje template**:
> "Hola {name}, justo llegó {new_product_matching_your_taste}. Te acordaste de vos porque {reason_from_graph}. Si te interesa te reservo."

**Cuándo**: cuando hay stock nuevo con match, o cumpleaños del cliente, o aniversario como cliente.

---

### 4. Clientes viejos / dormidos

**Audience**: clientes con primera compra > 12 meses, última compra > 180 días, LTV histórico alto.

```
MATCH (c:Customer)
WHERE c.first_purchase < datetime() - duration('P365D')
  AND c.last_purchase < datetime() - duration('P180D')
  AND c.lifetime_value >= threshold_medium
```

**Uso**: reactivación profunda. Oferta fuerte, mensaje distinto, reconocimiento.

**Mensaje template**:
> "Hola {name}, hace tiempo que no cruzamos palabra. Se reactivó {product_or_category_you_liked} y pensé en vos. Como cliente de hace {years_as_customer} años, te dejo {special_offer}."

**Cuándo**: mensual o cuando hay oferta/stock relevante.

---

### 5. Renovación de stock (stock-triggered)

**Audience**: clientes que preguntaron por el producto que acaba de entrar.

```
MATCH (p:Product {id: $stocked_product})
MATCH (c:Customer)-[r:INTERESTED_IN]->(p)
WHERE r.strength >= 0.5
  AND NOT EXISTS {
    MATCH (c)-[:PURCHASED]->(p)
    WHERE timestamp > datetime() - duration('P60D')
  }
  AND c.opt_in = true
```

**Mensaje template**:
> "Hola {name}, llegó {product_name}. Me acordé que me preguntaste por esto {time_ago}. Te reservo {qty}?"

**Cuándo**: webhook de stock event → inmediato (con rate limit).

**Crítico**: es la campaña más del audio original. "Cuando entra stock de X producto, campañas a los clientes interesados en ese producto que no compraron hace poco".

---

### 6. Ofertas / promociones puntuales

**Audience**: segmento custom definido por el dueño o sugerido por el Cerebro.

Ejemplos:
- Clientes que compraron el producto complementario.
- Clientes de una zona geográfica específica.
- Clientes con presupuesto medio/alto según histórico.

**Mensaje template**:
> "{name}, esta semana tenemos {offer}. Por ser cliente {segment_name}, te aplica {discount}."

**Cuándo**: dueño define la oferta → Cerebro sugiere audience → dueño aprueba.

---

### 7. Cross-sell contextual

**Audience**: clientes que compraron producto X pero no Y, donde Y es complementario (detectado por el grafo).

```
MATCH (c:Customer)-[:PURCHASED]->(p1:Product)
MATCH (p1)-[:COMPLEMENTS {lift > 1.5}]->(p2:Product)
WHERE NOT (c)-[:PURCHASED]->(p2)
  AND (c)-[:PURCHASED]->(p1) WHERE timestamp > datetime() - duration('P90D')
```

**Mensaje template**:
> "Hola {name}, vi que te llevaste {p1_name}. La mayoría lo combina con {p2_name} — te interesa?"

**Cuándo**: semanal batch, cuando hay stock suficiente de p2.

---

## Campañas secundarias / backlog

### 8. Fechas especiales
- Cumpleaños del cliente.
- Día del padre / madre / niño / profesión relevante.
- Fin de año / temporada alta del vertical.

### 9. Recuperación de carrito WhatsApp
- Cliente preguntó en detalle, cotizó, y no cerró en 48h.

### 10. Clientes con reclamos cerrados
- Follow-up post-reclamo para recuperar confianza.

### 11. Nuevos clientes (onboarding)
- Primera compra → mensaje de bienvenida + heads-up de siguientes pasos.

### 12. Anuncio de nuevos productos
- Segmentación por patrón de interés histórico.

### 13. Re-stock de productos esperados
- Clientes que preguntaron por algo que "va a venir" → aviso cuando llega.

### 14. Liquidación
- Productos con rotación baja + clientes price-sensitive detectados en el grafo.

---

## Por qué el Cerebro puede sugerir esto (y no otros sistemas)

Cada campaña depende de **patterns en el grafo**:

| Campaña | Pattern grafo requerido |
|---------|-------------------------|
| Atrasados | `median_gap_days` por cliente (temporal) |
| Habituales | `purchase_count` agregado + `lifetime_value` |
| Viejos dormidos | Propiedades temporales de compra |
| Stock-triggered | `INTERESTED_IN` tipado extraído de conversaciones |
| Cross-sell | `COMPLEMENTS` entre productos con lift calculado |
| Ofertas segmentadas | Clustering / community detection |

Un CRM tabular no puede generar estas audiencias sin horas de queries SQL custom.

---

## UX de una campaña sugerida (dueño)

Cuando el Cerebro sugiere una campaña, el dueño ve:

```
┌──────────────────────────────────────────────────────┐
│  SUGERENCIA DE CAMPAÑA                               │
│  ──────────────────────                              │
│  Tipo: Clientes atrasados                            │
│  Audiencia: 23 clientes                              │
│  Tiempo estimado: 4 horas de vendedores humanos      │
│  Revenue potencial: ~$45k ARS                        │
│                                                      │
│  PREVIEW MENSAJE (Juan Pérez):                       │
│  "Hola Juan, hace 42 días que no nos compraste       │
│   mermeladas. ¿Necesitas reponer? Tenemos los        │
│   sabores nuevos de Dulce Barro."                    │
│                                                      │
│  [ Ver los 23 ] [ Editar mensaje ] [ ❌ ] [ ✅ Lanzar ]│
└──────────────────────────────────────────────────────┘
```

Previews: mostrar 3 clientes random. Si el dueño edita el template, el sistema re-personaliza los 23.

---

## Ejecución: quién manda los mensajes

Dos modos, configurables por el negocio:

### Modo A: Meta Business masivo

- Cuando se aprueba, el sistema dispara desde el número del negocio usando Meta Business API.
- Más rápido, más escalable.
- Cumple Meta policy (plantillas aprobadas + consentimiento del cliente).

### Modo B: Distribución a vendedores

- Cada vendedor recibe en su briefing una sub-lista de clientes a contactar.
- Vendedor manda desde su WhatsApp personal (más humano, mejor conversion).
- Cerebro tracking: marca qué mensajes se mandaron, qué respondieron.

**Default del MVP**: Modo A para simplicidad técnica del demo.

---

## Métricas por campaña

Para cada campaña ejecutada, el Cerebro trackea:

- **Delivery rate** (WhatsApp entregado).
- **Read rate** (leído).
- **Reply rate** (respondió).
- **Conversion rate** (compró en N días).
- **Revenue atribuida**.
- **Opt-out rate**.
- **Quejas / bloqueos**.

El dueño ve el ranking de campañas: cuáles rinden, cuáles no. El Cerebro aprende y sugiere mejor cada vez.

---

## Guardrails anti-spam

- **Frequency cap global** por cliente: máximo N mensajes de campaña por mes.
- **Cooldown** por campaña: no repetir la misma campaña al mismo cliente por X días.
- **Opt-out inmediato**: si cliente dice "stop" / "no me contactes" → out de todas las campañas, enforced a nivel grafo.
- **Horarios**: no mandar fuera de horario comercial local.
- **Dry run**: si la campaña supera N clientes, correr A/B con 10% primero, evaluar, luego full.

---

## Para el pitch (Bloque 4 del guión)

El demo muestra una de las 7 core — idealmente **Stock-triggered** (#5) o **Clientes atrasados** (#1), que son las más claras narrativamente.

Orden recomendado:

1. Trigger: llega stock (o es cron diario).
2. Cerebro genera card de sugerencia en la web app del dueño.
3. Dueño ve la preview.
4. Click "Lanzar" → los mensajes salen por WhatsApp.
5. Se ven respuestas en tiempo real llegando al Cerebro.

Ese flow completo, en 40 segundos, es el momento de venta del producto.
