# 02 — Pitch

## One-liner

> El primer agente de ventas WhatsApp que trabaja sobre un **grafo de conocimiento del negocio**, no sobre una base vectorial ni sobre tablas. Dispara la venta cuando entra stock, retiene al cliente que se esta yendo y escala al humano solo cuando hace falta.

## Hook (para abrir el pitch)

> "Cuando entra stock de un producto, ¿quien llama primero a los 40 clientes que preguntaron por ese producto el mes pasado? En el 95% de las PyMEs argentinas: nadie. Ese inventario rota a quien vuelve por casualidad. Nosotros hacemos que la primera llamada la haga un agente, antes que nadie."

## Pitch 30 segundos

Las PyMEs que venden por WhatsApp pierden plata en dos lugares: el stock que llega y rota sin avisar a los interesados, y el cliente que deja de venir sin que nadie lo note. Nuestro agente corre sobre un grafo de conocimiento del negocio — clientes, productos, interacciones, intereses — y dispara las dos acciones solo: cuando entra stock con match de interes, y cuando un cliente se atrasa respecto a su ritmo. El humano queda de escalador, no de operador. Probamos primero con SoyGalo y buscamos PyMEs que vendan +100 unidades por mes por WhatsApp.

## Pitch 2 minutos (estructurado)

### 1. Problema (30s)

Miles de PyMEs venden por WhatsApp. El vendedor humano recibe la consulta de producto, ve que no hay stock, promete avisar y se olvida. Cuando llega el stock, nadie agarra la lista de interesados porque:

- El CRM no tiene triggers de inventario.
- Las conversaciones estan en WhatsApp, no en la base de datos.
- Un vendedor no escala para armar la lista a mano cada vez.

Resultado: el stock rota a quien vuelve por casualidad y la demanda latente muere.

Segundo problema, gemelo: cada cliente tiene un ritmo propio. Cuando se atrasa, nadie lo detecta. Los reportes son promedios globales que no dicen nada.

### 2. Solucion (40s)

Un agente de WhatsApp con tres comportamientos proactivos:

- **Stock-triggered campaigns**: llega stock del producto X → el agente cruza con el CRM → identifica clientes con interes previo en X sin compra reciente → manda WhatsApp personalizado.
- **Customer frequency calendar**: el grafo sabe el ritmo de cada cliente. Cuando se atrasa, el agente dispara un ping proactivo.
- **Wannabe human**: el agente opera por default. Cuando detecta objecion compleja, cliente molesto o oportunidad grande, escala al humano con resumen + contexto + sugerencia.

### 3. Diferencial tecnico (30s)

La magia no es el agente. Es la **base de conocimiento**. Construimos el CRM como **grafo** usando Graph RAG: entidades (clientes, productos, interacciones) y relaciones tipadas extraidas automaticamente de las conversaciones. Esto habilita queries que un CRM tabular o un RAG vectorial no pueden: "clientes que preguntaron por X y compraron Y hace 3 meses", "clientes que se perdieron este trimestre y que producto los traia".

Y es **visualizable**. El dueño del negocio ve el grafo, no una base vectorial opaca.

### 4. Validacion y ask (20s)

Partimos de un caso real: SoyGalo, donde estamos construyendo el agente. Usamos el hackathon para extender el stack a Graph RAG y validar con data real. Ask: feedback tecnico y contactos en PyMEs que vendan +100 unidades/mes por WhatsApp.

## Variantes del hook por audiencia

| Audiencia | Hook |
|-----------|------|
| Jurado tecnico | "Armamos un CRM que es un grafo, no tablas. El agente hace traversal, no similarity search. Cambia la calidad de las queries." |
| Jurado producto | "Convertimos al vendedor humano en escalador. El agente opera. La PyME recupera el stock que rotaba a ciegas." |
| Dueño de PyME | "¿Cuantos clientes preguntaron por productos que no tenias el mes pasado? ¿Cuantos los llamaste cuando llegaron? Nosotros lo hacemos solos." |
| Inversor | "Cada CRM del mundo va a ser un grafo en 2 años. Empezamos con un vertical (WhatsApp commerce LatAm) donde nadie lo hizo aun." |

## Anti-objeciones preparadas

| Objecion | Respuesta |
|----------|-----------|
| "Esto es un CRM mas" | El CRM tabular no puede responder las queries que nosotros si. La diferencia es la estructura de datos, no la UI. |
| "Son solo reglas de negocio" | Las reglas son la capa 0. El agente maneja el lenguaje natural de WhatsApp, entiende intencion implicita, personaliza el mensaje. |
| "¿Por que grafo y no SQL?" | Las queries relevantes son de traversal: "cliente → interes → producto → stock → campana". SQL las hace con joins caros y pierde el contexto semantico. |
| "¿Y si el cliente no quiere el mensaje?" | El humano valida la primera campana por cliente. A partir de ahi, respeta preferencias aprendidas. |
| "¿Competis con Zapier / Make?" | Zapier dispara acciones. Nosotros razonamos sobre el grafo antes de disparar. Es una capa arriba. |

## Slogan candidatos

- "Tu CRM habla."
- "El agente que conoce a tus clientes mejor que vos."
- "Del stock al WhatsApp, solo."
- "CRM que entiende, no solo guarda."
