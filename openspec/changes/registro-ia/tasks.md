# Tasks

## 1. Setup

- [x] 1.1 Crear `scripts/ia/registrar-prompt.mjs` con un stub mínimo (exporta una función
  `procesarEntrada(texto, rutaLog)` vacía) y verificar que `node scripts/ia/registrar-prompt.mjs`
  no lanza error de import al correr `npx vitest run scripts/ia/registrar-prompt.test.mjs
  --reporter=dot` sobre un test vacío de humo

## 2. Escenario: Guarda una línea con payload válido

- [x] 2.1 RED — en `scripts/ia/registrar-prompt.test.mjs`, test llamado exactamente
  `Guarda una línea con payload válido` que llama a `procesarEntrada('{"prompt":"hola"}',
  rutaLogTemporal)` sobre un archivo temporal inexistente y espera que el archivo resultante
  contenga una línea JSON con `prompt: "hola"` y un campo `fechaRegistro` ISO 8601; confirmar que
  falla porque `procesarEntrada` no hace nada todavía
- [x] 2.2 GREEN — en `scripts/ia/registrar-prompt.mjs`, implementar `procesarEntrada` para que
  parsee el JSON, agregue `fechaRegistro` con `new Date().toISOString()` y escriba la línea con
  `fs.appendFileSync(rutaLog, JSON.stringify(objeto) + '\n')`; verificar que el test del 2.1 pasa
- [x] 2.3 REFACTOR — revisar nombres y claridad de `procesarEntrada`; dejar constancia en el
  commit aunque no haya cambios

## 3. Escenario: Agrega sin sobrescribir

- [ ] 3.1 RED — test llamado exactamente `Agrega sin sobrescribir` que escribe una línea previa
  en el archivo temporal, llama a `procesarEntrada` con un segundo payload válido y espera que el
  archivo final tenga ambas líneas en orden; confirmar que falla si la implementación actual
  sobrescribe o no soporta el caso (si ya pasa por el uso de `appendFileSync` del 2.2, forzar el
  RED comentando temporalmente el append para observar el fallo esperado)
- [ ] 3.2 GREEN — confirmar/ajustar `procesarEntrada` para que el test de 3.1 pase sin modificar
  el comportamiento del escenario 2
- [ ] 3.3 REFACTOR — revisar que no haya duplicación entre este test y el de 2.1; dejar
  constancia en el commit aunque no haya cambios

## 4. Escenario: Con stdin vacío no falla ni escribe

- [ ] 4.1 RED — test llamado exactamente `Con stdin vacío no falla ni escribe` que llama a
  `procesarEntrada('', rutaLogTemporal)` sobre un archivo inexistente y espera que no se cree el
  archivo y que la llamada no lance excepción; confirmar que falla porque `procesarEntrada`
  intenta parsear la cadena vacía como JSON
- [ ] 4.2 GREEN — en `procesarEntrada`, si el texto recibido (tras `trim()`) está vacío, retornar
  sin intentar `JSON.parse` ni escribir; verificar que el test de 4.1 pasa y que los tests de los
  escenarios 2 y 3 siguen en verde
- [ ] 4.3 REFACTOR — revisar la claridad de la guarda de entrada vacía; dejar constancia en el
  commit aunque no haya cambios

## 5. Escenario: Con JSON inválido no falla

- [ ] 5.1 RED — test llamado exactamente `Con JSON inválido no falla` que llama a
  `procesarEntrada('"{rota', rutaLogTemporal)` sobre un archivo inexistente y espera que no se
  cree el archivo y que la llamada no lance excepción; confirmar que falla porque el error de
  `JSON.parse` no está capturado
- [ ] 5.2 GREEN — envolver el parseo y la escritura de `procesarEntrada` en un único
  `try/catch` que, ante cualquier error, no escribe nada y retorna sin relanzar; verificar que el
  test de 5.1 pasa y que los escenarios 2, 3 y 4 siguen en verde
- [ ] 5.3 REFACTOR — revisar que el `try/catch` cubra exactamente lo descrito en design.md (todo
  el procesamiento en un solo bloque); dejar constancia en el commit aunque no haya cambios

## 6. Escenario: El entorno del proceso no se añade al registro

- [ ] 6.1 RED — test llamado exactamente `El entorno del proceso no se añade al registro` que
  define una variable de entorno de prueba antes de llamar a `procesarEntrada` con un payload
  válido y luego verifica que ninguna clave ni valor de `process.env` aparece en la línea
  escrita; confirmar que falla solo si la implementación llegara a incluir el entorno (test de
  caracterización del comportamiento ya correcto, ya que `procesarEntrada` nunca lee
  `process.env`)
- [ ] 6.2 GREEN — si el test de 6.1 ya pasa con la implementación de los escenarios 2-5, dejar
  constancia explícita de que no hizo falta cambiar código de producción
- [ ] 6.3 REFACTOR — revisar que `procesarEntrada` no importe ni referencie `process.env` en
  ningún punto; dejar constancia en el commit aunque no haya cambios

## 7. CLI del hook y resolución de ruta

- [ ] 7.1 RED — test llamado exactamente `Resuelve la ruta del log relativa a la raíz del repo`
  que importa una función auxiliar exportada (por ejemplo `rutaLogPorDefecto()`) y espera que
  termine en `docs/ia/registro-prompts.jsonl` bajo la raíz del proyecto, calculada desde la
  ubicación del script y no desde `process.cwd()`; confirmar que falla porque la función no
  existe todavía
- [ ] 7.2 GREEN — implementar `rutaLogPorDefecto()` con `import.meta.url` subiendo dos niveles
  desde `scripts/ia/` hasta la raíz del repo, y añadir el bloque de entrada del script, que solo
  se ejecuta cuando el archivo se invoca directamente como proceso: un `try/catch/finally` donde
  el `try` lee stdin de forma síncrona y llama a `procesarEntrada(texto, rutaLogPorDefecto())`, el
  `catch` absorbe cualquier error (incluido un fallo al leer stdin) sin relanzarlo, y el `finally`
  ejecuta `process.exit(0)`; verificar que el test de 7.1 pasa y que la suite completa de
  `registrar-prompt.test.mjs` sigue en verde
- [ ] 7.3 REFACTOR — revisar que el bloque de entrada no interfiera con la importación del módulo
  desde los tests; dejar constancia en el commit aunque no haya cambios

## 8. .gitignore

- [ ] 8.1 Añadir `/docs/ia/registro-prompts.jsonl` a `.gitignore` y verificar con
  `git status` que el archivo generado en pruebas manuales no aparece como no rastreado

## 9. Cierre

- [ ] 9.1 Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run test:run` y
  `openspec validate registro-ia --strict`, y confirmar que los cuatro terminan sin errores
