# Design

## Context

`docs/ia/` ya existe en el repo (contiene `fichas/` y `plantilla-ficha.md`), así que el script no
necesita crearlo. Ver proposal.md para la motivación completa.

## Goals / Non-Goals

**Goals:**
- Que ningún camino (fallo al leer stdin, stdin vacío, JSON inválido, error de escritura) pueda
  terminar el script con un código distinto de 0.
- Mantener el formato de línea simple: el objeto original más un campo `fechaRegistro` (ISO 8601).

**Non-Goals:**
- No se valida ni restringe la forma del JSON recibido (el hook de Claude Code ya define su
  esquema); el script lo trata como opaco y lo reescribe tal cual.
- No se implementa rotación ni límite de tamaño del log.

## Decisions

- **Dos niveles de captura de errores**: `procesarEntrada` envuelve en un único `try/catch` el
  `JSON.parse`, la construcción de la línea y la escritura, y ante cualquier error no escribe ni
  relanza. El bloque de entrada del script usa un `try/catch/finally`: el `try` lee stdin y llama
  a `procesarEntrada`, el `catch` absorbe cualquier error (incluido un fallo al leer stdin) y el
  `finally` ejecuta `process.exit(0)`, de modo que el código de salida es 0 en todos los caminos.
  Alternativa descartada: un try/catch por paso, que complica garantizar que todos terminan en
  exit 0.
- **`fs.appendFileSync` para escribir la línea**, no un read-modify-write del archivo completo.
  Evita el riesgo de sobrescribir líneas previas y es atómico a nivel de línea para este caso de
  uso (hook de un solo proceso a la vez).
- **stdin vacío se trata como "nada que registrar", no como error**: si el string leído de stdin
  está vacío (tras `trim()`), el script termina en 0 sin intentar `JSON.parse` ni escribir línea,
  igual que un JSON inválido.
- **El campo de fecha se llama `fechaRegistro`** y se agrega con `new Date().toISOString()`
  después de parsear el payload, para no pisar un campo del payload original si existiera uno con
  otro nombre.
- **No se usan variables de entorno del proceso (`process.env`) en la línea agregada**: el script
  nunca las lee para construir la línea; solo persiste el payload recibido por stdin tal cual más
  `fechaRegistro`.
- **La ruta del log se resuelve con `import.meta.url`** (subiendo desde `scripts/ia/` hasta la
  raíz del repo), no con `process.cwd()`. El hook de Claude Code puede ejecutar el script con un
  cwd distinto a la raíz del proyecto; anclar la ruta al archivo del script garantiza que siempre
  escriba en `<raíz>/docs/ia/registro-prompts.jsonl`. También permite que los tests inyecten una
  ruta de archivo distinta (parámetro opcional o variable interna) para no escribir en el log real
  del repo durante la suite.

## Risks / Trade-offs

- [Dos hooks concurrentes escriben a la vez] → `appendFileSync` en Node es una única llamada a
  `write()` en modo append; para el volumen y concurrencia esperados (un desarrollador, un hook
  por prompt) el riesgo de intercalado de líneas es despreciable y no se mitiga más.
- [El payload del hook cambia de forma en una versión futura de Claude Code] → el script no
  depende de campos concretos del payload (lo trata como opaco), así que tolera cambios de forma
  sin romperse.
