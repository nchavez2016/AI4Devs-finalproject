# registro-ia Specification

## Purpose

Captura de forma automática y resiliente cada prompt que el usuario envía a Claude Code en un
log local, para servir de evidencia objetiva al registro de uso de IA de la entrega final.

## Requirements

### Requirement: Registrar un prompt válido

El sistema SHALL agregar al archivo `docs/ia/registro-prompts.jsonl` una línea JSON por cada
invocación del script con un payload JSON válido en stdin, conservando todos los campos
recibidos y añadiendo un campo de marca de fecha en formato ISO 8601.

#### Scenario: Guarda una línea con payload válido

- **WHEN** el script recibe por stdin un JSON válido, por ejemplo `{"prompt":"hola"}`
- **THEN** `docs/ia/registro-prompts.jsonl` contiene una nueva línea JSON que incluye los campos
  originales del payload más un campo de fecha ISO 8601, y el proceso termina con código de
  salida 0

#### Scenario: Agrega sin sobrescribir

- **GIVEN** `docs/ia/registro-prompts.jsonl` ya contiene una línea de un registro anterior
- **WHEN** el script recibe por stdin un segundo JSON válido
- **THEN** el archivo contiene ambas líneas, la anterior sin modificar y la nueva al final, y el
  proceso termina con código de salida 0

### Requirement: Nunca fallar ni bloquear

El sistema SHALL terminar siempre con código de salida 0, sin lanzar una excepción no capturada
y sin escribir una línea inválida en el log, incluso cuando stdin esté vacío o contenga JSON
inválido.

#### Scenario: Con stdin vacío no falla ni escribe

- **WHEN** el script recibe stdin vacío
- **THEN** el proceso termina con código de salida 0 y no agrega ninguna línea nueva a
  `docs/ia/registro-prompts.jsonl`

#### Scenario: Con JSON inválido no falla

- **WHEN** el script recibe por stdin texto que no es JSON válido, por ejemplo `"{rota"`
- **THEN** el proceso termina con código de salida 0 y no agrega ninguna línea nueva a
  `docs/ia/registro-prompts.jsonl`

### Requirement: No persistir variables de entorno

El sistema SHALL excluir las variables de entorno del proceso de la línea que agrega al log,
aunque el payload recibido por stdin las incluya como parte de su propio contenido original
(ese contenido del payload sí se conserva tal cual, conforme al requirement de registrar un
prompt válido; lo que no se añade es el entorno del propio proceso del script).

#### Scenario: El entorno del proceso no se añade al registro

- **WHEN** el script procesa un payload válido por stdin
- **THEN** la línea agregada a `docs/ia/registro-prompts.jsonl` no contiene ningún campo con las
  variables de entorno del proceso que ejecutó el script
