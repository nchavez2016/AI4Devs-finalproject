# Design

## Context

Hoy la única guardia es `.claude/hooks/protect-files.mjs` (PreToolUse de Claude Code) más las reglas `allow`/`ask`/`deny` de `.claude/settings.json`. Antigravity usa un contrato distinto (`antigravity.google/docs/hooks`): stdin `{ toolCall: { name, args } }` con `args` específico por herramienta (`run_command.CommandLine`, `write_to_file`/`replace_file_content`/`multi_replace_file_content`.`TargetFile`, `view_file.AbsolutePath`); stdout obligatorio `{ decision: allow|deny|ask|force_ask, reason? }`, sin código de salida; configurado en `.agents/hooks.json` con matcher por regex y timeout de 30 s. Ver proposal.md para el resto de motivación.

## Goals / Non-Goals

**Goals:**
- Una sola lógica de decisión (`guard-core.mjs`) consumida por ambos adaptadores, sin acoplarla a ningún contrato de herramienta.
- Eliminar el falso positivo de coincidencia por subcadena en cualquier posición del comando.

**Non-Goals:**
- No decide qué apunta a qué en `.claude/settings.json` ni escribe `.agents/hooks.json` (grupo `[HUMANO]`).
- No cubre herramientas de Antigravity fuera de las cuatro listadas en el contrato oficial.

## Decisions

**Segmentación de comandos.** `evaluarComando` divide el string por `;`, `&`, `|`, `` ` `` (backtick, PowerShell) y saltos de línea, recorta cada segmento y solo evalúa patrones anclados al inicio (`^git\s+<subcomando>\b`, con el mismo subcomando no precedido de otra palabra clave). Así `git commit -m "docs: sobre git push"` es un único segmento cuyo primer token es `commit`, no `push`, y pasa. Alternativa descartada: seguir buscando la subcadena en cualquier posición (el comportamiento actual) — es la causa raíz del falso positivo ya observado en esta sesión.

**Insensibilidad a mayúsculas.** Windows no distingue mayúsculas en nombres de archivo (ver `AGENTS.md`), así que todos los patrones de `guard-core.mjs` (`.env`, las carpetas protegidas `.claude/`, `.git/`, `scripts/agents/`, `.agents/hooks.json`, y el primer token `git`/`npm` de cada segmento) se evalúan sin distinguir mayúsculas de minúsculas (regex con flag `i`, o comparación tras `toLowerCase()`). Sin esto, `rm -rf .Claude/hooks` en Windows borraría la carpeta real pero pasaría el guardia.

**Rutas nuevas protegidas.** `scripts/agents/` y `.agents/hooks.json` se añaden a la lista de `evaluarRuta` (mismo patrón que `.claude/`): si se pudiera editar el propio guardia desde un comando del agente, dejaría de ser una barrera.

**Rutas absolutas de Windows.** El adaptador de Antigravity puede recibir `AbsolutePath` con barras invertidas (p. ej. `C:\proyecto\.env`). `evaluarRuta` normaliza separadores (`\` → `/`) antes de aplicar los patrones, para que una ruta absoluta de Windows coincida igual que una relativa con `/`.

**`--no-verify` y comandos git destructivos en el núcleo, no solo en permisos.** `.claude/settings.json` ya los bloquea, pero esa lista solo la lee Claude Code. Para que Antigravity tenga la misma barrera sin depender de que el humano replique manualmente la lista en `.agents/hooks.json`, `evaluarComando` los conoce directamente.

**Resolución de módulos independiente del cwd.** `antigravity-adapter.mjs` importa `guard-core.mjs` con una ruta relativa al propio archivo (p. ej. `new URL('./guard-core.mjs', import.meta.url)`), no relativa al directorio de trabajo del proceso, porque el cwd con el que Antigravity invoca el hook no está confirmado (ver punto 3 de "Puntos no confirmados").

**Decisión neutra de Antigravity = `ask`, no `allow`.** El adaptador de Antigravity es, por ahora, la única guardia de ese lado (no hay `.agents/hooks.json` con reglas finas propias, a diferencia de Claude Code que ya combina permisos allow/ask/deny con el hook). Devolver `allow` por defecto dejaría cualquier llamada no cubierta por el denylist sin ningún control humano. `ask` mantiene una confirmación blanda para lo no evaluado como peligroso, sin la rigidez de `force_ask` (no silenciable) ni el riesgo de bloquear todo con `deny`. Entrada inválida o no reconocida usa `deny` (igual que el fail-safe del adaptador de Claude Code), porque una entrada que no se puede interpretar no es "no cubierta", es anómala.

**Ejecución de los tests del núcleo.** `guard-core.mjs` vive fuera de `src/`, fuera del `include` actual de `vitest.config.mts` (`src/**/*.test.{ts,tsx}`). Se amplía ese `include` con `scripts/**/*.test.mjs`. No afecta a `tsc --noEmit`: el `include` de `tsconfig.json` no matchea `**/*.mjs`, así que los adaptadores y el núcleo quedan fuera del typecheck sin configuración adicional.

## Riesgos / Trade-offs

- [Riesgo] Una heurística de segmentación por separadores no cubre subshells (`$(...)`) ni comillas anidadas con `;` dentro → Mitigación: fuera de alcance para este change; documentado como límite conocido, no como bug.
- [Riesgo] `ask` por defecto en Antigravity puede generar más confirmaciones de las que el humano espera hasta que `.agents/hooks.json` tenga sus propias reglas → Mitigación: reversible por el humano cambiando el matcher en `.agents/hooks.json`; no requiere tocar el núcleo.

## Puntos no confirmados (verificación humana, grupo `[HUMANO]`)

1. **¿El IDE dispara el hook para herramientas de solo lectura (`view_file`)?** Criterio de éxito: al pedir `view_file` sobre `scripts/agents/guard-core.mjs`, la respuesta es `deny` y Antigravity no muestra el contenido.
2. **¿Antigravity respeta `ask` como confirmación blanda (no lo trata como `deny` o `allow` silencioso)?** Criterio de éxito: una llamada no cubierta por el denylist muestra un prompt de confirmación al humano, no un bloqueo ni un paso silencioso.
3. **¿En qué directorio de trabajo ejecuta Antigravity el proceso del hook, y las rutas (`TargetFile`/`AbsolutePath`) llegan absolutas o relativas a qué raíz?** Criterio de éxito: al pedir al agente que cree `scripts/agents/prueba-hook.txt`, el hook bloquea la creación (la ruta, normalizada, coincide con el patrón `scripts/agents/` de `evaluarRuta` sin ajustes manuales por parte del adaptador). Si el archivo llegara a crearse, borrarlo.
