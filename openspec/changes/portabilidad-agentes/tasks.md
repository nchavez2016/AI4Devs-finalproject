# Tasks

> El change no tiene specs (`skip_specs: true`); los escenarios y su justificación están en `design.md`.
> Al aplicar, la subagente se detiene antes del grupo 4 (`[HUMANO]`) y no ejecuta ninguna de sus subtareas.

## 1. Núcleo: `scripts/agents/guard-core.mjs`

- [x] 1.1 Crear `scripts/agents/guard-core.mjs` (vacío, exportando `evaluarComando` y `evaluarRuta`) y `scripts/agents/guard-core.test.mjs`; ampliar `include` de `vitest.config.mts` con `scripts/**/*.test.mjs`. Verificar: `npx vitest run --passWithNoTests` termina en verde y `npx tsc --noEmit` no da errores (los `.mjs` quedan fuera del `include` de `tsconfig.json`).

### evaluarComando bloquea un comando que toca un archivo .env real
- [x] 1.2 RED: test `evaluarComando bloquea un comando que toca un archivo .env real` (casos: `cat .env`, `rm .env.local`, `cat .ENV` para la insensibilidad a mayúsculas). Verificar: `npx vitest run scripts/agents/guard-core.test.mjs --reporter=dot` falla porque `evaluarComando` no existe o no bloquea.
- [x] 1.3 GREEN: implementar el patrón `.env` (excepto `.env.example`) migrado de `protect-files.mjs`, insensible a mayúsculas. Verificar: el test pasa.
- [x] 1.4 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando permite comandos con .env.example, process.env o import.meta.env
- [x] 1.5 MUTACIÓN (romper): test `evaluarComando permite comandos con .env.example, process.env o import.meta.env` con los tres casos (`it.each`), escrito sobre la implementación ya correcta de 1.3 (pasa a la primera, no hay un RED natural). Mutar temporalmente el patrón de 1.3 a una búsqueda por subcadena en cualquier posición, sin las exclusiones. Verificar: con la mutación, el test falla porque bloquea alguno de los tres casos permitidos.
- [x] 1.6 RESTAURAR: deshacer la mutación de 1.5 y dejar la implementación de 1.3 intacta, sin commitear el estado roto. Verificar: `npx vitest run scripts/agents/guard-core.test.mjs --reporter=dot` en verde y `git status` sin cambios pendientes de esta subtarea.
- [x] 1.7 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando bloquea un comando que menciona la carpeta .claude/
- [x] 1.8 RED: test `evaluarComando bloquea un comando que menciona la carpeta .claude/` (casos: `rm -rf .claude/hooks`, `rm -rf .Claude/hooks` para la insensibilidad a mayúsculas). Verificar: falla.
- [x] 1.9 GREEN: migrar el patrón de `.claude/` de `protect-files.mjs`, insensible a mayúsculas. Verificar: el test pasa.
- [x] 1.10 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando bloquea un comando que menciona la carpeta .git/
- [x] 1.11 RED: test `evaluarComando bloquea un comando que menciona la carpeta .git/` (caso: `rm -rf .git`). Verificar: falla.
- [x] 1.12 GREEN: migrar el patrón de `.git/` de `protect-files.mjs`. Verificar: el test pasa.
- [x] 1.13 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando bloquea un comando que menciona scripts/agents/ o .agents/hooks.json
- [x] 1.14 RED: test `evaluarComando bloquea un comando que menciona scripts/agents/ o .agents/hooks.json` (casos: `rm -rf scripts/agents`, `cat .agents/hooks.json`, `rm -rf Scripts/Agents/` para la insensibilidad a mayúsculas). Verificar: falla.
- [x] 1.15 GREEN: añadir ambos patrones, mismo estilo que `.claude/`, insensibles a mayúsculas. Verificar: el test pasa.
- [x] 1.16 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando bloquea los comandos git push, reset, clean, checkout, switch, merge y rebase
- [x] 1.17 RED: test `evaluarComando bloquea los comandos git push, reset, clean, checkout, switch, merge y rebase` con `it.each` para los 7 subcomandos (p. ej. `git push origin main`), más el caso `GIT PUSH origin main` para la insensibilidad a mayúsculas. Verificar: falla para todos los casos.
- [x] 1.18 GREEN: implementar la detección anclada al inicio de cada segmento (dividido por `;`, `&`, `|`, backtick y salto de línea): el primer token del segmento es `git` (insensible a mayúsculas) y el siguiente token no-flag es uno de los 7 subcomandos (insensible a mayúsculas). Verificar: todos los casos pasan.
- [x] 1.19 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando permite un mensaje de commit que menciona git push sin ejecutarlo
- [x] 1.20 MUTACIÓN (romper): test `evaluarComando permite un mensaje de commit que menciona git push sin ejecutarlo` con el caso exacto `git commit -m "docs: sobre git push"`, escrito sobre la implementación ya correcta de 1.18 (pasa a la primera). Mutar temporalmente la detección de 1.18 a coincidencia por subcadena en cualquier posición del segmento (no anclada al primer token). Verificar: con la mutación, el test falla porque bloquea el mensaje de commit.
- [x] 1.21 RESTAURAR: deshacer la mutación de 1.20 y dejar la implementación de 1.18 intacta, sin commitear el estado roto. Verificar: el archivo sigue en verde y `git status` sin cambios pendientes de esta subtarea.
- [x] 1.22 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando bloquea npm audit fix
- [x] 1.23 RED: test `evaluarComando bloquea npm audit fix` (caso: `npm audit fix --force`). Verificar: falla.
- [x] 1.24 GREEN: añadir la detección anclada (`npm` como primer token, `audit fix` como subcomando). Verificar: el test pasa.
- [x] 1.25 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando bloquea el flag --no-verify
- [x] 1.26 RED: test `evaluarComando bloquea el flag --no-verify` (casos: `git commit --no-verify -m "x"`, `git push --no-verify`). Verificar: falla.
- [x] 1.27 GREEN: bloquear cualquier segmento cuyo primer token sea `git` y contenga el flag `--no-verify`. Verificar: el test pasa.
- [x] 1.28 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarComando aplica las mismas reglas en sintaxis PowerShell
- [x] 1.29 MUTACIÓN (romper): test `evaluarComando aplica las mismas reglas en sintaxis PowerShell` reejecutando los casos de 1.17, 1.20 y 1.26 con separador `;` estilo PowerShell (p. ej. `Write-Host ok; git push`) y comillas simples, escrito sobre la implementación ya correcta de 1.18 (pasa a la primera si la segmentación ya es agnóstica de shell). Mutar temporalmente la segmentación de 1.18 para reconocer solo separadores de Bash (p. ej. quitar `;` de la lista). Verificar: con la mutación, el test falla porque no detecta `git push` tras el separador `;`.
- [x] 1.30 RESTAURAR: deshacer la mutación de 1.29 y dejar la segmentación de 1.18 intacta, sin commitear el estado roto. Verificar: el archivo sigue en verde y `git status` sin cambios pendientes de esta subtarea.
- [x] 1.31 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarRuta bloquea escribir o editar un archivo .env real y permite .env.example
- [x] 1.32 RED: test `evaluarRuta bloquea escribir o editar un archivo .env real y permite .env.example` con `it.each` para ambos casos. Verificar: falla.
- [x] 1.33 GREEN: migrar el patrón de `.env` de `protect-files.mjs`. Verificar: el test pasa.
- [x] 1.34 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarRuta bloquea escribir o editar dentro de prisma/migrations/
- [x] 1.35 RED: test `evaluarRuta bloquea escribir o editar dentro de prisma/migrations/`. Verificar: falla.
- [x] 1.36 GREEN: migrar el patrón de `protect-files.mjs`. Verificar: el test pasa.
- [x] 1.37 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarRuta bloquea escribir o editar dentro de .git/ o .claude/
- [x] 1.38 RED: test `evaluarRuta bloquea escribir o editar dentro de .git/ o .claude/` con `it.each` para ambas carpetas. Verificar: falla.
- [x] 1.39 GREEN: migrar ambos patrones de `protect-files.mjs`. Verificar: el test pasa.
- [x] 1.40 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarRuta bloquea escribir o editar scripts/agents/ o .agents/hooks.json
- [x] 1.41 RED: test `evaluarRuta bloquea escribir o editar scripts/agents/ o .agents/hooks.json` con `it.each` para ambas rutas. Verificar: falla.
- [x] 1.42 GREEN: añadir ambos patrones, mismo estilo que `.claude/`. Verificar: el test pasa.
- [x] 1.43 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### evaluarRuta bloquea rutas absolutas de Windows con barras invertidas
- [x] 1.44 RED: test `evaluarRuta bloquea rutas absolutas de Windows con barras invertidas` con `it.each` para `C:\proyecto\.env` y `C:\proyecto\.claude\settings.json`. Verificar: falla si `evaluarRuta` no normaliza `\` antes de aplicar los patrones.
- [x] 1.45 GREEN: normalizar separadores (`\` → `/`) al inicio de `evaluarRuta`, antes de aplicar cualquier patrón. Verificar: el test pasa.
- [x] 1.46 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

## 2. Adaptadores

### claude-adapter.mjs bloquea (exit 2) cuando guard-core detecta un comando o ruta protegida
- [x] 2.1 RED: en `scripts/agents/claude-adapter.test.mjs`, test `claude-adapter.mjs bloquea (exit 2) cuando guard-core detecta un comando o ruta protegida`, invocando el script como subproceso con stdin `{tool_name, tool_input}` para un caso `Bash` (comando protegido) y uno de `Edit`/`Write` (ruta protegida). Verificar: falla porque `claude-adapter.mjs` no existe.
- [x] 2.2 GREEN: crear `scripts/agents/claude-adapter.mjs` leyendo `tool_name`/`tool_input` de stdin, delegando en `guard-core` (Bash/PowerShell → `evaluarComando`; resto → `evaluarRuta` sobre `file_path`), `process.exit(2)` con el motivo en stderr cuando bloquea, `process.exit(0)` en otro caso. Verificar: el test pasa.
- [x] 2.3 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### claude-adapter.mjs es a prueba de fallos ante entrada inválida
- [x] 2.4 RED: test `claude-adapter.mjs es a prueba de fallos ante entrada inválida` con stdin que no es JSON válido. Verificar: falla si el proceso no sale con código 2.
- [x] 2.5 GREEN: envolver la lectura/parseo en `try/catch` que bloquea (`exit 2`) ante cualquier error, igual que `protect-files.mjs`. Verificar: el test pasa.
- [x] 2.6 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### antigravity-adapter.mjs traduce cada tipo de toolCall y responde deny cuando guard-core bloquea
- [x] 2.7 RED: en `scripts/agents/antigravity-adapter.test.mjs`, test `antigravity-adapter.mjs traduce cada tipo de toolCall y responde deny cuando guard-core bloquea` con `it.each` para `run_command` (`args.CommandLine`), `write_to_file`, `replace_file_content`, `multi_replace_file_content` (`args.TargetFile`) y `view_file` (`args.AbsolutePath`), cada uno con un valor protegido. Verificar: falla porque `antigravity-adapter.mjs` no existe.
- [x] 2.8 GREEN: crear `scripts/agents/antigravity-adapter.mjs` leyendo `{ toolCall: { name, args } }` de stdin, mapeando cada `name` al campo de `args` correspondiente y a `evaluarComando`/`evaluarRuta`, importando `guard-core.mjs` con ruta relativa al propio archivo (no al directorio de trabajo del proceso), escribiendo a stdout `{ decision: "deny", reason }` cuando guard-core bloquea. Verificar: el test pasa.
- [x] 2.9 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### antigravity-adapter.mjs responde ask cuando no hay nada que bloquear
- [x] 2.10 RED: test `antigravity-adapter.mjs responde ask cuando no hay nada que bloquear` con un `run_command` inofensivo (p. ej. `ls`). Verificar: falla si no devuelve `{decision: "ask"}`.
- [x] 2.11 GREEN: devolver la constante `{ decision: "ask" }` cuando ningún patrón de guard-core bloquea. Verificar: el test pasa.
- [x] 2.12 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

### antigravity-adapter.mjs responde deny ante entrada inválida o toolCall.name desconocido
- [x] 2.13 RED: test `antigravity-adapter.mjs responde deny ante entrada inválida o toolCall.name desconocido` con `it.each` para stdin no-JSON y un `toolCall.name` fuera de las cinco herramientas del contrato. Verificar: falla.
- [x] 2.14 GREEN: `try/catch` alrededor de la lectura/traducción que responde `{ decision: "deny", reason }` ante cualquier error o nombre no reconocido. Verificar: el test pasa.
- [x] 2.15 REFACTOR: sin cambios de comportamiento. Verificar: el archivo sigue en verde.

## 3. Protección de fusiones, traspaso entre herramientas y validación

- [x] 3.1 Crear `.husky/pre-merge-commit` con `npm run lint`, `npm run typecheck` y `npm run test:run`, en sintaxis POSIX (mismo estilo que `.husky/pre-commit`). Verificar: `sh .husky/pre-merge-commit` con el árbol limpio termina en código 0.
- [x] 3.2 Probar el bloqueo: archivo sonda temporal `src/test/sonda-lint.ts` con un `any` explícito → `sh .husky/pre-merge-commit` falla en lint. Borrar la sonda. Verificar: `git status` queda como antes.
- [x] 3.3 Añadir a `AGENTS.md` una sección breve "Traspaso entre herramientas": comitear antes de cambiar de herramienta, abrir sesión nueva, leer primero `progress.md` y `tasks.md` del change activo, y comprobar con `git log` en qué quedó. Verificar: la sección existe y no repite reglas ya presentes en otra parte de `AGENTS.md`.
- [x] 3.4 Validación final del grupo: `npm run lint`, `npx tsc --noEmit`, `npx vitest run --reporter=dot` y `openspec validate portabilidad-agentes --strict` sin errores.

## 4. [HUMANO] Cableado real y pruebas en ambas herramientas

> La subagente se detiene antes de este grupo y no ejecuta ninguna de sus subtareas.

- [x] 4.1 [HUMANO] Antes de cambiar el comando, probar `claude-adapter.mjs` a mano enviando por stdin `{"tool_name":"Bash","tool_input":{"command":"cat .env"}}` (código de salida esperado: `2`) y `{"tool_name":"Bash","tool_input":{"command":"cat .env.example"}}` (código de salida esperado: `0`). En PowerShell: `'{"tool_name":"Bash","tool_input":{"command":"cat .env"}}' | node scripts/agents/claude-adapter.mjs; $LASTEXITCODE`. En cmd: `echo {"tool_name":"Bash","tool_input":{"command":"cat .env"}} | node scripts\agents\claude-adapter.mjs & echo %errorlevel%`. Un hook apuntado a un archivo que no se ha ejecutado antes puede quedar roto y dejar pasar las acciones. Solo si ambos códigos de salida son los esperados, cambiar el comando del hook `PreToolUse` en `.claude/settings.json` de `node ".../.claude/hooks/protect-files.mjs"` a `node ".../scripts/agents/claude-adapter.mjs"`. Criterio de éxito: ambas comprobaciones manuales dan el código de salida esperado antes de tocar `.claude/settings.json`.
- [x] 4.2 [HUMANO] Crear `.agents/hooks.json` apuntando `run_command`, `write_to_file`, `replace_file_content`, `multi_replace_file_content` y `view_file` al comando `"node ../scripts/agents/antigravity-adapter.mjs"` (ruta relativa al directorio de `.agents/hooks.json`, por verificar en 4.4) con matcher por regex, según el contrato de `antigravity.google/docs/hooks`.
- [x] 4.3 [HUMANO] Prueba real en Claude Code: pedir a un agente que cree el archivo `scripts/agents/prueba-hook.txt` (AGENTS.md no prohíbe esa ruta, así que un bloqueo solo puede venir del hook) y confirmar que el hook bloquea la creación. Si el archivo llegara a crearse, borrarlo. Criterio de éxito: bloqueo observado y `git status` queda limpio después.
- [x] 4.4 [HUMANO] Prueba real en Antigravity: repetir 4.3 pidiendo la creación de `scripts/agents/prueba-hook.txt` vía `write_to_file`, y además pedir con `view_file` la lectura de `scripts/agents/guard-core.mjs` (nunca un `.env` real: si el hook no se dispara, el secreto quedaría expuesto en la conversación). Si `scripts/agents/prueba-hook.txt` llegara a crearse, borrarlo. Anotar en `progress.md` la respuesta observada para los tres puntos no confirmados de `design.md` (¿se dispara para `view_file`?, ¿`ask` se muestra como confirmación blanda?, ¿en qué directorio resuelve las rutas — coincide `scripts/agents/prueba-hook.txt` normalizado, sin ajustes manuales del adaptador?). Criterio de éxito: los tres puntos quedan contestados con evidencia, no con suposición.
- [x] 4.5 [HUMANO] Si 4.3 o 4.4 revelan un comportamiento distinto al documentado en `design.md`, decidir si se actualiza el núcleo o los adaptadores antes de considerar el change listo para archivar.
