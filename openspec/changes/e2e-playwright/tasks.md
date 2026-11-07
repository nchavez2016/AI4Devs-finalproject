# Tasks: e2e-playwright

## 0. Decisiones y pasos humanos [HUMANO]

- [x] 0.1 [HUMANO] Decidir cómo se levanta la app en E2E (`next dev` en `webServer` o `next build` + `next start`) y cómo se migra la base (`globalSetup` con `migrate deploy` o script previo); confirmar el nombre de la base (propuesto `cuadre_e2e_test`) y el puerto (propuesto 3100). Ver design.md, D1, D2 y tabla 0.1. Verificación: decisión anotada en design.md.
- [x] 0.2 [HUMANO] Decidir navegadores (solo Chromium o más) y viewports (escritorio, móvil 360 px o ambos). Ver tabla 0.2. Verificación: decisión anotada en design.md.
- [x] 0.3 [HUMANO] Decidir si se prueban también el redirect sin sesión y el aislamiento entre usuarios (grupos 7 y 8) o solo el flujo principal; si es solo el flujo principal, retirar el requisito "Acceso y aislamiento verificados en el navegador" con `/opsx:update` y validar de nuevo. Verificación: decisión en design.md y `openspec validate e2e-playwright --strict` sin errores.
- [x] 0.4 [HUMANO] Revisar el diseño de CI propuesto (tabla 0.4); no se implementa en este change. Verificación: decisión anotada en design.md.
- [x] 0.5 [HUMANO] Tras la tarea 1.1, descargar los navegadores elegidos en 0.2 (p. ej. `npx playwright install chromium`). Verificación: `npx playwright --version` responde y el navegador figura instalado.

## 1. Instalación de Playwright

- [x] 1.1 Instalar `@playwright/test` como devDependency con versión exacta (`npm install -D --save-exact @playwright/test@<versión>`) y anotar la versión en design.md. Verificación: `package.json` la lista sin `^` ni `~` y `npx playwright --version` muestra esa versión.

## 2. Escenario: La suite E2E se niega a correr si la base no termina en _test

- [x] 2.1 CARACTERIZACIÓN: si la creación y migración de base de `src/test/bd/global-setup.ts` se extrae a una función compartida, añadir antes un test de caracterización de la guarda existente en `src/test/bd/guardia.test.ts` (o confirmar que ya existe). Verificación: `npx vitest run src/test/bd/guardia.test.ts --reporter=dot` en verde.
- [x] 2.2 RED: test "La suite E2E se niega a correr si la base no termina en _test" en `src/test/e2e/preparar-base-e2e.test.ts`; falla porque `preparar-base-e2e.ts` no existe. Verificación: `npx vitest run src/test/e2e/preparar-base-e2e.test.ts --reporter=dot` falla por esa razón.
- [x] 2.3 GREEN: `src/test/e2e/preparar-base-e2e.ts`, que comprueba el nombre con `exigirBaseDePrueba` antes de crear o migrar la base y reutiliza la lógica de `global-setup.ts`. Verificación: el test de 2.2 pasa y `npx vitest run --project integracion --reporter=dot` sigue en verde.
- [x] 2.4 REFACTOR: eliminar duplicación entre `global-setup.ts` y `preparar-base-e2e.ts`. Verificación: tests de 2.1–2.3 en verde.

## 3. Escenario: La suite E2E acepta una base que termina en _test

- [x] 3.1 RED: test "La suite E2E acepta una base que termina en _test" en `src/test/e2e/preparar-base-e2e.test.ts`; si pasa sin cambios porque la guarda ya existe, detenerse y proponer cómo observar el RED (mutación). Verificación: fallo observado o mutación documentada en progress.md.
- [x] 3.2 GREEN: ajustar `src/test/e2e/preparar-base-e2e.ts` para devolver el nombre aceptado. Verificación: `npx vitest run src/test/e2e/preparar-base-e2e.test.ts --reporter=dot` en verde.
- [x] 3.3 REFACTOR: revisar nombres y mensajes de error. Verificación: mismo comando en verde.

## 4. Escenario: Cada ejecución E2E usa un correo distinto

- [x] 4.1 RED: test "Cada ejecución E2E usa un correo distinto" en `src/test/e2e/correo-unico.test.ts`; falla porque `correo-unico.ts` no existe. Verificación: `npx vitest run src/test/e2e/correo-unico.test.ts --reporter=dot` falla por esa razón.
- [x] 4.2 GREEN: `src/test/e2e/correo-unico.ts` con marca de tiempo y parte aleatoria, dominio `@e2e.cuadre.test`. Verificación: el test de 4.1 pasa.
- [x] 4.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 5. Configuración de la suite

- [x] 5.1 Crear `playwright.config.ts` según 0.1 y 0.2: `testDir: 'e2e'`, `globalSetup` que llama a `preparar-base-e2e`, `webServer` en el puerto acordado con `reuseExistingServer: false` y `env` con `DATABASE_URL` de la base E2E y un `AUTH_SECRET` ficticio (sin leer `.env`), `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `retries: 0`. Verificación: `npx playwright test --list` arranca sin errores y la configuración contiene ambos valores.
- [x] 5.2 Añadir el script `test:e2e` (`playwright test`) a `package.json`, sin tocar `test:run` ni el hook de pre-commit; añadir `playwright-report/` y `test-results/` a `.gitignore`; documentar en `.env.example` cualquier variable nueva que exija la app en E2E. Verificación: `npm run test:e2e -- --list` funciona y `npm run test:run` no recoge archivos de `e2e/`.

## 6. Escenario: Flujo principal de registro, cuenta, gasto y panel

- [x] 6.1 RED: test "Flujo principal de registro, cuenta, gasto y panel" en `e2e/flujo-principal.spec.ts`, con selectores por rol, etiqueta o `data-testid` y sin `waitForTimeout`. Fallo esperado: algún elemento sin nombre accesible único (p. ej. el saldo de una cuenta en el panel). Si pasa a la primera, detenerse y verificar por mutación de un importe esperado. Verificación: `npm run test:e2e -- e2e/flujo-principal.spec.ts` falla por la razón anotada.
- [x] 6.2 GREEN: añadir solo los `data-testid` imprescindibles en los componentes que el RED señale, sin cambiar comportamiento. Verificación: el test pasa y `npm run test:run` sigue en verde.
- [x] 6.3 REFACTOR: extraer pasos repetidos (registrarse, crear cuenta, registrar gasto) a `e2e/soporte/pasos.ts`. Verificación: el test sigue pasando.
- [x] 6.4 Evidencias opcionales: añadir `e2e/soporte/evidencias.ts` y llamarlo al final del flujo principal, tras todas sus aserciones; solo si `E2E_EVIDENCIA=1`, guarda en `docs/evidencias/e2e/` las capturas de `/panel` a 360 px y a 1280 px de ancho (`panel-360.png` y `panel-1280.png`), una sola vez por ejecución (en el proyecto de escritorio). Un fallo al capturar se registra como aviso y no cambia el resultado del test. Sin la variable no se crea ningún archivo. Documentar el uso (`E2E_EVIDENCIA=1 npm run test:e2e`) en `.env.example` como comentario, sin valor por defecto. Verificación: sin la variable, `npm run test:e2e -- e2e/flujo-principal.spec.ts` pasa y `git status` no muestra archivos nuevos; con ella, existen ambas capturas en `docs/evidencias/e2e/` y el test pasa.

## 7. Escenario: Abrir el panel sin sesión en el navegador lleva al login (si 0.3 lo incluye)

- [ ] 7.1 RED: test "Abrir el panel sin sesión en el navegador lleva al login" en `e2e/acceso.spec.ts`; como la protección ya existe, verificar el RED por mutación del destino esperado. Verificación: fallo observado y anotado.
- [ ] 7.2 GREEN: ajustar el test o los `data-testid` necesarios. Verificación: `npm run test:e2e -- e2e/acceso.spec.ts` en verde.
- [ ] 7.3 REFACTOR: reutilizar `e2e/soporte/pasos.ts`. Verificación: en verde.

## 8. Escenario: El panel de un usuario no muestra la cuenta ni los gastos de otro (si 0.3 lo incluye)

- [ ] 8.1 RED: test "El panel de un usuario no muestra la cuenta ni los gastos de otro" en `e2e/aislamiento.spec.ts`, con dos contextos de navegador y dos correos únicos; verificar el RED por mutación si pasa a la primera. Verificación: fallo observado y anotado.
- [ ] 8.2 GREEN: mínimo cambio que el RED exija. Verificación: `npm run test:e2e -- e2e/aislamiento.spec.ts` en verde.
- [ ] 8.3 REFACTOR: reutilizar `e2e/soporte/pasos.ts`. Verificación: en verde.

## 9. Estabilidad

- [ ] 9.1 Ejecutar `npm run test:e2e -- --retries=0` tres veces seguidas sin cambios entre ejecuciones. La primera se hace con la base `cuadre_e2e_test` inexistente (la persona la borra antes), para comprobar que `migrate deploy` la crea y migra. Verificación: las tres en verde, anotado en progress.md.

## 10. Cierre

- [ ] 10.1 Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run test:e2e` y `openspec validate e2e-playwright --strict`. Verificación: todos sin errores.
