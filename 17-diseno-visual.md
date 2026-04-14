# 17 — Diseño visual

> **Regla**: simple + atractivo. Nada de fiesta gratis. Cada elemento tiene que ganarse su lugar en pantalla.
> **Inspiración directa**: Linear, Vercel, Arc Browser, Notion. Dark-first, tipografía clara, una sola acento de color.

---

## Los 5 principios

### 1. Dark mode por default

**Por qué**: en vivo, con las luces del escenario, el dark mode se ve premium y el grafo de nodos resalta mejor (nodos luminosos sobre fondo oscuro = hero visual). Toggle a light no se implementa.

### 2. Una sola familia tipográfica

**Inter** o **Geist Sans** (Vercel) para todo. Mono solo para JSON/code blocks. Cero mezcla.

### 3. Un solo color de acento

Elegimos **violeta eléctrico** (#7C5CFF) o **verde menta** (#4ADE80). El resto es neutrales. No agregamos azul, rojo, naranja por "variedad".

### 4. Whitespace > decoración

Padding generoso. Border radius moderado (8-12px). Sin sombras exageradas. Sin gradientes chillones.

### 5. Animaciones sutiles, no gimmicks

Entradas con fade + subtle scale. Transiciones suaves (200-300ms, ease-out). Nada que baile ni rebote.

---

## Paleta concreta

```
/* Background stack */
--bg-0:      #0A0A0B   /* base */
--bg-1:      #111113   /* cards */
--bg-2:      #18181B   /* hover states, inputs */
--bg-3:      #27272A   /* borders, dividers */

/* Text */
--fg-primary:   #FAFAFA
--fg-secondary: #A1A1AA
--fg-tertiary:  #52525B

/* Acento — elegir UNO */
--accent:       #7C5CFF   /* violeta (recomendado para "cerebro") */
--accent-hover: #9C7FFF
--accent-bg:    rgba(124, 92, 255, 0.12)

/* Semánticos — usar con MODERACIÓN */
--success: #4ADE80   /* solo para "lanzar campaña" OK */
--warning: #FACC15   /* solo para estado "atrasado" */
--danger:  #F87171   /* solo para errores reales */
```

**No usar más colores.** Si aparece la tentación de agregar amarillo, azul o naranja — resistirla.

---

## Tipografía

```
/* Stack */
font-family: 'Geist', 'Inter', system-ui, sans-serif;
font-family-mono: 'Geist Mono', 'JetBrains Mono', monospace;

/* Escala */
text-xs:   12px / 16px   /* metadata, labels */
text-sm:   14px / 20px   /* body secundario */
text-base: 15px / 22px   /* body principal */
text-lg:   17px / 26px   /* headings pequeños, card titles */
text-xl:   20px / 28px   /* section headings */
text-2xl:  28px / 36px   /* page titles */
text-3xl:  44px / 52px   /* hero del demo */

/* Weights */
font-normal:   400
font-medium:   500   /* default para UI */
font-semibold: 600   /* titles, buttons */
font-bold:     700   /* solo hero */

/* Tracking */
Títulos grandes: -0.02em (tight)
Body: 0
UPPERCASE labels: 0.05em
```

---

## Spacing y layout

Base de **4px** (scale Tailwind). Usar solo:

```
4, 8, 12, 16, 20, 24, 32, 48, 64, 96
```

**Layout principal**:

```
┌─────────────────────────────────────────────────────┐
│  Sidebar 240px  │   Main content (max-w: 1440px)    │
│                 │                                   │
│  - Logo         │   Page header (64px)              │
│  - Nav          │   ─────────────────               │
│    Cerebro      │                                   │
│    Chat         │   Content area                    │
│    Campañas     │   (padding: 24px)                 │
│    Sources      │                                   │
│                 │                                   │
└─────────────────────────────────────────────────────┘
```

Sidebar: `--bg-1`, borde derecho `--bg-3`, padding 16px.
Main: `--bg-0`, padding 24px, max-width 1440px centrado.

---

## Componentes clave

### Botón primario

```
bg: --accent
text: white
padding: 10px 16px
radius: 8px
weight: 600
hover: bg --accent-hover, scale 1.02, transition 200ms

/* Sin shadows grandes. Un inner glow sutil:  */
box-shadow: 0 0 0 1px rgba(124, 92, 255, 0.3) inset;
```

### Card (el patrón que más se repite)

```
bg: --bg-1
border: 1px solid --bg-3
radius: 12px
padding: 20px
hover: border-color --accent, bg --bg-2, transition 200ms
```

### Input / textarea

```
bg: --bg-2
border: 1px solid --bg-3
radius: 8px
padding: 10px 12px
text: --fg-primary
placeholder: --fg-tertiary
focus: border-color --accent, bg --bg-1
```

### Badge / chip

```
bg: --accent-bg
text: --accent
padding: 4px 10px
radius: 6px
font-size: 12px
weight: 500
```

### Progress bar (upload)

```
track: --bg-2
fill: linear-gradient(90deg, --accent 0%, #A78BFA 100%)
height: 3px
radius: full
```

---

## El hero: Graph Viewer (Cytoscape)

Esta es LA pantalla del demo. Pulir lo mínimo indispensable.

### Estilos de nodos

```javascript
{
  selector: 'node',
  style: {
    'background-color': '#7C5CFF',      // accent
    'border-color': '#111113',
    'border-width': 2,
    'color': '#FAFAFA',
    'font-family': 'Geist, Inter, sans-serif',
    'font-size': 11,
    'text-valign': 'bottom',
    'text-margin-y': 8,
    'text-background-opacity': 0.7,
    'text-background-color': '#0A0A0B',
    'text-background-padding': 4,
    'width': 24,
    'height': 24,
  }
}

/* Variantes por tipo */
Customer: color accent (violeta)
Product:  color '#4ADE80' (verde menta) — es OK usar verde acá, está justificado
Category: más pequeño, color --fg-tertiary
Order:    color accent pero borde dashed
```

### Estilos de edges

```javascript
{
  selector: 'edge',
  style: {
    'line-color': '#27272A',          // --bg-3
    'line-opacity': 0.6,
    'width': 1.5,
    'curve-style': 'bezier',
    'target-arrow-shape': 'triangle',
    'target-arrow-color': '#27272A',
    'arrow-scale': 0.7,
    'font-size': 9,
    'color': '#52525B',               // label --fg-tertiary
    'text-rotation': 'autorotate',
  }
}

/* Hover o selected */
'line-color': '#7C5CFF',
'line-opacity': 1,
'width': 2.5,
```

### Layout

```javascript
// cose-bilkent o fcose da buen spread sin esfuerzo
layout: {
  name: 'fcose',
  animate: true,
  animationDuration: 600,
  nodeRepulsion: 8000,
  idealEdgeLength: 120,
  nodeSeparation: 80,
  padding: 40,
}
```

### Animación "el cerebro nace"

Al cargar, los nodos aparecen en batch de 3-5 cada 300ms con fade + scale desde 0.3. Se ve como si el cerebro se construyera en vivo. Pocas líneas de código, altísimo impacto.

---

## Chat del vendedor

Estilo tipo **Linear comments** (no WhatsApp clásico). Simple, moderno, con cards embebidas para acciones.

```
┌──────────────────────────────────────────────┐
│  🟣 Cerebro                                   │
│  Hola Luis. Hoy tenés 5 acciones priorizadas:│
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ #1 · Juan Pérez · atrasado 42 días  │    │
│  │ "Hola Juan, ¿repongo mermelada?"    │    │
│  │ [ Enviar WhatsApp ]  [ Saltear ]    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ #2 · María López · stock nuevo      │    │
│  │ ...                                  │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  ✏️  ¿Qué hago hoy?                      ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

Detalles:
- Bubble del agente con avatar violeta a la izquierda.
- Cards internas con border `--bg-3`, hover `--accent`.
- Input al pie, full width, bg `--bg-1`.
- Enter para enviar. Sin botón "send" visible (limpieza).

---

## Campaign Card (el rol dueño)

```
┌────────────────────────────────────────────┐
│  💡 SUGERENCIA DE CAMPAÑA                 │
│  ──────────────────────                    │
│                                            │
│  Clientes atrasados                        │
│  23 clientes · ~$45k ARS potencial         │
│                                            │
│  Preview (Juan Pérez):                     │
│  "Hola Juan, hace 42 días que no nos       │
│   compraste mermelada. ¿Repongo?"          │
│                                            │
│  [Ver los 23]  [Editar]  [Descartar]       │
│                                            │
│  ──────────────────────                    │
│              [ 🚀 Lanzar campaña ]         │
└────────────────────────────────────────────┘
```

- Card grande (max-w 520px), centrada o en grid de 2-3.
- Badge "SUGERENCIA DE CAMPAÑA" arriba, uppercase + tracking amplio.
- Número de audiencia GRANDE (text-2xl, font-semibold).
- Preview en box dentro de la card con bg `--bg-2`, border none.
- CTA "Lanzar campaña" botón acento al 100% de ancho.

---

## Zona de ingesta (upload)

### Estado vacío

```
┌─────────────────────────────────────────────┐
│                                             │
│          ⬇                                  │
│                                             │
│    Arrastrá lo que tengas al Cerebro        │
│    Excel, PDF, audio, imagen, lo que sea    │
│                                             │
│    [ o seleccionar archivos ]               │
│                                             │
└─────────────────────────────────────────────┘
```

- Border dashed `--bg-3`, radius 16px, padding 64px.
- Icon grande, `--fg-secondary`.
- Texto amable, directo al punto.
- Hover: border `--accent`, bg `--accent-bg` sutil.

### Durante upload

Cada archivo en una linea con:
- Icon por tipo (📄 📊 🎵 🖼️).
- Nombre.
- Barra de progreso con el gradiente violeta.
- Al terminar: "12 entidades extraídas" en `--accent` y un check.

---

## Animaciones permitidas

| Dónde | Qué | Duración |
|-------|-----|----------|
| Page transitions | fade-in | 200ms ease-out |
| Cards al aparecer | fade-in + subtle scale (0.98 → 1) | 250ms |
| Nodos del grafo | fade-in + scale (0.3 → 1) secuencial | 300ms stagger |
| Hover de botones | scale 1.02 | 150ms |
| Hover de cards | border color + bg shift | 200ms |
| Barra de progreso | linear fill | variable |
| Mensajes del chat | slide-up + fade | 250ms |
| Campaign launch | confetti sutil (1s, 30 partículas máx) | 1s |

**Prohibidas**: rebotes, rotaciones, wiggle, shake, bouncing, pulse infinito.

---

## Screen por screen (minimal specs)

### Screen 1: Dashboard / Cerebro

- Sidebar con navegación.
- Main: grafo grande (70% alto) + panel lateral derecho con filtros + contador.
- Contador arriba: "342 clientes · 1284 productos · 8512 relaciones".
- Click en un nodo → sidebar derecha se expande mostrando detalles del nodo.

### Screen 2: Chat del vendedor

- Layout centrado, max-w 720px.
- Historia del chat scrolleable.
- Input al pie sticky.
- Logo del agente arriba, "Cerebro · Luis (Ferretería San Martín)".

### Screen 3: Campañas

- Grid de 2 columnas con campaign cards.
- Top: toggle "Pendientes / Lanzadas / Historial".
- Click en card → modal o panel con detalle + lista de los 23 clientes.

### Screen 4: Sources (ingesta)

- Top: drop zone.
- Abajo: lista de sources ya ingeridos con icon + nombre + estado + entidades extraídas.

---

## Assets / iconos

**Biblioteca**: [Lucide](https://lucide.dev) (ya viene con shadcn/ui).

Iconos concretos a usar:
- 🟣 / `Brain` → Cerebro
- `MessageSquare` → Chat vendedor
- `Megaphone` → Campañas
- `Upload` → Sources
- `User` → Customer
- `Package` → Product
- `Sparkles` → Sugerencia AI
- `Zap` → Lanzar / Ejecutar
- `Clock` → Atrasado / temporal

**Stroke width**: 1.5 en todos (consistente + moderno).

---

## Dark vs Light mode

**Decisión**: solo dark. No implementamos toggle.

Razones:
1. Ahorra horas de tiempo.
2. Se ve premium en pantalla de escenario con luces.
3. El grafo brilla sobre fondo oscuro.
4. Permite focus máximo en el acento violeta.

---

## Anti-patrones (qué no hacer)

| Anti-patrón | Por qué no |
|-------------|------------|
| Gradientes arcoíris | Cliché AI startup 2024 |
| Glassmorphism (blur exagerado) | Distrae del contenido |
| Más de 3 colores | Rompe la limpieza |
| Fonts serif en UI | Rompe el tono tech |
| Shadows pesadas (drop-shadow 20px+) | Se ve 2018 |
| Iconos emoji mezclados con Lucide | Inconsistente |
| Dark UI con text contrast bajo | Ilegible en proyector |
| Loading spinners circulares | Usar barras o skeleton |
| Toast notifications animados | Distraen del demo |
| Scrollbars default del OS | Customizarlos sutil |

---

## Tailwind config shortcut

Para el dev que levanta el proyecto, copiar al `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          0: '#0A0A0B',
          1: '#111113',
          2: '#18181B',
          3: '#27272A',
        },
        fg: {
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
          tertiary: '#52525B',
        },
        accent: {
          DEFAULT: '#7C5CFF',
          hover: '#9C7FFF',
          bg: 'rgba(124, 92, 255, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'scale-in': 'scaleIn 250ms ease-out',
      },
    },
  },
};
```

---

## Moodboard / referencias

Abrir estas tabs mientras diseñás:

1. **[linear.app](https://linear.app)** — la mejor tipografía + spacing tech
2. **[vercel.com](https://vercel.com)** — minimalismo + acento colorido
3. **[arc.net](https://arc.net)** — color sutil + animaciones elegantes
4. **[raycast.com](https://raycast.com)** — cards + cmd-k vibe
5. **[posthog.com](https://posthog.com)** — dark UI + graph views

Si en algún punto la pantalla no se parece a alguna de estas, estás yendo mal.

---

## Checklist visual previo al pitch

- [ ] Logo / nombre del producto visible siempre en top-left.
- [ ] Spacing consistente (nada apretado, nada disperso).
- [ ] Max 1 botón primario por pantalla.
- [ ] El grafo tiene layout armónico (nodos distribuidos, no aplastados).
- [ ] Nodos tienen labels legibles.
- [ ] Cards de campañas todas del mismo tamaño.
- [ ] Sin placeholder text tipo "Lorem ipsum".
- [ ] Sin console.logs visibles en prod (abrir DevTools pre-demo y cerrar).
- [ ] Sin scrollbars horizontales.
- [ ] Colores de status (atrasado, activo, nuevo) consistentes.
- [ ] Todo en español (no mezclar inglés excepto "OK", "ID").

---

## Referencias cruzadas

- Priorización de features: [16-features-prioritarias-5h.md](16-features-prioritarias-5h.md)
- Stack técnico: [15-reuso-repos-stack.md](15-reuso-repos-stack.md)
- Pitch 3min: [12-pitch-presentacion-3min.md](12-pitch-presentacion-3min.md)
