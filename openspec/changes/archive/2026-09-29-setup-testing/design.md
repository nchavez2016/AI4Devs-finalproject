# Design

## Context

No hay tests ni configuración de Vitest. `.husky/pre-commit` solo contiene el bloqueo de `main`/`master` y se ejecuta con el `sh` de Git for Windows. `tsconfig.json` define el alias `@/*` → `./src/*` e incluye todos los `**/*.ts`, `**/*.tsx` y `**/*.mts`, así que `vitest.config.mts` y los tests entran en `tsc --noEmit`. Motivación y dependencias: ver proposal.md.

## Goals / Non-Goals

**Goals:** suite determinista (misma zona horaria, sin estado filtrado entre tests) y un hook que haga cumplir la definición de terminado en cada commit.

**Non-Goals:** lint/tests solo sobre archivos en stage (necesitaría `lint-staged`, no aprobado); modo watch en el hook.

## Decisions

1. **Configuración según la guía de Next.js, sin `vite-tsconfig-paths`.** `vitest.config.mts` en la raíz con `plugins: [react()]`, `resolve: { tsconfigPaths: true }` y `environment: 'jsdom'`. Alternativa descartada: el plugin `vite-tsconfig-paths` de la guía, porque Vite 8 resuelve el alias de forma nativa y el plugin depende de `tsconfck` (sin mantenimiento). Se añaden `setupFiles: ['./src/test/setup.ts']` e `include: ['src/**/*.test.{ts,tsx}']` para que la futura carpeta de Playwright no la recoja Vitest. `globals: false`: los tests importan `describe/it/expect/vi` explícitamente. Consecuencia: Testing Library no registra su `cleanup` automático, por eso lo hace el setup.

2. **Limpieza en un único `afterEach` del setup**, en este orden: `cleanup()`, `vi.useRealTimers()`, `vi.restoreAllMocks()`, `vi.unstubAllGlobals()`. Alternativa descartada: las opciones de config `restoreMocks`/`unstubGlobals`, porque reparten la política entre dos archivos y no cubren timers ni DOM.

3. **Zona horaria con `process.env.TZ = 'America/Guayaquil'` en la primera línea de `vitest.config.mts`**, antes de que Vitest cree los workers, que heredan el entorno. Alternativas descartadas: `cross-env` en los scripts (dependencia nueva) y `test.env` (se aplica ya dentro del worker; funciona en Node, pero es menos evidente). Guayaquil no tiene horario de verano (UTC−5 fijo), así que las fechas de los tests no cambian según la época del año.

4. **Test guardián en `src/test/entorno.test.tsx`**, con tests que dependen del orden dentro del archivo (Vitest ejecuta en secuencia los tests de un mismo archivo y no mezcla el orden salvo `sequence.shuffle`, que no se activa). Un primer test "ensucia" (renderiza, activa timers falsos, crea un spy, hace `vi.stubGlobal`) y el siguiente comprueba que todo quedó restaurado. Nombres exactos:
   - `jsdom expone document y window`
   - `la zona horaria es America/Guayaquil`
   - `un test deja DOM, timers falsos, spies y globals modificados`
   - `el test siguiente empieza con DOM vacío, timers reales, spies restaurados y globals originales`
   - `el alias @/ se resuelve` (importa una constante de `src/test/fixtures/alias.ts` mediante `@/test/fixtures/alias`)

5. **Scripts:** `test` = `vitest` (watch, como indica la guía), `test:run` = `vitest run`, `typecheck` = `tsc --noEmit`.

6. **Orden del hook, de más barato a más caro:** bloqueo de rama → coherencia `tasks.md`/`progress.md` → `npm run lint` → `npm run typecheck` → `npm run test:run`. Husky 9 ejecuta el hook con `sh -e`, así que el primer fallo aborta el commit. Solo sintaxis POSIX (sin arrays ni `[[ ]]`).

7. **Comprobación `tasks.md` ↔ `progress.md`:** sobre `git diff --cached --name-only --diff-filter=ACMR`, cada ruta que coincida con `^openspec/changes/[^/]+/tasks\.md$` exige que `openspec/changes/<change>/progress.md` esté también en la lista. El patrón excluye `openspec/changes/archive/...` (un nivel más profundo), así que archivar no dispara la regla. El mensaje de error nombra el change.

8. **Prueba de cada comprobación del hook** ejecutando `sh .husky/pre-commit` directamente con un estado provocado (archivo sonda temporal o archivos en stage), sin hacer commit, y deshaciendo el estado después. El bloqueo de `main` no se vuelve a probar: exigiría cambiar de rama, que solo hace el humano; se verifica por inspección que sigue siendo lo primero del hook.

## Risks / Trade-offs

- [Commits más lentos por lint + typecheck + suite completa] → aceptable mientras la suite sea pequeña; si crece, se reevalúa en otro change.
- [Los tests del guardián dependen del orden] → queda documentado en el propio archivo; es el único modo de observar fugas entre tests.
- [`npm install` podría arrastrar cambios de versión de Prisma] → se instala solo con `npm install -D <paquetes>` (nunca `audit fix`) y se comprueba que `prisma` y `@prisma/client` siguen en 7.10.0.
