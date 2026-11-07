# Tasks: despliegue-y-ci

## 0. Decisiones y pasos humanos previos [HUMANO]

- [x] 0.1 [HUMANO] Decidir cómo se aplican las migraciones en producción: a mano con la URL directa de Neon o en el build de Vercel (design.md, decisión a; recomendado: a mano). Verificación: decisión anotada en design.md.
- [x] 0.2 [HUMANO] Confirmar contenido y tamaño del seed: 2 cuentas y 5 movimientos con los montos de la spec, o ampliarlo (decisión b; recomendado: mínimo). Si cambia, ajustar la spec con `/opsx:update`. Verificación: decisión en design.md y `openspec validate despliegue-y-ci --strict` sin errores.
- [x] 0.3 [HUMANO] Decidir si el E2E de CI compila dentro del `webServer` de Playwright o reutiliza un build previo (decisión c; recomendado: dentro del `webServer`). Verificación: decisión anotada en design.md.
- [x] 0.4 [HUMANO] Decidir cómo se evita sembrar una base no prevista (decisión d; recomendado: `SEED_CONFIRMAR_BASE` igual al nombre de la base). Verificación: decisión anotada en design.md.
- [x] 0.5 [HUMANO] Aprobar o rechazar `tsx` como devDependency para ejecutar `scripts/db-seed.ts` (decisión e; no está en la lista aprobada de AGENTS.md). Verificación: decisión anotada en design.md; si se rechaza, ajustar las tareas 6.x antes de aplicarlas.

## 1. Escenario: El build genera el cliente Prisma antes de compilar

- [x] 1.1 RED: test "El build genera el cliente Prisma antes de compilar" en `src/config/despliegue.test.ts` (lee `package.json`); falla porque `build` es solo `next build`. Verificación: `npx vitest run src/config/despliegue.test.ts --reporter=dot` falla por esa razón.
- [x] 1.2 GREEN: `"build": "prisma generate && next build"` en `package.json`, sin `postinstall`. Verificación: el test de 1.1 pasa y `npm run build` termina sin errores.
- [x] 1.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 2. Escenario: El proyecto declara Node 24

- [x] 2.1 RED: test "El proyecto declara Node 24" en `src/config/despliegue.test.ts`; falla porque no existe `engines`. Verificación: el archivo de test falla por esa razón.
- [x] 2.2 GREEN: `"engines": { "node": "24.x" }` en `package.json`. Verificación: el test pasa.
- [x] 2.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 3. Escenario: La suite E2E reintenta 2 veces en CI

- [x] 3.1 RED: test "La suite E2E reintenta 2 veces en CI" en `src/test/e2e/reintentos.test.ts`; falla porque `reintentos.ts` no existe. Verificación: `npx vitest run src/test/e2e/reintentos.test.ts --reporter=dot` falla por esa razón.
- [x] 3.2 GREEN: `src/test/e2e/reintentos.ts` con `reintentosE2E(env)` y `retries: reintentosE2E(process.env)` en `playwright.config.ts`. Verificación: el test pasa y `npx playwright test --list` arranca.
- [x] 3.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 4. Escenario: La suite E2E no reintenta fuera de CI

- [x] 4.1 RED: test "La suite E2E no reintenta fuera de CI" en `src/test/e2e/reintentos.test.ts`; si pasa sin cambios, verificar por mutación (devolver 2 siempre) y anotarlo en progress.md. Verificación: fallo observado o mutación documentada.
- [x] 4.2 GREEN: ajustar `reintentos.ts` si hace falta. Verificación: el archivo de test en verde.
- [x] 4.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 5. Escenario: El seed se niega a correr sin confirmar la base

- [x] 5.1 RED: test "El seed se niega a correr sin confirmar la base" en `src/server/semilla/destino.test.ts`; falla porque `destino.ts` no existe. Verificación: `npx vitest run src/server/semilla/destino.test.ts --reporter=dot` falla por esa razón.
- [x] 5.2 GREEN: `src/server/semilla/destino.ts` con `comprobarDestinoSemilla(url, confirmacion)` (función pura, sin conexión). Verificación: el test pasa.
- [x] 5.3 REFACTOR: mensajes de error claros. Verificación: mismo comando en verde.

## 6. Escenario: El seed se niega a correr si la confirmación no coincide

- [x] 6.1 RED: test "El seed se niega a correr si la confirmación no coincide" en `src/server/semilla/destino.test.ts`. Verificación: falla por la razón esperada o mutación documentada.
- [x] 6.2 GREEN: comparar confirmación y nombre de la base. Verificación: el archivo de test en verde.
- [x] 6.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 7. Escenario: El seed acepta la base confirmada

- [x] 7.1 RED: test "El seed acepta la base confirmada" en `src/server/semilla/destino.test.ts`. Verificación: falla por la razón esperada o mutación documentada.
- [x] 7.2 GREEN: devolver el nombre aceptado. Verificación: el archivo de test en verde.
- [x] 7.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 8. Escenario: El seed crea al revisor con cuentas y movimientos del mes

- [x] 8.1 RED: test de integración "El seed crea al revisor con cuentas y movimientos del mes" en `src/server/semilla/sembrar.int.test.ts` (base `cuadre_test`, fecha de referencia 2026-11-07); falla porque `sembrar.ts` no existe. Verificación: `npx vitest run src/server/semilla/sembrar.int.test.ts --reporter=dot` falla por esa razón.
- [x] 8.2 GREEN: datos fijos en `src/server/semilla/datos.ts`, `src/server/repositories/semillaRepository.ts` (escrituras con Prisma en una transacción, todo filtrado por `usuarioId` del revisor) y `src/server/semilla/sembrar.ts(fechaReferencia)` que usa `hashear()`. Verificación: el test pasa.
- [x] 8.3 REFACTOR: montos como `Decimal` y nombres en español. Verificación: mismo comando en verde.

## 9. Escenario: El revisor sembrado inicia sesión con la contraseña documentada

- [x] 9.1 RED: test de integración "El revisor sembrado inicia sesión con la contraseña documentada" en `sembrar.int.test.ts`. Verificación: falla por la razón esperada o mutación documentada (p. ej. guardar la contraseña sin hash).
- [x] 9.2 GREEN: ajustar el seed si hace falta. Verificación: el archivo de test en verde.
- [x] 9.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 10. Escenario: Ejecutar el seed dos veces no duplica datos

- [x] 10.1 RED: test de integración "Ejecutar el seed dos veces no duplica datos" en `sembrar.int.test.ts`. Verificación: falla por duplicados o por violación de unicidad.
- [x] 10.2 GREEN: `upsert` del revisor por email y borrado y recreación de sus datos en la misma transacción. Verificación: el archivo de test en verde.
- [x] 10.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 11. Escenario: El seed restablece los datos que el revisor cambió

- [x] 11.1 RED: test de integración "El seed restablece los datos que el revisor cambió" en `sembrar.int.test.ts`. Verificación: falla por la razón esperada o mutación documentada.
- [x] 11.2 GREEN: ajustar el borrado del revisor si hace falta. Verificación: el archivo de test en verde.
- [x] 11.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 12. Escenario: El seed no modifica los datos de otro usuario

- [x] 12.1 RED: test de integración "El seed no modifica los datos de otro usuario" en `sembrar.int.test.ts`; observar el RED por mutación (quitar el filtro por `usuarioId` en un borrado) y anotarlo en progress.md. Verificación: fallo observado con la mutación.
- [x] 12.2 GREEN: restaurar el filtro. Verificación: el archivo de test en verde.
- [x] 12.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 13. Escenario: Ningún script automático invoca el seed

- [x] 13.1 RED: test "Ningún script automático invoca el seed" en `src/config/despliegue.test.ts` (lee `package.json` y `prisma.config.ts`); falla porque no existe el script `db:seed`. Verificación: el archivo de test falla por esa razón.
- [x] 13.2 GREEN: `scripts/db-seed.ts` (lee `DATABASE_URL` y `SEED_CONFIRMAR_BASE`, llama a `comprobarDestinoSemilla` y a `sembrar(new Date())`) y el script `"db:seed"` en `package.json` según la decisión 0.5. Verificación: el test pasa y `npm run db:seed` sin confirmación falla nombrando la base local.
- [x] 13.3 REFACTOR: documentar `SEED_CONFIRMAR_BASE` en `.env.example`. Verificación: `npm run db:seed` con `SEED_CONFIRMAR_BASE=cuadre` contra la base local de Docker termina y el revisor entra en `/panel` con datos.

## 14. Escenarios: workflow de CI

- [ ] 14.1 RED: tests "El workflow de CI ejecuta los pasos obligatorios en orden", "El workflow de CI usa Node 24 y PostgreSQL 16" y "El workflow de CI publica el informe de Playwright siempre" en `src/config/ci.test.ts` (lee el YAML como texto); fallan porque `.github/workflows/ci.yml` no existe. Verificación: `npx vitest run src/config/ci.test.ts --reporter=dot` falla por esa razón.
- [ ] 14.2 GREEN: `.github/workflows/ci.yml` según design.md (push y pull_request, Node 24 con caché npm, servicio `postgres:16` con healthcheck, `DATABASE_URL` y `AUTH_SECRET` ficticio a nivel de job, pasos en orden y `actions/upload-artifact` de `playwright-report` con `if: always()`). Verificación: los tres tests pasan.
- [ ] 14.3 REFACTOR: sin cambios previstos. Verificación: mismo comando en verde.

## 15. Documentación

- [ ] 15.1 `docs/despliegue.md`: Neon (URL pooled para Vercel, directa para migrar y sembrar exportada solo en la terminal), Vercel (rama de producción `final-project-NCH`, `DATABASE_URL`, `AUTH_SECRET`, Node 24), migraciones en producción según 0.1 y comando del seed con `SEED_CONFIRMAR_BASE`. Verificación: cada comando del documento existe en `package.json` o en la CLI de Prisma.
- [ ] 15.2 `readme.md`: 0.4 (URL, pendiente hasta la tarea 16.6), 1.4 (Node 24 y `db:seed`), 1.5 (el revisor ya existe tras el seed; misma contraseña documentada), 2.4 (estado de CI y despliegue). Verificación: ninguna sección dice ya "No existe un seed".

## 16. Despliegue [HUMANO]

- [ ] 16.1 [HUMANO] Crear el proyecto en Neon (PostgreSQL 16) y copiar las URLs pooled y directa. Verificación: ambas URLs conectan con `sslmode=require`.
- [ ] 16.2 [HUMANO] Desde tu máquina, con la URL directa exportada solo en esa terminal: `npx prisma migrate deploy`. Verificación: Prisma informa todas las migraciones aplicadas.
- [ ] 16.3 [HUMANO] Sembrar Neon: `npm run db:seed` con `SEED_CONFIRMAR_BASE` igual al nombre de la base de Neon. Verificación: el comando termina sin errores.
- [ ] 16.4 [HUMANO] Crear el proyecto en Vercel, conectar el repositorio, rama de producción `final-project-NCH`, y cargar `DATABASE_URL` (pooled) y `AUTH_SECRET` en su panel. Verificación: las variables figuran en Production.
- [ ] 16.5 [HUMANO] `git push` de la rama. Verificación: el workflow de CI termina en verde en GitHub Actions y el informe de Playwright aparece como artefacto.
- [ ] 16.6 [HUMANO] Abrir la URL de Vercel, entrar con `revisor@cuadre.test` y comprobar el panel con datos; anotar la URL en `readme.md` 0.4. Verificación: el panel muestra ingresos 1200.00 y gastos 571.00 si el seed se ejecutó en el mismo mes.

## 17. Cierre

- [ ] 17.1 Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run test:e2e` y `openspec validate despliegue-y-ci --strict`. Verificación: todos sin errores.
