# 18 — Preguntas duras de jueces — con respuestas completas

> Banco adversarial de preguntas que un jurado filoso puede tirarte después del pitch.
> Cada una con **respuesta lista para decir en voz alta** (párrafo o dos, defendible).
> Modo justkill: privilegiá honestidad quirúrgica sobre chamuyo. Los jurados huelen chamuyo.

**Regla de oro**: si no tenés el dato, decís "mi hipótesis es X, el dato real lo busco post-hackathon". Nunca inventes números.

---

## 🎯 Las 4 que vos ya anticipaste

### Q1. ¿Cómo consiguieron sus primeros usuarios y cuánto cuesta uno nuevo hoy?

**Trampa**: mide si ya validaste o si estás sólo imaginando.

**Respuesta** (say it out loud):

> "Cero usuarios del Cerebro porque nació hoy en el hackathon. Pero no arrancamos de cero en distribución: Galo, la empresa donde trabajo como dev AI, tiene 15 empresas pagas hoy con un producto adyacente. Esas 15 son nuestros primeros 15 beta testers naturales la semana que sale el MVP. CAC hoy: $0, porque es un cross-sell a la base existente. CAC post-cross-sell, para los siguientes 100: lo estimamos $200-400 USD asumiendo canal partner via integradores de ERPs, lo validamos en las próximas 8 semanas."

**Lo que NO decir**: "tenemos X miles de usuarios en lista de espera".

**Contra-ataque si te presionan**: "La pregunta relevante no es si validamos el producto específico — nace hoy. La pregunta es si hay canal de distribución validado. Respuesta: sí, Galo tiene pipeline de 300 prospects en el vertical de distribución mayorista de alimentos."

---

### Q2. ¿Cómo piensan adquirir los siguientes 1,000 usuarios?

**Trampa**: pide plan concreto, mata el chamuyo vaporware.

**Respuesta**:

> "Tres canales, en este orden. Uno: expansión dentro de Galo, del cross-sell a la base de 15 clientes actuales hacia el pipeline de 300 prospects ya identificados. Ese es 0 a 200 clientes sin CAC incremental. Dos: programa de revendedores con integradores de ERPs PyME — Holded, Tiendanube, Alegra — les damos 30% recurrente por cliente traído. Ese canal históricamente convierte en LATAM. Tres: contenido orgánico técnico sobre GraphRAG aplicado a CRM, espacio SEO vacío en español, de cero competencia. Tres, cuatro artículos top y atajamos 5k visitas/mes orgánicas. Lo que NO planeamos: paid ads frío a PyMEs. CAC no cierra con ticket de $150/mes."

**Si presionan**: "¿A cuánto tiempo los 1000?" — "24 meses si los canales funcionan. 36 si falla el segundo."

---

### Q3. ¿Por qué las empresas no adoptan CRM/ERP/e-commerce existentes?

**Trampa**: desafía la premisa core.

**Respuesta**:

> "Las adoptan. Mal. Por observación en Galo: casi el 100% de nuestros clientes pagan un ERP —Holded, Tiendanube, Xubio— pero sus vendedores no lo abren. El ERP es para facturar al final del mes, no para operar. Las ventas suceden en WhatsApp. El problema no es falta de software. Es que el software tradicional pide data estructurada que el vendedor informal no genera, y pide cambiar de interfaz para hacer trabajo que hoy hace en WhatsApp. Nosotros operamos DESDE WhatsApp, no en paralelo. Le damos al vendedor el cerebro ahí, donde ya vive."

**Si presionan por el dato**: "El 100% de los que observamos en Galo. No tenemos estudio formal. Primera cosa a medir post-hackathon: survey a 50 PyMEs de 'qué ERP pagan vs cuánto lo usan diariamente'."

---

### Q4. ¿Qué hace inútiles a las soluciones existentes? Dame un ejemplo concreto.

**Trampa**: pide ejemplo concreto, no generalidad.

**Respuesta**:

> "Caso real de un cliente de Galo: un distribuidor mayorista de mermeladas. Vende a 300 almacenes pequeños de Buenos Aires por WhatsApp. Un vendedor maneja 60 cuentas. Los clientes le escriben cosas como: 'Hernán, mandame lo de siempre' o 'che, lo del lunes pasado pero sin el paté'. Ningún CRM tabular captura qué es 'lo de siempre' por cliente, salvo que alguien lo cargue a mano. El vendedor no puede — son 60 clientes con 40 productos, 2400 combinaciones. Un grafo con nodos Customer → `PURCHASED_WITH_FREQUENCY` → Product resuelve esa consulta en milisegundos, extraído automáticamente de 2 años de WhatsApp histórico. Eso no lo hace Holded, Pipedrive, Salesforce, Tiendanube ni ningún CRM del mercado."

**Si dudan**: "Te muestro la conversación anonimizada si querés."

---

## 🧠 Sobre el PROBLEMA

### Q5. Dame 3 empresas concretas, con nombre, que hoy pagarían por esto.

**Respuesta**:

> "Mis 3: [Nombre cliente 1 de Galo], [Nombre 2], [Nombre 3]. Son clientes de Galo hoy. Los conozco por nombre, sé su volumen de ventas mensual, sé cuántos vendedores tienen. La conversación de 'esto te interesaría' no la tuve formalmente — eso queda para la semana 1 post-hackathon."

**(Antes del pitch, poné 3 nombres reales acá, aunque sean de PyMEs amigas.)**

**Si no los tenés**: "Honestamente, no. Tengo patrones observados en Galo, pero no conversaciones específicas de 'pagarías $X por esto'. Esa es la primera validación post-hackathon. Si la respuesta es no, matamos el producto."

---

### Q6. ¿Cuándo fue la última vez que una empresa te dijo literalmente "necesito esto"?

**Respuesta**:

> "Literal esas palabras, nunca. Lo más cerca: en Galo hace 3 semanas, un cliente nos dijo 'mi vendedor me escribe cada lunes y le tengo que explicar qué le vendí el mes pasado — ¿no hay forma de que sepa?' Eso es la demanda en sus palabras. No es prueba, es señal. Tenemos que validar con entrevistas estructuradas — es el trabajo de las próximas 4 semanas."

**Lo que NO decir**: "Todos me lo piden", "Es obvio que lo necesitan".

---

### Q7. ¿Cuánto pierde por año una PyME por no tener esto?

**Respuesta**:

> "Hipótesis con matemática redonda: cliente promedio de Galo factura $30k USD/mes, ticket promedio $150 por venta. Si recuperamos 2 ventas/mes que antes se perdían por clientes atrasados no reactivados, son $300/mes incrementales. Anual: $3.6k USD de upside. Si además evitamos 1 cliente churneado por trimestre (LTV $5k), son $20k/año. Nuestra tarifa propuesta: $150/mes = $1.8k anual. ROI: 13x en el caso conservador. Dato real vs hipótesis: tengo Galo validando esto la próxima semana con 3 pilots internos."

---

### Q8. ¿Probaron la cosa más tonta que funciona antes de construir todo esto?

**Trampa**: justkill puro. Si no probaste lo dumb, estás construyendo fancy de más.

**Respuesta**:

> "Sí, lo probamos. En Galo hace 2 meses un product manager arma manualmente 2 campañas por mes: revisa el Excel de pedidos, identifica 'atrasados' por intuición, arma los mensajes en Google Docs y los pasa a vendedores por WhatsApp. Funciona. Genera revenue. Pero: tarda 1 día de trabajo cada vez, no escala a más de 2 campañas/mes, y no captura patrones que no sean obvios. El Cerebro es lo que haría ese PM si fuera 100 PMs trabajando 24/7 con acceso al grafo completo. La validación de que el pain es real está en que alguien ya lo hace a mano."

**Si no lo probaste**: "Honesto: no. Lo primero que haríamos post-hackathon es correr la versión manual 4 semanas con un humano. Si ahí no hay revenue incremental, matamos el producto."

---

## ⚙️ Sobre el PRODUCTO y lo TÉCNICO

### Q9. ¿Qué pasa cuando el LLM alucina una entidad o relación en el grafo?

**Respuesta**:

> "Guardamos confidence score por nodo y arista. Por debajo de 0.7 va a una review queue que el dueño ve en el onboarding. Por encima de 0.9 entra directo al grafo. Entre medio hay semi-auto-merge. Además, todo hecho del grafo trackea sus fuentes — si hay que revertir una alucinación, la vemos y la removemos puntualmente. En producción, esperamos 3-5% de error tolerable porque el grafo sirve para SUGERIR, no decidir. El humano aprueba antes de cualquier acción externa."

---

### Q10. ¿Cuánto cuesta en tokens procesar un historial de WhatsApp de 2 años?

**Respuesta**:

> "Estimación con números redondos: 500k mensajes/año × 2 años = 1M mensajes. Promedio 30 tokens input por mensaje = 30M tokens. Con Claude Haiku batch API: $0.40 por millón de tokens input, $4 por millón de output. Output es ~10% del input. Total ingesta inicial: ~$15 por cliente. Mensual recurrente después: $5-15 según volumen. Gross margin se mantiene por encima de 70% en tiers $100+/mes. Detalle de costos en nuestro doc técnico interno."

---

### Q11. ¿Qué hace el sistema cuando los clientes responden en emojis o jerga regional?

**Respuesta**:

> "Claude maneja jerga argentina, chilena, mexicana con alta precisión — lo testeamos en Galo con mensajes reales. Para casos ambiguos, dos estrategias: uno, el grafo marca confidence bajo y guarda el raw; dos, la próxima interacción con el mismo cliente se usa para desambiguar. Si escribe 'quiero la rubia' tres veces y siempre le mandan Quilmes, la relación se consolida sola. Hay un long-tail que falla — lo aceptamos, el humano revisa 5% de los casos."

---

### Q12. ¿Qué pasa si Meta cambia la política de WhatsApp Business?

**Respuesta**:

> "Riesgo real. Tres mitigaciones. Primero: usamos BSPs oficiales whitelisteados — Messagebird, Twilio — para minimizar riesgo de compliance. Segundo: el valor del Cerebro no depende del canal, depende de la data estructurada. Si Meta cierra, el Cerebro sigue sirviendo para Instagram DM, Telegram, email, SMS. Tercero: el onboarding de canales alternativos está en el roadmap de los primeros 6 meses. Si la amenaza se materializa, pivoteamos canal manteniendo el producto."

---

### Q13. ¿Por qué Graph RAG y no RAG vectorial? Convenceme que no es over-engineering.

**Respuesta**:

> "Tres queries que RAG vectorial no resuelve y son esenciales. Uno: 'dame los clientes que compran como Pedro' — requiere traversal, no similarity de texto. Dos: 'qué productos se mencionan juntos en conversaciones sin haberse comprado juntos' — requiere aristas tipadas. Tres: 'cuál cliente se atrasó respecto a SU propio ritmo histórico' — requiere propiedades temporales. Vectorial te devuelve chunks parecidos, Graph RAG te devuelve respuestas. Podemos hacer un side-by-side: prompt idéntico, las respuestas van a ser significativamente diferentes."

---

### Q14. ¿Cómo evitan que el vendedor mande campaña a un cliente que dijo "no me molestes"?

**Respuesta**:

> "Opt-out se guarda como property persistente del nodo Customer y como edge `OPTED_OUT_AT`. Es enforced a nivel de query — toda query de audiencia filtra `opt_in = true` obligatoriamente. El LLM nunca lo ve como decisión, es una constraint del sistema. Además: Meta Business API requiere opt-in explícito para templates de marketing, es compliance by design. Si alguien escribe 'no me contactes' el sistema lo detecta automáticamente y lo remueve de todas las campañas futuras."

---

### Q15. ¿Qué hacés mejor que contratar un Customer Success por $2k/mes?

**Respuesta**:

> "Nada, si tu empresa tiene 50 clientes. Mucho, si tiene 500 o 2000. Nuestro target son PyMEs con 500+ clientes — ahí un CS solo no da. Pero la pregunta está mal planteada: no competimos contra el humano, lo amplificamos. Un CS con el Cerebro es 10x más efectivo porque entra al día con el briefing ya armado. No reemplazamos al humano. Eliminamos la tarea invisible de 'masticar la data' que hoy se hace mal o no se hace."

---

## 💰 Sobre el MODELO DE NEGOCIO

### Q16. ¿Cómo le cobrás a una empresa informal?

**Respuesta**:

> "La empresa es informal con el fisco, no con sus proveedores. Tiene CBU, tarjeta corporativa, cuenta bancaria. Nosotros somos un proveedor más. Débito automático mensual o tarjeta. Monotributo en Argentina, factura B. No hay fricción legal. Lo que sí es distinto vs un CRM corporativo: ticket bajo ($100-300/mes), onboarding rápido, decisión tomada por el dueño solo, cero procurement."

---

### Q17. ¿Cuánto está dispuesta a pagar una PyME LATAM?

**Respuesta**:

> "Benchmark del mercado: Callbell $40-120/mes, Treble $60-200/mes, Tiendanube Pro $50/mes para su vertical. Nosotros proponemos $100-300/mes para PyMEs con 500-2000 clientes en el grafo. Premium vs competidores porque damos 10x más: campañas automáticas, grafo navegable, briefing diario al vendedor. Si el cliente recupera 2 ventas por mes, se paga solo 20 veces. Hicimos benchmarking con 8 productos adyacentes — nuestro precio cae en el percentil 60."

---

### Q18. ¿Qué evita que Tiendanube, Mercado Libre o Callbell copien esto en 6 meses?

**Respuesta**:

> "Honestamente: nada estructural en 6 meses. La tecnología no es defensible sola. Lo que sí se construye en 18-24 meses: data propietaria de patterns de compra LATAM, integraciones profundas con ERPs regionales, templates verticales por industria, y brand en 'el producto que sabe de WhatsApp commerce LATAM'. La ventana de oportunidad es pequeña y lo sabemos. Por eso queremos salir ya. Si un grande nos copia, dos escenarios: salimos primero y ganamos vertical, o nos compran por talento y distribución. Los dos son exit válidos."

---

### Q19. ¿Cuál es tu LTV/CAC y en cuánto tiempo recuperás el CAC?

**Respuesta**:

> "Hipótesis con los números del plan: ARPU promedio $150/mes, churn objetivo 3%/mes, LTV estimado $5k. CAC objetivo sub-$500 en canal partner, payback 3-4 meses. LTV/CAC de 10x en el caso base, 5x en el conservador. Son proyecciones, no hechos — lo validamos con los primeros 50 clientes. Si en mes 6 el CAC real supera $800 o el payback supera 9 meses, repensamos GTM."

---

### Q20. ¿Por qué no te compran, contratan o copian las empresas con distribución?

**Respuesta**:

> "Escenario posible y no necesariamente malo. Si Tiendanube, Holded o un grande del sector decide adquirirnos, es un exit válido en pre-Seed o Seed. Nuestro objetivo con el hackathon y los próximos 6 meses es construir (a) tracción suficiente para que valgamos más que el talento — $30-50k MRR —, y (b) relaciones en la industria para tener la conversación si llega. No vemos al incumbente como enemigo, lo vemos como ruta."

---

## 🚀 Sobre el GO-TO-MARKET

### Q21. ¿Cómo llegan a una PyME argentina típica?

**Respuesta**:

> "Tres canales validados empíricamente para SaaS B2B PyME en LATAM. Uno: cámaras sectoriales y bootcamps — CACE, PICAPyMES, expos regionales. Mix de workshop + demo presencial. Dos: revendedores de ERPs y herramientas de contabilidad — muchas consultorías PyME tienen 50-200 clientes y buscan productos para vender. Les damos 30% recurrente y generan pipeline. Tres: contenido orgánico y LinkedIn personal de fundadores. Galo ya adquiere clientes por los canales uno y tres. Partner channel es el bet grande."

---

### Q22. ¿En qué país arrancan?

**Respuesta**:

> "Argentina. Tres razones. Uno: Galo ya opera en Argentina, tenemos distribución cero-a-uno. Dos: precio de operación en pesos hace que un ticket de $150 USD sea razonable-alto sin ser imposible. Tres: regulaciones de WhatsApp Business menos estrictas que en Brasil, fricción menor para arrancar. Mercado secundario Mexico a los 12 meses, mercado terciario Colombia a los 18."

---

### Q23. ¿Cómo escalan de 10 a 100 clientes sin romper el onboarding?

**Respuesta**:

> "Self-service con AI en el onboarding. El dueño arrastra archivos, el Cerebro ingiere sola, Claude pregunta sobre ambigüedades. Único touchpoint humano obligatorio: 30 minutos de setup de WhatsApp Business con un asesor. Eso nos pone en ratio 1 onboarding specialist : 100 clientes. Si el hackathon valida que 2+ clientes hacen auto-onboarding exitoso, escalar a 100 es cuestión de hiring 1 persona de onboarding y listo."

---

## 👥 Sobre el EQUIPO

### Q24. ¿Por qué ustedes vs cualquier otro equipo?

**Respuesta**:

> "Porque no estamos imaginando el pain. Estamos en él cada día. Galo vende WhatsApp commerce a PyMEs; yo soy dev senior de IA ahí; Tomi, el CEO, tiene 15 cuentas pagando y conoce el vertical. No somos outsiders atacando un mercado que miramos desde afuera — lo operamos. La ventaja de velocidad es enorme: ciclos de feedback diarios con clientes reales, no necesitamos contratar a nadie para entender el cliente."

---

### Q25. ¿Conflicto de interés con Galo?

**Respuesta**:

> "Honesto: hoy no está resuelto. Puede ser una feature interna de Galo, o un spin-off con Galo como co-founder / design partner. Esa conversación formal con Tomi la tengo pendiente — probablemente la semana que viene. Lo importante para el jurado: hay alineamiento completo. Galo gana si esto funciona, como producto interno o como inversor. No hay conflicto oculto."

---

### Q26. ¿Quién va a vender y hacer customer success?

**Respuesta**:

> "Hoy no está cubierto, somos equipo técnico. El primer hire post-validación, sea con capital o con bootstrap, es un Head of Sales con red en PyMEs LATAM. Target: alguien de Holded, Tiendanube o similar con 5+ años. Budget: $3-5k USD/mes + equity. El segundo hire, a los 6 meses, es un onboarding specialist. Si no conseguimos los 2 hires, el producto no escala — lo sabemos."

---

### Q27. ¿Cuánta plata están poniendo? ¿Tienen runway?

**Respuesta**:

> "Bootstrapped via Galo hasta ahora — tiempo de mis horas como dev. Para escalar más allá de 50 clientes, pre-seed estimado $300-500k USD para 12 meses, metas: $30k MRR, 300 clientes, 3 hires clave. No tenemos ronda cerrada hoy. Si el hackathon valida técnica y UX, el siguiente paso es hablar con 3-5 angels con background en B2B SaaS LATAM."

---

## 📜 Sobre lo REGULATORIO

### Q28. ¿GDPR / Ley de Protección de Datos?

**Respuesta**:

> "La PyME cliente es responsable del consentimiento de sus clientes finales. Nosotros somos processor, no controller — procesamos data en nombre de la PyME bajo un DPA (Data Processing Agreement) estándar. Plantilla de consentimiento en el onboarding es obligatoria. Opt-out en cualquier momento. En Argentina: Ley 25.326 se cumple porque la data no sale del territorio y se borra on-demand. GDPR aplica si servimos a EU — inicialmente no, por diseño de mercado."

---

### Q29. ¿Qué pasa si un cliente pide borrar sus datos?

**Respuesta**:

> "Right to be forgotten implementado. Cascade delete del nodo Customer + todas sus aristas + el source raw asociado. Tiempo de ejecución: < 24hs desde la solicitud. La PyME recibe confirmación. Excepción: data agregada ya usada para training/analytics queda en forma anónima, sin re-identificable. Todo documentado en el DPA."

---

### Q30. ¿Cumplen con política de Meta para WhatsApp Business?

**Respuesta**:

> "Compliance by design. Usamos BSPs oficiales — Messagebird, Twilio — que están en la whitelist. Templates de campaña pasan por approval de Meta antes de disparar (es obligatorio para HSM). Nada se manda fuera de la ventana de 24hs sin template aprobado. No usamos WhatsApp Personal API, que es donde la gente se fuma los bans. Cada cliente tiene su propio número con verificación BSP."

---

## 🎬 Sobre el DEMO / HACKATHON

### Q31. ¿Esto es real o mockeado?

**Respuesta**:

> "Honestidad: mezcla. El upload drag-and-drop es real. La ingesta al grafo con Graphiti y Claude es real. El chat del vendedor responde con Claude real, no hardcodeado. Los datos del grafo son un dataset ficticio de 'Ferretería San Martín' que pre-generamos. El envío de mensajes a WhatsApp — está wired pero desconectado en la demo para no disparar mensajes reales durante el pitch. Tenemos un video de respaldo del mismo flow corriendo con WhatsApp real, si quieren verlo."

---

### Q32. ¿Con cuántas empresas reales validaron esto?

**Respuesta**:

> "Con el Cerebro específicamente, cero — nació hoy. Con el pain subyacente, 15 empresas que hoy pagan a Galo y sufren el problema. No confundo las dos cosas. La validación real del producto empieza la semana que viene."

---

### Q33. ¿En cuánto lo construyeron?

**Respuesta**:

> "5 horas del hackathon. Que es posible porque 70% es reuso: Graphiti de Zep AI como engine del grafo temporal, llmwiki de Lucas Astorian como scaffolding del frontend. Ambos Apache 2.0. Lo nuevo es la capa de visualización del grafo, el chat del vendedor, las cards de campaña y el conversor multimodal. Transparencia total: los links están en nuestra documentación."

---

### Q34. ¿Nombrás a Karpathy y kepano — marketing o dependencia real?

**Respuesta**:

> "Dependencia real conceptual, no código. Karpathy publicó un gist que inspiró el paradigma LLM Knowledge Bases — es el approach técnico del Cerebro. Kepano publicó obsidian-skills para operar vaults Obsidian con agentes, de ahí salieron las convenciones de markdown + wikilinks que usamos para exports. No vendimos decoración, mostramos genealogía técnica. Querés verificarlo: los repos están citados."

---

## 💣 Sobre FRACASOS (pre-mortem)

### Q35. Imaginá que pasaron 6 meses y falló. ¿Por qué?

**Respuesta**:

> "Top 3 en orden. Uno: no logramos product-market-fit con PyMEs porque el onboarding self-service es más difícil de lo que prometemos — el Excel desordenado de verdad es peor que el ficticio. Dos: Meta restringe mensajes salientes y nuestro motor de campañas pierde el 80% del valor. Tres: un grande lanza algo parecido y nos quita 18 meses de runway. El riesgo número uno es el que más me preocupa — por eso el primer bet post-hackathon es correr el onboarding con 3 empresas reales."

---

### Q36. ¿Qué dato los haría cerrar el proyecto?

**Respuesta**:

> "Dos kill criterion duros. Uno: después de 3 meses con 5 design partners reales, si ninguno logra revenue incremental atribuible al Cerebro mayor a 2x su costo, matamos. Dos: si el costo de infra por cliente supera el 50% del ARPU durante 2 meses consecutivos, matamos porque no hay unit economics. Cualquiera de esos y se apaga. Los tengo escritos porque sé la tentación de seguir porque 'ya invertí mucho'."

---

### Q37. ¿Qué asunción central podría estar equivocada?

**Respuesta**:

> "Que las PyMEs quieren ver el grafo visualmente. Quizás les basta con 'a quién contacto hoy' en el chat, y la vista del grafo es decoración que nadie usa. Si eso pasa, simplificamos: el Cerebro vive solo en backend, la interfaz del dueño es un feed de cards, cero grafo visible. Perdemos el 'wow' del pitch pero el valor core permanece."

---

## 🕵️ Preguntas TRAMPA

### Q38. ¿Usaste AI para escribir este pitch?

**Respuesta**:

> "Sí, iteré con Claude el wording. El contenido, las ideas, la priorización, el análisis competitivo, son míos. Claude me ayudó a ajustar tono y concisión. Es la herramienta estándar del equipo y creo que es obvio que la usamos — si no la usáramos para construir un producto de AI, algo raro estaría pasando."

---

### Q39. ¿En qué te diferenciás de Graphiti + un frontend open source?

**Respuesta**:

> "Graphiti es una librería Python de infra, no un producto vendible. Para llegar a una PyME necesitás: verticalización B2B WhatsApp commerce, templates de campañas por industria, integración con Meta Business aprobada, conector multimodal específico (fotos de facturas, audios), onboarding sin setup técnico, y soporte en español LATAM. Eso no viene en el open source. Nosotros hacemos la diferencia entre 'infra técnica cool' y 'producto que un dueño de ferretería usa hoy'."

---

### Q40. ¿Salesforce Einstein ya tiene esto?

**Respuesta**:

> "Einstein Campaigns corre sobre data estructurada de Salesforce CRM, que cuesta $75-300/user/mes, requiere implementación de semanas y una base de clientes técnicos. Nuestro target no toca Salesforce ni por error — son PyMEs informales de $50k/mes de facturación. Einstein no sirve para quien vive en WhatsApp. Es como comparar SAP con Tiendanube — mercados completamente distintos."

---

## ⚠️ Preguntas que probablemente NO sabés responder

Si te tiran alguna de estas, la respuesta canónica es: **"No lo tengo hoy. Mi mejor estimación es X. El dato real lo busco y lo reporto en 48hs si te interesa que te lo mande."**

Nunca chamuyees con número inventado.

| Pregunta | Tu mejor estimación para decir |
|----------|--------------------------------|
| Tamaño exacto del mercado B2B informal LATAM | "Hipótesis $100B+, basado en datos CEPAL del sector informal LATAM, 25% atribuible a ventas B2B" |
| % PyMEs LATAM con WhatsApp como canal principal | "Por Kantar 2024, ~70-80% de PyMEs LATAM usan WhatsApp, subconjunto exacto no tengo" |
| NPS de Callbell / Treble | "No tengo — puedo pullearlos de public reviews" |
| Retention SaaS PyME LATAM | "Benchmark industria 3-5% monthly churn" |
| Regulación Meta específica Argentina | "Política global de WhatsApp Business, no hay local exception" |
| Costo licencia BSP | "Messagebird: ~$79/mes + $0.005-0.05/conversación según tipo" |

---

## 🔥 Las 5 preguntas más letales

Ranking por probabilidad × daño:

| # | Pregunta | Por qué mata | Arma de defensa |
|---|----------|--------------|-----------------|
| 1 | ¿Cuántos usuarios reales validaron esto? (Q5, Q32) | Expone si hay evidencia o imaginación | 3 nombres concretos + Galo 15 clientes |
| 2 | ¿Qué hace mejor que Excel + persona entrenada? (Q8, Q15) | Expone over-engineering | "Escalamos lo que hace 1 PM a 100 PMs 24/7" |
| 3 | ¿Qué si Meta cambia reglas? (Q12) | Dependencia externa | Diversificación de canal planificada |
| 4 | ¿Cuánto cobrás y con qué ROI? (Q7, Q17) | Unit economics | "$150/mes, ROI 13x conservador" |
| 5 | ¿Defensa si un grande copia? (Q18, Q20) | Moat | Ventana 18-24 meses + exit como ruta válida |

---

## 🧭 Framework de respuesta en vivo

**Cuando te tiran una pregunta dura**:

1. **Pausa 1 segundo.** No arranques con "eh..."
2. **Reformulá en tu cabeza** en 1 frase clara.
3. **Elegí modo**:
   - **Directa** (si tenés dato y respuesta clara).
   - **Hipótesis** si no tenés dato: "mi hipótesis es X, valido con Y en Z tiempo".
   - **Honestidad quirúrgica** si ni tenés hipótesis: "no lo tengo. Te lo mando en 48hs".
4. **Cerrá con confianza**. Sin "no sé si esto contesta...", sin "perdón por la extensión".

---

## 🚫 Las 3 frases prohibidas

1. **"Buena pregunta."** — cliché, pierde tiempo, no agrega.
2. **"Va a depender."** — evasiva, suena a chamuyo.
3. **"Es obvio que..."** — subestima al jurado, te baja puntos instantáneo.

## ✅ Las 3 frases salvavidas

1. **"Lo vamos a validar con X durante las próximas N semanas."** — muestra plan + humildad.
2. **"Mi mejor estimación es X, el dato real es Y, te lo confirmo en 48hs."** — honestidad + proactividad.
3. **"Ese es exactamente el riesgo #1 que identificamos. Lo mitigamos así..."** — pre-mortem vivo.

---

## 🎯 Reglas finales

- **No te disculpes nunca** por el estado del producto. Es hackathon, se espera.
- **No respondas preguntas que no te hicieron**. Si el jurado pregunta A, no expliques A, B, C y D.
- **No hables más de 45 segundos por respuesta**. Si no cerraste, cortá y preguntá "¿respondí lo que querías saber?".
- **Si no sabés, no sabés**. Es más fuerte que inventar.
- **El jurado es aliado, no enemigo**. Vienen a ayudarte a pensar mejor. Recibí la pregunta con apertura, no defensiva.

---

## Referencias cruzadas

- Pitch 3min: [12-pitch-presentacion-3min.md](12-pitch-presentacion-3min.md)
- Idea canónica: [01-idea.md](01-idea.md)
- Modelo de negocio: [08-modelo-negocio.md](08-modelo-negocio.md)
- Features prioritarias: [16-features-prioritarias-5h.md](16-features-prioritarias-5h.md)
- Datos ingestables: [19-datos-ingesta-empresa.md](19-datos-ingesta-empresa.md)
