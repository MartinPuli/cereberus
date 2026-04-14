# Hackathon Claude — Docs

Paquete de documentos de trabajo para la idea del hackathon. Vivos — se actualizan.

## Estado — 2026-04-14

**Idea canónica**: "El Cerebro" — ingesta multimodal + GraphRAG + agente para vendedores (WhatsApp Meta Business + chat web multi-usuario) + sugerencias de campañas al dueño. Beachhead: Galo.

## Índice

### Core (alineados con audios + aclaraciones) ✅

| # | Doc | Qué cubre | Estado |
|---|-----|-----------|--------|
| 01 | [Idea (canónica)](01-idea.md) | Problema, solución, 4 capacidades core, tesis, MVP | ✅ canónico |
| 11 | [Design Patterns](11-design-patterns.md) | Patrones técnicos y de producto | ✅ alineado |
| 12 | [Pitch 3 min](12-pitch-presentacion-3min.md) | Guión de 3 min para la presentación | ✅ alineado |
| 13 | [Ingesta multimodal](13-ingest-multimodal.md) | Imagen/audio/texto al Cerebro | ✅ nuevo |
| 14 | [Estrategias de campañas](14-estrategias-campanas.md) | 7 campañas core + backlog | ✅ nuevo |

### Complementarios (necesitan realinear — escritos antes del contexto completo) ⚠️

| # | Doc | Estado | Qué falta |
|---|-----|--------|-----------|
| 02 | [Pitch corto (2min)](02-pitch.md) | ⚠️ outdated | Alinear con narrativa del 12 o eliminar |
| 03 | [Producto](03-producto.md) | ⚠️ outdated | Reescribir: usuarios son vendedores+dueños, no clientes finales |
| 04 | [Features](04-features.md) | ⚠️ outdated | Features core son ingesta multimodal + briefing + campañas, no las 3 originales |
| 05 | [Técnico](05-tecnico.md) | ⚠️ parcial | Two-DB correcto; actualizar surfaces (WhatsApp + web chat) |
| 06 | [Second Brain](06-second-brain.md) | ✅ mayormente ok | Mínimos ajustes |
| 07 | [CRM](07-crm.md) | ✅ mayormente ok | Schema sigue válido |
| 08 | [Modelo de negocio](08-modelo-negocio.md) | ⚠️ realinear | B2B informal en vez de B2C retail, pricing por mensaje+clientes |
| 09 | [Demo](09-demo.md) | ⚠️ pendiente crear | Script de demo alineado al pitch 12 |
| 10 | [Roadmap](10-roadmap.md) | ⚠️ pendiente crear | Plan pre-hackathon / durante / post |

## Contexto

- **Autor**: Martin Pulitano
- **Fecha**: 2026-04-14
- **Base**: audios 2026-04-13 (5:07, 5:09, 5:09 PM) + 2026-04-14 (12:43, 12:44, 12:46×2, 12:47, 12:48 AM) + aclaraciones posteriores
- **Archivados en**: [el wiki personal](../../wikiAssitant/) y el cerebro mismo :)

## Tesis central

> "Siguen siendo agentes, solo que su DB/RAG hace que los resultados sean de mejor calidad."

## Decisiones pendientes

1. ~~Corte de MVP~~ → ingesta multimodal + agente vendedor (daily briefing) + 1 campaña core (stock-triggered o atrasados).
2. Dataset del demo: mock o Galo real anonimizado.
3. Lineup del equipo y quién pitchea.
4. Fecha concreta del hackathon.
5. Conversación con Tomi sobre pain real de Galo.

## Próximos pasos sugeridos

1. Charlar con Tomi antes del hackathon.
2. Armar slides base siguiendo el guión de [12](12-pitch-presentacion-3min.md).
3. Prototipo técnico: ingesta multimodal end-to-end con 1 caso real.
4. Decidir eliminar o realinear docs 02-10.
