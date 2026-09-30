# Proposal

## Why

La protección de archivos sensibles y de fusiones hoy solo vive en `.claude/hooks/protect-files.mjs` y en las reglas `allow`/`ask`/`deny` de `.claude/settings.json`, ambas exclusivas de Claude Code. Antigravity no comparte ninguna de las dos, así que el mismo cambio hecho desde esa herramienta queda sin guardia. Además, el hook actual ya produjo un falso positivo real en esta sesión: bloqueó un comando por mencionar `.claude/` en cualquier posición, no solo al referirse a esa carpeta como objetivo de la acción.

## What Changes

- Núcleo puro `scripts/agents/guard-core.mjs` (`evaluarComando`, `evaluarRuta`), sin dependencias de Claude Code ni de Antigravity.
- Corrige el falso positivo de detección por subcadena: los comandos solo se evalúan al inicio de cada segmento (separado por `;`, `&`, `|` o salto de línea), para no bloquear menciones dentro de, por ejemplo, un mensaje de commit.
- Amplía la cobertura actual (`.env` salvo `.env.example`, migraciones aplicadas, `.git`, `.claude`) con: protección de `scripts/agents/` y `.agents/hooks.json`, y bloqueo de los comandos `git push/reset/clean/checkout/switch/merge/rebase`, `npm audit fix` y el flag `--no-verify` (hoy solo bloqueados vía permisos de Claude Code, no vía hook).
- `scripts/agents/claude-adapter.mjs`: mismo contrato que el hook actual (stdin `tool_name`/`tool_input`, `exit 2` para bloquear, a prueba de fallos).
- `scripts/agents/antigravity-adapter.mjs`: contrato oficial de Antigravity (stdin `toolCall.name`/`args`, stdout `{decision, reason}`); entrada inválida → `deny`; sin nada que bloquear → `ask` (justificado en `design.md`).
- `.husky/pre-merge-commit` con lint, typecheck y tests, análogo al `pre-commit` existente.
- Sección breve "Traspaso entre herramientas" en `AGENTS.md`.

## Capabilities

### New Capabilities
Ninguna.

### Modified Capabilities
Ninguna. No hay specs en `openspec/specs/` y el cambio no altera el comportamiento observable de la aplicación: son herramientas internas del repositorio. Se declara `skip_specs: true`.

## Fuera de alcance

- No se toca `.claude/settings.json` ni se crea `.agents/hooks.json` (acciones humanas, grupo `[HUMANO]`).
- No se amplía la detección de rutas para `Write`/`Edit` más allá de lo ya cubierto hoy por `protect-files.mjs`, salvo las dos rutas nuevas listadas arriba.
- No se añade ninguna dependencia npm nueva: los adaptadores usan solo módulos nativos de Node (`node:fs`, `node:readline`).
- No se migran los adaptadores a TypeScript.
- No se modifica `protect-files.mjs` en sí (queda pendiente de que el humano apunte el hook de Claude Code al nuevo adaptador).

## Impact

- Nuevos: `scripts/agents/guard-core.mjs`, `scripts/agents/claude-adapter.mjs`, `scripts/agents/antigravity-adapter.mjs`, sus tests, `.husky/pre-merge-commit`.
- Modificados: `vitest.config.mts` (amplía `include` para cubrir los tests del núcleo), `AGENTS.md`.
- Ningún cambio en dependencias de `package.json`.
