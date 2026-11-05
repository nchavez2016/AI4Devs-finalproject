# Proposal

## Why

La entrega final de AI4Devs exige documentar el uso de IA durante el desarrollo. Hoy ese registro
es manual y depende de que el humano copie prompts; un hook que capture cada prompt enviado a
Claude Code de forma automática y a prueba de fallos evita omisiones y deja evidencia objetiva
para la ficha de IA del proyecto.

## What Changes

- Nuevo script `scripts/ia/registrar-prompt.mjs` que un hook `UserPromptSubmit` de Claude Code
  invoca en cada prompt: lee el JSON de stdin, le añade una marca de fecha ISO y lo agrega como
  una línea JSONL a `docs/ia/registro-prompts.jsonl`.
- El script nunca falla ni bloquea el prompt: siempre termina con código de salida 0, incluso con
  stdin vacío o JSON inválido, y no persiste variables de entorno.
- `.gitignore` ignora `/docs/ia/registro-prompts.jsonl` (es un log local, no versionado).

## Capabilities

### New Capabilities
- `registro-ia`: captura automática y resiliente de cada prompt enviado a Claude Code en un log
  JSONL local, sin bloquear nunca el flujo del hook.

### Modified Capabilities
(ninguna; no cambia el comportamiento de capacidades existentes)

## Impact

- Código nuevo: `scripts/ia/registrar-prompt.mjs` y su test `scripts/ia/registrar-prompt.test.mjs`.
- Archivo de datos nuevo (no versionado): `docs/ia/registro-prompts.jsonl`.
- `.gitignore`: una línea nueva.
- Sin dependencias nuevas (usa solo `node:fs` de Node).
- Fuera de alcance: resumen automático del registro, registrar el hook en `.claude/settings.json`
  (ya lo hace el humano), editar `AGENTS.md` (ya lo hizo el humano), y soporte para Antigravity.
