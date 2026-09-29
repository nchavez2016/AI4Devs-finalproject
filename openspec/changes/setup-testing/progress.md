# Progreso: setup-testing
- Siguiente: 2.1 RED `jsdom expone document y window`
- Decisiones: `@types/node` se instala en `^22` en el mismo `npm install -D` para satisfacer el peer de `vitest@5`.
- Discrepancias: 1.1 incluye actualizar `@types/node` `^20` → `^22` (no previsto en tasks.md; autorizado por el humano y registrado en proposal.md). Vite 8 avisa de que `vite-tsconfig-paths` es redundante (`resolve.tsconfigPaths: true` nativo); se mantiene según design.md, pendiente de decisión humana.
