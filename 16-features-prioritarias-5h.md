# 16 — Features prioritarias (hackathon 5h)

> Hackathon corto = scope brutal. 5 horas totales. Todo lo que no sea crítico se corta sin culpa.
> **Regla de oro**: la demo visual pesa 10x más que la solidez técnica. No construimos producto, construimos percepción.

---

## Principios para 5h

1. **Pre-hackathon hace la mitad del trabajo**. Si llegás con setup, seed y Graphiti funcionando, te quedan 5h para lo visual. Si no, no llegás.
2. **Mock agresivo**. Todo lo que no es hero-del-demo, está hardcodeado o pre-generado.
3. **1 solo golden path**. El demo cuenta UNA historia, no 3. Elegimos un vertical concreto.
4. **Video de backup antes del pitch**. Grabamos la demo a la hora 4. Si algo se cae en vivo, ponemos el video.

---

## Golden path elegido

**Historia del demo**: un dueño de ferretería que vende por WhatsApp sube 1 Excel + 2 imágenes + 1 audio → el Cerebro lo compila → el vendedor pregunta "¿qué hago hoy?" → el dueño ve una sugerencia de campaña y la lanza.

Una sola persona ficticia (Luis, dueño de Ferretería San Martín) + 20 clientes + 30 productos + 5 conversaciones semilla. Suficiente para que el grafo se vea interesante sin sobrecargar.

---

## P0 — CRÍTICO (la demo muere sin esto)

### P0.1 — Graph viewer visible con data real

**Qué**: Cytoscape.js en una página con nodos reales desde Graphiti.
**Por qué**: es el momento wow. Sin esto no hay pitch.
**Budget**: 1h30.
**Mitigación si peligra**: grafo con data **hardcodeada en JSON** (no conectado a Graphiti). El jurado no se va a enterar.

### P0.2 — Upload funcional de AL MENOS 1 tipo de archivo

**Qué**: drag & drop de un Excel o TXT → que haga **algo visible** (aparezcan nodos nuevos en el grafo).
**Por qué**: sin demostrar ingesta, no hay narrativa de "come cualquier cosa".
**Budget**: 45min (usando el upload que ya trae llmwiki).
**Mitigación si peligra**: botón "Subir Excel de demo" que dispara ingesta **pre-escrita**, sin elegir archivo real.

### P0.3 — Chat vendedor con 1 respuesta real

**Qué**: caja de chat, vendedor escribe "¿qué hago hoy?", aparecen 3-5 cards con acciones priorizadas.
**Por qué**: el "agente para vendedor" es la promesa core.
**Budget**: 1h.
**Mitigación si peligra**: Claude con prompt hardcodeado y contexto del Graphiti ya extraído. Si Claude falla, **respuesta mockeada con datos reales del grafo**.

### P0.4 — Card de sugerencia de campaña (visible, aunque sea estática)

**Qué**: una card que dice "14 clientes atrasados → lanzar campaña" con botón.
**Por qué**: el tercer pilar del pitch. Sin esto, no mostramos la parte del dueño.
**Budget**: 30min.
**Mitigación si peligra**: **mockup hardcodeado**. El click puede hacer una animación tipo "enviando..." sin mandar nada real.

### P0.5 — Video backup de 3 minutos

**Qué**: grabación completa del demo funcionando, corrida por un miembro del equipo en laptop estable.
**Por qué**: si cualquier cosa falla en vivo, cambiamos a video. Cero riesgo.
**Budget**: 30min.
**Obligatorio**: grabar a la hora 4, no a la última.

---

## P1 — IMPORTANTE (suma mucho, si da tiempo)

### P1.1 — Animación del grafo "naciendo"

**Qué**: al subir el archivo, nodos aparecen con fade-in progresivo.
**Por qué**: pasa de "ok, hay un grafo" a "wow, se está construyendo".
**Budget**: 30min extra sobre P0.1.

### P1.2 — "Ver parte del cerebro" (zoom en un cliente)

**Qué**: click en un nodo → panel lateral con el sub-grafo y atributos del cliente.
**Por qué**: demuestra navegabilidad. Literal lo que Martin pidió: "ver parte del cerebro".
**Budget**: 45min.

### P1.3 — Ingesta visible de 2+ formatos (imagen/audio)

**Qué**: que ademas de texto/Excel, el upload acepte 1 foto y 1 audio (pre-convertidos o con Whisper/Claude Vision).
**Por qué**: el diferencial "multimodal" del pitch vive o muere acá.
**Budget**: 1h.
**Shortcut**: tener las transcripciones ya hechas. El "upload" simula el proceso con un delay + mostrando el texto extraído.

### P1.4 — Plan de mañana al final del día (EOD briefing)

**Qué**: segunda pregunta del vendedor: "¿qué hago mañana?".
**Por qué**: cierra el loop narrativo del día completo.
**Budget**: 20min (misma lógica que "qué hago hoy", prompt distinto).

---

## P2 — NICE TO HAVE (solo si cerramos P0 y P1)

### P2.1 — WhatsApp real (Twilio sandbox)

**Qué**: el click "Lanzar campaña" manda un WhatsApp real al celular del pitchear.
**Por qué**: prueba social inmediata si funciona.
**Budget**: 1h + riesgo.
**Recomendación**: solo si llega hora 4 con todo listo.

### P2.2 — Segunda campaña funcionando (además de atrasados)

**Qué**: stock-triggered — subir un "llegó stock" → dispara otra sugerencia distinta.
**Por qué**: demuestra que el sistema genera distintas estrategias.
**Budget**: 45min.

### P2.3 — Rol dueño vs vendedor con login

**Qué**: dos vistas distintas según usuario.
**Por qué**: alinea con el pitch de "multi-usuario".
**Budget**: 30min.
**Alternativa**: dos tabs del browser abiertas con URLs distintas simulando roles.

### P2.4 — Temporal view (cómo cambió el grafo)

**Qué**: slider temporal que muestra el grafo en el tiempo.
**Por qué**: vende la feature "bi-temporal" de Graphiti.
**Budget**: 1h+.
**Recomendación**: NO hacerlo en hackathon de 5h. Mencionar en pitch que "Graphiti lo soporta nativo" y mostrar 1 screenshot estático.

---

## CUT — NO SE HACE (en 5h)

- Multi-tenant real.
- Auth / signup real.
- Billing / pricing screen.
- Panel de administración.
- Configuración de reglas por el dueño.
- Integración con ERPs.
- Historial de conversaciones persistido más allá de la sesión.
- Otros canales (Instagram DM, email).
- Analytics dashboard.
- Opt-out flow.
- Tests.
- Refactor de llmwiki original.

---

## Pre-hackathon (MUY IMPORTANTE — hacer 2 días antes)

Si esto no está hecho antes de la hora 0, no llegás a demo:

| Tarea | Responsable | Cuándo |
|-------|-------------|--------|
| Fork llmwiki corriendo en localhost | Dev 1 | -2 días |
| Supabase project + S3 bucket configurados | Dev 1 | -2 días |
| Graphiti instalado + test episode funcionando | Dev 2 | -2 días |
| Dataset Ferretería San Martín generado (JSON) | Dev 2 | -1 día |
| Cytoscape.js instalado + render básico | Dev 3 / diseñador | -1 día |
| Slides base armadas (los 6 bloques del pitch) | Martin | -1 día |
| Claude API key con $50 de saldo | Martin | -2 días |
| Twilio sandbox configurado (si P2.1) | Dev con tiempo | -1 día |
| Pitch ensayado 1 vez completo | Martin | -1 día |

**Check list de smoke test** (corre en la hora 0 del hackathon, 5 min):

- [ ] llmwiki levanta en localhost con `npm run dev`.
- [ ] Upload de un PDF deja archivo en S3.
- [ ] Claude API responde a un hello-world.
- [ ] Graphiti agrega 1 episode sin errors.
- [ ] Graph viewer muestra 3 nodos dummy.

---

## Cronograma de las 5 horas

| Bloque | Horas | Actividades |
|--------|-------|-------------|
| **T+0:00 - T+0:30** | 0.5h | Smoke test, split de tareas, dataset cargado |
| **T+0:30 - T+2:00** | 1.5h | **P0.1 Graph viewer** + **P0.2 upload funcional** |
| **T+2:00 - T+3:00** | 1h | **P0.3 chat vendedor** + **P0.4 card campaña** |
| **T+3:00 - T+3:45** | 0.75h | P1.1 animación + P1.2 zoom / P1.3 multimodal |
| **T+3:45 - T+4:15** | 0.5h | Pulido visual, data semilla final, CSS prolijo |
| **T+4:15 - T+4:45** | 0.5h | **P0.5 Grabación video backup** (full demo) |
| **T+4:45 - T+5:00** | 0.25h | Ensayo pitch final + smoke test último |

**Hora 4: la demo ya tiene que funcionar de punta a punta, aunque sea fea.** Las features de pulido vienen DESPUÉS de que funciona.

---

## Regla de decisión en vivo

Si en algún punto el equipo se traba:

1. ¿Esto está en P0? → seguir, es crítico.
2. ¿Está en P1? → 15 min máximo intentando, si no cortar y pasar a siguiente.
3. ¿Está en P2? → cortar inmediatamente.

Cronómetro visible en la mesa. Cada 30min, alinear: "vamos bien / hay que cortar X".

---

## Qué tiene que quedar al terminar las 5 horas

Mínimo aceptable (demo completable):

- [ ] Página con grafo visible y lindo (aunque sea 20 nodos dummy).
- [ ] Upload que hace algo visible al subir un archivo.
- [ ] Chat vendedor con al menos 1 respuesta coherente de Claude.
- [ ] 1 card de sugerencia de campaña visible con botón.
- [ ] Video de 3 min completo grabado en backup.
- [ ] Slides listas.
- [ ] Pitcher con el guión fresco.

Si esos 7 items están ✅, tenés demo vendible. Todo lo demás es extra.

---

## Features que se mencionan en el pitch pero NO se demuestran

Para que el chamuyo tenga sustento:

- **Bi-temporal del grafo**: "Graphiti registra cuándo cada fact fue verdad — podemos viajar en el tiempo del negocio."
- **Multimodal si no se demuestra**: "El Cerebro procesa audios, imágenes y texto con Claude — hoy demostramos texto, el resto está wired."
- **Multi-usuario**: "En producción cada vendedor tiene su WhatsApp; hoy mostramos la vista web."
- **7 tipos de campañas**: "Tenemos catálogo de 7 campañas; hoy mostramos clientes atrasados."

El jurado sabe que es un hackathon. Esperar que TODO funcione no es la vara; la vara es **que se crea que puede funcionar**.

---

## Referencias cruzadas

- Idea canónica: [01-idea.md](01-idea.md)
- Pitch 3min: [12-pitch-presentacion-3min.md](12-pitch-presentacion-3min.md)
- Design patterns: [11-design-patterns.md](11-design-patterns.md)
- Stack de reuso: [15-reuso-repos-stack.md](15-reuso-repos-stack.md)
- Catálogo de campañas: [14-estrategias-campanas.md](14-estrategias-campanas.md)
