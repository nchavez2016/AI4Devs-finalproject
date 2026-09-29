# Progreso: setup-testing
- Siguiente: 2.4 RED `la zona horaria es America/Guayaquil`
- Decisiones: `@types/node` se instala en `^22` para satisfacer el peer de `vitest@5`. Se retira `vite-tsconfig-paths` y el alias `@/` se resuelve con `resolve.tsconfigPaths: true` nativo de Vite 8 (decisión humana 2026-09-29: el plugin es redundante y depende de `tsconfck`, sin mantenimiento); lo cubre el test guardián `el alias @/ se resuelve` (2.10–2.13).
- Discrepancias: 1.1 incluye actualizar `@types/node` `^20` → `^22` (autorizado por el humano y registrado en proposal.md). 1.1 y 1.2 se completaron con `vite-tsconfig-paths`; su retirada es la 2.10.
