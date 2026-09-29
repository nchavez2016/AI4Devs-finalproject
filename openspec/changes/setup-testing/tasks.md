# Tasks

> `@vitejs/plugin-react` y `vite-tsconfig-paths` autorizados por el humano el 2026-09-28 (ver proposal.md → Dependencias).
> 2026-09-29: el humano decide retirar `vite-tsconfig-paths` (Vite 8 resuelve el alias con `resolve.tsconfigPaths: true`; el paquete depende de `tsconfck`, sin mantenimiento). 1.1 y 1.2 se completaron con el plugin; su retirada es la subtarea 2.10.
> El change no tiene specs (`skip_specs`); los nombres exactos de los tests están en design.md → Decisión 4.

## 1. Dependencias y configuración base de Vitest

- [x] 1.1 Instalar como devDependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@vitejs/plugin-react` y `vite-tsconfig-paths` con un único `npm install -D`. Verificar: aparecen en `package.json` y `prisma` y `@prisma/client` siguen en `7.10.0` exacta.
- [x] 1.2 Crear `vitest.config.mts` mínimo: `plugins: [tsconfigPaths(), react()]` e `include: ['src/**/*.test.{ts,tsx}']`, todavía sin `environment`, `setupFiles` ni zona horaria (los introducen los tests del grupo 2). Verificar: `npx vitest run --passWithNoTests` termina en verde y `npx tsc --noEmit` no da errores.

## 2. Setup, test guardián y scripts

### jsdom expone document y window
- [x] 2.1 RED: en `src/test/entorno.test.tsx`, test `jsdom expone document y window` que renderiza un elemento con Testing Library y lo encuentra en `document`. Verificar: `npx vitest run src/test/entorno.test.tsx --reporter=dot` falla porque `document` no está definido (entorno node).
- [x] 2.2 GREEN: añadir `environment: 'jsdom'` a `vitest.config.mts`. Verificar: el test pasa.
- [x] 2.3 REFACTOR: revisar el archivo de test y la config sin cambiar comportamiento. Verificar: el test sigue en verde.

### la zona horaria es America/Guayaquil
- [x] 2.4 RED: test `la zona horaria es America/Guayaquil` que comprueba `Intl.DateTimeFormat().resolvedOptions().timeZone` y que `new Date('2026-01-15T12:00:00Z').getTimezoneOffset()` es `300`. Verificar: falla mostrando la zona horaria de la máquina.
- [x] 2.5 GREEN: `process.env.TZ = 'America/Guayaquil'` como primera instrucción de `vitest.config.mts`. Verificar: el test pasa.
- [x] 2.6 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### Limpieza entre tests
- [x] 2.7 RED: tests consecutivos `un test deja DOM, timers falsos, spies y globals modificados` y `el test siguiente empieza con DOM vacío, timers reales, spies restaurados y globals originales`, con un comentario que explique que dependen del orden. Verificar: el segundo falla porque el DOM del primero sigue montado (y los timers siguen falsos).
- [x] 2.8 GREEN: crear `src/test/setup.ts` con un `afterEach` que ejecuta `cleanup()`, `vi.useRealTimers()`, `vi.restoreAllMocks()` y `vi.unstubAllGlobals()`, y registrarlo en `setupFiles`. Verificar: los cuatro tests del archivo pasan.
- [x] 2.9 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### el alias @/ se resuelve
- [x] 2.10 Desinstalar `vite-tsconfig-paths` (`npm uninstall -D vite-tsconfig-paths`) y quitarlo de `vitest.config.mts`. Verificar: ya no aparece en `package.json`, `prisma` y `@prisma/client` siguen en `7.10.0` exacta y los tests del archivo siguen en verde.
- [x] 2.11 RED: crear `src/test/fixtures/alias.ts` que exporta una constante y el test `el alias @/ se resuelve` que la importa desde `@/test/fixtures/alias`. Verificar: `npx vitest run src/test/entorno.test.tsx --reporter=dot` falla porque el alias no se resuelve.
- [x] 2.12 GREEN: añadir `resolve: { tsconfigPaths: true }` a `vitest.config.mts`. Verificar: todos los tests del archivo pasan.
- [x] 2.13 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### Scripts
- [x] 2.14 Añadir a `package.json` los scripts `test` (`vitest`), `test:run` (`vitest run`) y `typecheck` (`tsc --noEmit`). Verificar: `npm run test:run` y `npm run typecheck` terminan en verde.

## 3. Hook de pre-commit

- [x] 3.1 Completar `.husky/pre-commit` manteniendo el bloqueo de `main`/`master` como primer bloque, y añadiendo en este orden: comprobación `tasks.md` ↔ `progress.md`, `npm run lint`, `npm run typecheck`, `npm run test:run`. Solo sintaxis POSIX. Verificar: `sh .husky/pre-commit` con el árbol limpio termina con código 0 y el bloqueo de rama sigue siendo lo primero (inspección).
- [ ] 3.2 Probar la comprobación de progreso: poner en stage un `openspec/changes/sonda-hook/tasks.md` temporal sin `progress.md` → `sh .husky/pre-commit` falla nombrando `sonda-hook`; añadir `progress.md` al stage → esa comprobación pasa; poner en stage un `tasks.md` bajo `openspec/changes/archive/` → no se exige `progress.md`. Quitar del stage y borrar los archivos sonda. Verificar: `git status` queda como antes.
- [ ] 3.3 Probar lint: archivo sonda temporal `src/test/sonda-lint.ts` con un `any` explícito → el hook falla en lint. Borrar la sonda. Verificar: `git status` queda como antes.
- [ ] 3.4 Probar typecheck: archivo sonda temporal `src/test/sonda-tipos.ts` que asigna un string a un `number` → el hook falla en typecheck. Borrar la sonda. Verificar: `git status` queda como antes.
- [ ] 3.5 Probar tests: archivo sonda temporal `src/test/sonda.test.ts` con un `expect(1).toBe(2)` → el hook falla en tests. Borrar la sonda. Verificar: `git status` queda como antes y `sh .husky/pre-commit` vuelve a terminar con código 0.

## 4. AGENTS.md y validación final

- [ ] 4.1 En AGENTS.md, sustituir "Tests: pendiente de configurar (Vitest + Playwright)." por los comandos reales (`npm run test`, `npm run test:run`, `npm run typecheck`, `npx vitest run <archivo> --reporter=dot`) e indicar que Playwright llega con el primer change E2E. Añadir `@vitejs/plugin-react` a la lista de dependencias aprobadas para el MVP. Verificar: cada comando documentado se ejecuta tal como está escrito y el paquete aparece en la lista de aprobadas.
- [ ] 4.2 Validación final: `npm run lint`, `npm run typecheck`, `npm run test:run` y `openspec validate setup-testing --strict` sin errores.
