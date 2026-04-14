# 03 — Producto

## Que es

Un agente de ventas WhatsApp con memoria de grafo. El dueño del negocio no ve el agente como "chatbot" — lo ve como un vendedor virtual que conoce a cada cliente, sabe que tiene en stock y decide cuando actuar.

Tres superficies:

1. **WhatsApp Business API** — donde el agente habla con clientes finales.
2. **Panel del escalador** — donde el humano ve conversaciones que requieren intervencion, con contexto completo.
3. **Vista del grafo** — donde el dueño/gerente visualiza el estado del negocio: clientes activos, perdidos, productos demandados, campanas corriendo.

## Usuarios

### Usuario primario: el vendedor / dueño de PyME

- **Perfil**: vende 100-2000 unidades/mes por WhatsApp. Tiene 1-5 empleados atendiendo. Usa planilla o CRM basico (Holded, Tiendanube CRM, Excel).
- **Dolor**: pierde ventas por no reactivar, no tiene tiempo de armar campanas manuales, el WhatsApp es un pozo donde entran consultas y se pierden.
- **Motivacion**: mas ventas sin contratar mas gente. Entender que pasa en el negocio.

### Usuario secundario: el escalador (humano que respalda al agente)

- **Perfil**: vendedor senior o el dueño mismo.
- **Trabajo**: revisa conversaciones que el agente marco como "necesita humano", cierra los casos complejos. Corrige al agente cuando se equivoca.
- **Expectativa**: no micro-manage. Intervencion quirurgica con contexto ya preparado.

### Usuario terciario: el cliente final

- **No sabe que habla con un agente** (o no le importa, siempre que la experiencia sea buena).
- **Espera**: respuestas rapidas, recomendaciones relevantes, no spam, continuidad entre conversaciones.

## Valor entregado

| Ejex | Antes | Despues |
|------|-------|---------|
| Reactivacion de stock | Manual, incompleta, tardia | Automatica, filtrada por interes real, inmediata |
| Retencion | Invisible (no hay calendario por cliente) | Proactiva (ping cuando se atrasa el ritmo) |
| Escalacion humana | Default (humano hace todo) | Selectiva (humano solo casos complejos) |
| Vista del negocio | Reportes tabulares promedio | Grafo navegable, visual, vivo |
| Queries del dueño | "cuantas ventas este mes" | "clientes que preguntaron por X y compraron Y hace 3 meses" |

## Diferenciales

### Vs CRM clasico (Holded, Pipedrive, Tiendanube CRM)

- **Datos**: ellos guardan, nosotros razonamos.
- **Estructura**: ellos tablas, nosotros grafo.
- **Queries**: ellos reportes predefinidos, nosotros preguntas en lenguaje natural.
- **Acciones**: ellos notifican al humano, nosotros ejecutamos.

### Vs chatbots WhatsApp (Callbell, Treble, Cliengo)

- **Memoria**: ellos session, nosotros grafo permanente.
- **Proactividad**: ellos reactivos, nosotros triggers propios.
- **Escalacion**: ellos handoff basico, nosotros handoff rico con contexto preparado.

### Vs agentes AI genericos (GPTs, plataformas no-code)

- **Verticalizacion**: nosotros WhatsApp commerce LatAm, ellos todo.
- **Infra de conocimiento**: nosotros grafo del negocio, ellos prompt largo.
- **Integracion real**: nosotros CRM + inventario + WhatsApp, ellos pegamento frail.

### Vs RAG vectorial clasico sobre conversaciones

- **Queries agregadas**: nosotros si, ellos no. "Clientes perdidos este trimestre" no se responde con similarity search.
- **Visualizable**: nosotros grafo, ellos embeddings opacos.
- **Actualizacion**: el grafo admite updates surgicos, los embeddings requieren re-indexing.

## Superficies del producto en detalle

### A. Chat WhatsApp (cliente final)

- Respuesta automatica a consultas.
- Cotizacion y armado de pedido.
- Notificacion proactiva de stock.
- Notificacion de "hace rato que no compras" (soft, no spam).

### B. Panel del escalador

- Cola de conversaciones marcadas para escalar.
- Por cada conversacion: resumen generado por el agente, intencion detectada, historial del cliente, sugerencia de proximo paso.
- Boton "tomar", "devolver al agente con indicaciones", "cerrar con nota".

### C. Vista del grafo (dueño/gerente)

- Graph view tipo Obsidian: nodos clientes / productos / campanas / conversaciones.
- Filtros: "clientes perdidos ultimos 30 dias", "productos mas preguntados sin stock", "campanas con mejor conversion".
- Click en nodo → panel lateral con detalle + historial temporal.

### D. Consola de reglas

- Editor simple para configurar:
  - Ventana de "no compro hace X" para cada categoria.
  - Condiciones de escalacion.
  - Tono del agente por segmento.

## Que NO es (para evitar scope creep)

- No es un CRM de reemplazo total (al menos no en el MVP).
- No es un e-commerce.
- No es un chatbot generico cross-industry.
- No es una herramienta de marketing masivo (anti-spam by design).

## Forma visible (como lo ve el usuario)

> "Instalo el conector WhatsApp + subo mi catalogo + conecto mi fuente de stock. En 24hs empiezo a ver el grafo del negocio y el agente empieza a contestar. En una semana veo la primera campana automatica salir sola."
