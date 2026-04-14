# 04 — Features

Tres features principales. Cada una tiene: **trigger**, **flujo**, **datos requeridos**, **user stories**, **criterios de exito**.

---

## Feature A — Stock-triggered campaigns

### Trigger

Evento de sistema: stock de un SKU pasa de 0 (o debajo de umbral) a cantidad > 0.

### Flujo

```
[Inventario update] 
    → Graph RAG query: "clientes con interes en SKU X, sin compra de X en los ultimos N dias"
    → LLM arma mensaje personalizado por cliente (tono, nombre, contexto previo)
    → Dispatcher WhatsApp envia (con rate limit)
    → Respuesta del cliente vuelve al agente
    → Si cliente compra → cierra pedido; si duda → agente responde; si complejo → escala
```

### Datos requeridos

- Inventario con timestamps de cambio.
- Historial de conversaciones por cliente parseado en el grafo (consultas, intenciones, productos mencionados).
- Historial de compras con timestamps.
- Preferencias de contacto (horario, canal, opt-out).

### User stories

- **Como dueño**, cuando llega un cargamento de zapatillas que no tenia, quiero que el sistema avise automaticamente a los 15 clientes que preguntaron por esas zapatillas el mes pasado.
- **Como cliente**, si pregunte por un producto sin stock, quiero que me avisen cuando llega — pero solo una vez, no spam.
- **Como escalador**, cuando 3 clientes responden al mismo tiempo, quiero que el agente maneje los simples y solo me llegue el caso complicado.

### Criterios de exito

- ≥80% de clientes con interes real reciben el aviso en ≤10 minutos de la carga de stock.
- ≥15% de conversion (respuesta + cotizacion).
- 0 clientes fuera del segmento objetivo contactados (no spam).
- Cliente opt-out es respetado 100%.

### Edge cases

- Cliente preguntó por X hace 6 meses y ya compró el reemplazo → no contactar.
- Cliente explicito "no me avises" → no contactar.
- Stock mínimo (1 unidad) → priorizar por interes mas fuerte / mas reciente.
- Multiple productos entran a la vez → agrupar en un mensaje cuando corresponda.

---

## Feature B — Customer frequency calendar

### Trigger

Proceso cron diario: por cada cliente, computa "dias desde ultima compra" y compara con su frecuencia historica tipica. Si excede umbral personal (ej. 1.5x su rango normal), dispara.

### Flujo

```
[Cron diario]
    → Por cada cliente activo:
        → Calcular frecuencia historica (mediana de gap entre compras)
        → Si gap_actual > umbral * frecuencia_historica:
            → Graph RAG: "ultimo producto comprado, categoria, conversaciones recientes"
            → LLM arma mensaje de reactivacion (no vendedor, no spam, tono del negocio)
            → Envia WhatsApp
    → Respuestas tratadas como conversacion normal
```

### Datos requeridos

- Historial de compras por cliente con timestamps.
- Clustering por categoria (un cliente puede tener ritmo distinto por categoria).
- Preferencias de tono del negocio (formal, informal, tutear/ustedear).
- Eventos relevantes (cumpleaños, fechas, aniversario de cliente).

### User stories

- **Como dueño**, quiero enterarme de los clientes VIP que dejaron de venir antes de que sea tarde para recuperarlos.
- **Como cliente**, si me olvido de comprar algo que compro regularmente, el negocio me acuerda con un tono amigable, no de venta desesperada.
- **Como agente**, si el cliente dice "no tengo plata ahora", no lo molesto de nuevo por 30 dias.

### Criterios de exito

- Deteccion de clientes "en riesgo" con ≥7 dias de anticipacion vs el dueño detectandolo manualmente.
- ≥20% de clientes reactivados compran dentro de los 14 dias siguientes.
- ≤2% de clientes respondiendo "no me molesten".

### Edge cases

- Cliente nuevo (<3 compras): no suficiente data para calcular frecuencia. Usar promedio de la categoria o no disparar.
- Cliente estacional (compra solo en fecha X): el modelo debe detectar estacionalidad, no confundir con churn.
- Cliente que cambio de categoria: no asumir que sigue con el mismo ritmo.

---

## Feature C — Wannabe human escalation

### Trigger

El agente, durante cualquier conversacion, detecta que se da uno de:

- Cliente molesto / tono agresivo.
- Objecion compleja (precio, garantia, pedido fuera de reglas).
- Oportunidad grande (ticket > X, cliente VIP).
- Ambiguedad legal o contractual.
- El agente no esta seguro y/o fallo 2 intentos.

### Flujo

```
[Agente en conversacion]
    → Detecta condicion de escalacion
    → Pausa la respuesta al cliente (aviso: "dejame consultar un segundo")
    → Genera handoff rico:
        - Resumen de la conversacion
        - Intencion detectada
        - Historial relevante del cliente (ultimas compras, ultima conversacion)
        - Sugerencia de proximo paso
    → Push a panel del escalador
    → Humano responde:
        a) "tomar" → humano sigue la conversacion
        b) "devolver con indicaciones" → agente continua con guia
        c) "cerrar con nota" → agente cierra con mensaje final
```

### Datos requeridos

- Conversaciones completas con turnos.
- Grafo del cliente (perfil, historial, interacciones pasadas).
- Reglas configurables de escalacion por negocio.
- Inbox del escalador (panel web o app).

### User stories

- **Como vendedor escalador**, cuando me llega una conversacion, quiero ver el contexto completo en 10 segundos y decidir.
- **Como cliente**, no quiero esperar 20 minutos mientras "me pasan con un humano". Si tarda, al menos que el humano ya sepa todo.
- **Como agente**, quiero aprender de cada escalacion (fue correcta? la devolvieron?) para mejorar mis futuros disparos.

### Criterios de exito

- Tiempo medio desde escalacion hasta primera respuesta humana: <2 minutos en horario laboral.
- ≥80% de escalaciones correctas (evaluadas por el humano con un boton "fue bien escalada").
- ≤5% de conversaciones escalan (el resto las maneja el agente solo).

### Edge cases

- Humano no disponible (fuera de horario) → agente avisa al cliente y promete contacto al dia siguiente; re-escala apenas el humano vuelve.
- Cliente no quiere humano → respetar y seguir con agente.
- Humano toma → como volver al agente sin romper el hilo.

---

## Features secundarias (backlog, no para MVP)

### Recomendador cross-sell basado en grafo

"Clientes que compraron X tambien compraron Y" — pero hecho con traversal del grafo, no con filtering collaborative clasico. Permite explicaciones ("te recomiendo Y porque compraste X y 8 clientes con perfil similar al tuyo tambien compraron Y").

### Historial temporal de nodos

Ver como cambio un cliente / producto / campana a lo largo del tiempo. El grafo es versionado. Util para entender "¿que paso con este cliente antes de que se fuera?".

### Deteccion de "fuente vigente"

Cuando hay contradiccion entre versiones de un dato (ej. direccion del cliente cambio), el grafo marca cual es la mas nueva y confiable.

### Agente propone campanas

El agente, viendo el grafo, propone al dueño: "hay 30 clientes que preguntaron por zapatillas talle 42 sin stock; acabas de cargar stock — ¿disparo campana?". Requiere confirmacion humana, no es automatica.

### Analytics conversacionales

"¿Por que perdimos ventas este mes?" → el agente analiza el grafo y responde con evidencia (conversaciones perdidas, objeciones mas frecuentes, productos sin stock mas pedidos).
