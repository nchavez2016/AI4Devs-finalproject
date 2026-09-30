# Proposal

## Why

La regla TDD de AGENTS.md exige ver fallar un test antes de escribir código de producción, pero hoy no existe infraestructura de tests y el hook de pre-commit solo bloquea `main`. Sin esto, ningún change funcional puede aplicarse cumpliendo la definición de terminado.

## What Changes

- Instalar y configurar Vitest con entorno jsdom y Testing Library, siguiendo la guía local `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`.
- Archivo de setup que, tras cada test, ejecuta `cleanup`, `vi.useRealTimers()`, `vi.restoreAllMocks()` y `vi.unstubAllGlobals()`.
- Zona horaria fija `America/Guayaquil` para toda la suite.
- Test guardián del entorno: jsdom disponible, zona horaria correcta y limpieza efectiva entre tests.
- Scripts `test`, `test:run` y `typecheck` en `package.json`.
- `.husky/pre-commit` completo: bloqueo de `main` (se mantiene primero), coherencia `tasks.md` ↔ `progress.md`, lint, typecheck y tests.
- AGENTS.md: sustituir "Tests: pendiente de configurar" por los comandos reales.

## Dependencias

Todas las que exige la guía (variante TypeScript), como `devDependencies`:

| Paquete | ¿Aprobado en AGENTS.md? |
|---|---|
| `vitest` | Sí (Vitest) |
| `jsdom` | Sí (jsdom) |
| `@testing-library/react` | Sí (Testing Library) |
| `@testing-library/dom` | Sí (Testing Library; peer de la anterior) |
| `@vitejs/plugin-react` | No; autorizado para este change (se añade a la lista en la tarea 4.1) |
| `@types/node` `^20` → `^22` | Actualización de una dependencia existente, autorizada por el humano el 2026-09-29: `vitest@5` exige `@types/node` `^22.0.0 \|\| >=24.0.0` como peer |

`@vitejs/plugin-react` transforma JSX/TSX en los tests de componentes. El alias `@/*` de `tsconfig.json` se resuelve con la opción nativa de Vite 8 `resolve.tsconfigPaths: true`: la guía propone `vite-tsconfig-paths`, pero se descartó (decisión humana del 2026-09-29) porque Vite ya lo resuelve y el paquete depende de `tsconfck`, marcado como sin mantenimiento. No se añade `@testing-library/jest-dom` ni ninguna otra dependencia fuera de la guía.

## Capabilities

### New Capabilities
Ninguna.

### Modified Capabilities
Ninguna. No hay specs existentes en `openspec/specs/` y el change no altera comportamiento de la aplicación: se declara `skip_specs: true`.

## Fuera de alcance

- Playwright y tests E2E (llegan con el primer change que los necesite).
- Estrategia y tests de base de datos (la decide el primer change que toque datos).
- Tests de componentes existentes (`src/app/page.tsx`, `layout.tsx`): no se modifican.
- Cobertura de código y CI remoto.

## Impact

- Nuevos: `vitest.config.mts`, `src/test/setup.ts`, `src/test/entorno.test.tsx`, `src/test/fixtures/alias.ts`.
- Modificados: `package.json`, `package-lock.json`, `.husky/pre-commit`, `AGENTS.md`.
- Cada commit pasará a ejecutar lint, typecheck y la suite de tests: los commits serán más lentos pero no podrán romper la definición de terminado.
