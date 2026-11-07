# Tasks

Leyenda: **[HUMANO]** = lo hace la persona; el agente se detiene antes.
Los `*.int.test.ts` corren contra `cuadre_test` y simulan solo `Date` (`vi.useFakeTimers({ toFake: ['Date'] })`),
con hoy = 2026-11-06 salvo que el escenario diga otra cosa. Los tests de componente son jsdom y
reciben los datos por props. "Si pasa sin cambios": detenerse y proponer cómo forzar el RED.
Sin migraciones. Pantallas: cargar antes la skill `ux-cuadre`.

## 0. Decisiones previas

- [x] 0.1 [HUMANO] Elegir el período por defecto, el selector y su forma en la URL (design 0.1; recomendado A: `?periodo=dia|semana|mes`, por defecto `mes`, semana de lunes a domingo). Verificación: design 0.1 indica la opción elegida.
- [x] 0.2 [HUMANO] Elegir cómo se calculan zona horaria y límites del período (design 0.2; recomendado A: `hoy` de Ecuador extraído a `src/server/fechas.ts` y aritmética de calendario en UTC). Verificación: design 0.2 indica la opción elegida.
- [x] 0.3 [HUMANO] Confirmar el trato de cuentas sin movimientos y transacciones fuera del período (design 0.3; recomendado: totales y top del período, saldos acumulados, dos vacíos). Verificación: design 0.3 indica la opción elegida.
- [x] 0.4 [HUMANO] Elegir dónde vive el dashboard y qué pasa con las tarjetas de acceso (design 0.4; recomendado A: en `/panel`, sin tarjetas). Verificación: design 0.4 indica la opción elegida.
- [x] 0.5 [HUMANO] Elegir el tamaño del top de categorías y si se muestra un saldo total (design 0.5; recomendado: 5, sin "Otras", sin saldo total). Verificación: design 0.5 indica la opción elegida.
- [x] 0.6 [HUMANO] Elegir cómo se dibuja el gráfico (design 0.6; recomendado A: Recharts, versión exacta). Verificación: design 0.6 indica la opción elegida.
- [x] 0.7 [HUMANO] Autorizar la modificación de tests existentes en `src/app/(privado)/panel/panel.test.tsx`: retirar "El panel enlaza a cuentas y categorías", "El panel enlaza a transacciones" y "Las tarjetas de acceso del panel tienen un solo enlace" (spec `cuentas`, REMOVED) y cambiar la frase de propósito esperada en "El panel usa el encabezado de página". Verificación: autorización registrada en progress.md.
- [x] 0.8 (no aplica: todas las decisiones son las recomendadas) Si alguna decisión de 0.1–0.6 difiere de la recomendada, actualizar proposal, specs, design y tasks con `/opsx:update` antes del grupo 1. Verificación: `openspec validate dashboard --strict` sin errores.

## 1. Caracterización

- [x] 1.1 CARACTERIZACIÓN — ejecutar `src/server/transacciones/pantalla.test.ts` ("Fecha del formulario empieza en el día de hoy") y `src/app/(privado)/panel/panel.test.tsx`: en verde con el código actual antes de extraer `hoy` y de tocar el panel.
- [x] 1.2 CARACTERIZACIÓN — `src/server/panel.test.ts`, test "Caracterización: cargarPanel sin sesión redirige al login" (simula `@/auth` sin sesión y `next/navigation`). Pasa con el código actual.
- [x] 1.3 CARACTERIZACIÓN — `src/server/cuentas/cuentas.int.test.ts` completo en verde (`listarCuentas` se reutilizará sin cambios).

## 2. Totales del período (caso de uso y repositorio)

- [x] 2.1 RED — `src/server/dashboard/dashboard.int.test.ts`, test "Ver totales del período". Debe fallar porque `calcularResumen` no existe.
- [x] 2.2 GREEN — `src/server/dashboard/periodo.ts` (`limitesPeriodo(periodo, hoy)` con `Date.UTC`, design 0.2), `transaccionRepository.sumasPorTipo(usuarioId, desde, hasta)` con `groupBy` y `where` con `usuarioId`, y `src/server/dashboard/dashboard.ts` (`calcularResumen(usuarioId, periodo, hoy)` → `{ totalIngresos, totalGastos, balance }` como `toFixed(2)`). Test en verde.
- [x] 2.3 REFACTOR — test en verde.
- [x] 2.4 RED — mismo archivo, test "El período día solo cuenta las transacciones de hoy". Si pasa sin cambios, forzar el RED.
- [x] 2.5 GREEN — `limitesPeriodo` para `dia`. Test en verde.
- [x] 2.6 REFACTOR — test en verde.
- [x] 2.7 RED — mismo archivo, test "El período semana va de lunes a domingo".
- [x] 2.8 GREEN — `limitesPeriodo` para `semana` (lunes a domingo, `getUTCDay`). Test en verde; verificar por mutación el caso domingo.
- [x] 2.9 REFACTOR — test en verde.
- [x] 2.10 RED — mismo archivo, test "Las transacciones fuera del período no cuentan en los totales". Si pasa sin cambios, forzar el RED cambiando temporalmente `lte` por `lt`.
- [x] 2.11 GREEN — extremos incluidos (`gte`/`lte`), último día del mes con `Date.UTC(anio, mes + 1, 0)`. Test en verde.
- [x] 2.12 REFACTOR — test en verde.
- [x] 2.13 RED — mismo archivo, test "Los importes del dashboard se suman sin redondeos intermedios". Si pasa sin cambios, forzar el RED.
- [x] 2.14 GREEN — sumas y resta con `Prisma.Decimal` hasta el `toFixed(2)` final; si `_sum` devuelve `number`, detenerse y consultar. Test en verde.
- [x] 2.15 REFACTOR — `dashboard.int.test.ts` completo en verde.

## 3. Saldo por cuenta

- [x] 3.1 RED — `src/server/dashboard/dashboard.int.test.ts`, test "Ver saldo por cuenta". Debe fallar porque el resumen no incluye `saldosPorCuenta`.
- [x] 3.2 GREEN — `calcularResumen` añade `saldosPorCuenta` a partir de `listarCuentas(usuarioId)` (`{ cuentaId, nombre, saldo }`). Test en verde.
- [x] 3.3 REFACTOR — test en verde, y 1.3 también.
- [x] 3.4 RED — mismo archivo, test "El saldo por cuenta incluye movimientos fuera del período". Si pasa sin cambios, forzar el RED.
- [x] 3.5 GREEN — sin cambios si ya lo cumple. Test en verde.
- [x] 3.6 REFACTOR — test en verde.
- [x] 3.7 RED — mismo archivo, test "Una cuenta sin movimientos muestra su saldo inicial". Si pasa sin cambios, forzar el RED.
- [x] 3.8 GREEN — sin cambios si ya lo cumple. Test en verde.
- [x] 3.9 REFACTOR — `dashboard.int.test.ts` completo en verde.

## 4. Principales categorías de gasto

- [ ] 4.1 RED — `src/server/dashboard/dashboard.int.test.ts`, test "Ver principales categorías de gasto". Debe fallar porque el resumen no incluye `topCategoriasGasto`.
- [ ] 4.2 GREEN — `transaccionRepository.sumasGastoPorCategoria(usuarioId, desde, hasta)` (`groupBy` por `categoriaId`, `tipo: 'GASTO'`), nombres desde `categoriaRepository.listar`, orden por total descendente en `dashboard.ts`. Test en verde.
- [ ] 4.3 REFACTOR — test en verde.
- [ ] 4.4 RED — mismo archivo, test "Las categorías de gasto solo cuentan gastos del período". Si pasa sin cambios, forzar el RED.
- [ ] 4.5 GREEN — filtro de fechas en `sumasGastoPorCategoria`. Test en verde.
- [ ] 4.6 REFACTOR — test en verde.
- [ ] 4.7 RED — mismo archivo, test "Las categorías con el mismo total se ordenan por nombre".
- [ ] 4.8 GREEN — desempate por nombre (`localeCompare` con `es`). Test en verde.
- [ ] 4.9 REFACTOR — test en verde.
- [ ] 4.10 RED — mismo archivo, test "El dashboard muestra como máximo cinco categorías de gasto".
- [ ] 4.11 GREEN — recorte a 5 tras ordenar (design 0.5). Test en verde.
- [ ] 4.12 REFACTOR — `dashboard.int.test.ts` completo en verde.

## 5. Carga de la pantalla, período en la URL y aislamiento

- [ ] 5.1 RED — `src/server/dashboard/pantalla.int.test.ts` (simula `@/auth` y `next/navigation`), test "El dashboard no incluye datos de otro usuario". Debe fallar porque `cargarDashboard` no existe.
- [ ] 5.2 GREEN — `src/server/dashboard/pantalla.ts`: `cargarDashboard(parametrosDeUrl)` con `exigirUsuarioId()`, `Promise.all` del resumen, `existeAlguna(usuarioId)` en `transaccionRepository` y `nombreNegocio` de la sesión. Test en verde.
- [ ] 5.3 REFACTOR — test en verde.
- [ ] 5.4 RED — mismo archivo, test "El período por defecto es el mes en curso".
- [ ] 5.5 GREEN — `src/server/dashboard/esquemas.ts`: `periodo` con `z.enum(['dia','semana','mes']).catch('mes')`; `cargarDashboard` devuelve `periodo`. Test en verde.
- [ ] 5.6 REFACTOR — test en verde.
- [ ] 5.7 RED — mismo archivo, test "Un período inválido en la URL se trata como mes". Si pasa sin cambios, forzar el RED quitando temporalmente el `.catch`.
- [ ] 5.8 GREEN — sin cambios si ya lo cumple. Test en verde.
- [ ] 5.9 REFACTOR — test en verde.
- [ ] 5.10 RED — mismo archivo, test "Los límites del período usan la fecha de Ecuador" (reloj en 2026-12-01T03:30:00Z).
- [ ] 5.11 GREEN — `src/server/fechas.ts` con `hoyEnEcuador()` (mismo `Intl.DateTimeFormat` de design 0.2), usado por `cargarDashboard`. Test en verde.
- [ ] 5.12 REFACTOR — `src/server/transacciones/pantalla.ts` usa `hoyEnEcuador()`; `pantalla.test.ts` de transacciones (1.1) y este archivo en verde.
- [ ] 5.13 RED — mismo archivo, test "Abrir el dashboard sin sesión redirige al login". Si pasa sin cambios, forzar el RED.
- [ ] 5.14 GREEN — sin cambios si `exigirUsuarioId` ya lo cumple. Test en verde.
- [ ] 5.15 REFACTOR — `src/server/panel.ts` se retira si queda sin uso, y con él el test 1.2 (cubierto por 5.13; registrar en progress.md). Grupo 5 completo en verde.

## 6. Dependencia del gráfico

- [ ] 6.1 Instalar Recharts con versión exacta (`npm install recharts@<versión> --save-exact`, design 0.6) y anotar la versión en design.md. Verificación: `npm run build` y `npm run typecheck` sin errores. Si pide una dependencia par no aprobada, detenerse y consultar.

## 7. Pantalla del dashboard

- [ ] 7.1 RED — `src/app/(privado)/panel/panel.test.tsx`, test "Dashboard sin datos" (props con totales "0.00", sin transacciones). Antes, aplicar la autorización 0.7: retirar los tres tests de tarjetas y actualizar la frase de "El panel usa el encabezado de página".
- [ ] 7.2 GREEN — `page.tsx` recibe `searchParams` (asíncrono en Next 16) y llama a `cargarDashboard`; `ContenidoPanel` muestra totales con `Importe` y el vacío con un único primario "Registrar movimiento" (estados.md 9.1). Test en verde y el resto de `panel.test.tsx` también.
- [ ] 7.3 REFACTOR — extraer secciones a `src/app/(privado)/panel/` (`TotalesPeriodo`, `SaldosCuentas`, `CategoriasGasto`) si `ContenidoPanel` crece. Test en verde.
- [ ] 7.4 RED — mismo archivo, test "Período sin movimientos muestra el aviso del período".
- [ ] 7.5 GREEN — segundo vacío según `hayTransacciones`. Test en verde.
- [ ] 7.6 REFACTOR — test en verde.
- [ ] 7.7 RED — mismo archivo, test "El dashboard tiene una sola acción primaria".
- [ ] 7.8 GREEN — enlace primario "Registrar movimiento" en `EncabezadoPagina` solo si hay transacciones. Test en verde.
- [ ] 7.9 REFACTOR — test en verde.
- [ ] 7.10 RED — mismo archivo, test "El balance negativo se muestra con su signo".
- [ ] 7.11 GREEN — balance con `Importe` tipo `saldo` (signo U+2212). Test en verde.
- [ ] 7.12 REFACTOR — test en verde.
- [ ] 7.13 RED — mismo archivo, test "Usuario sin cuentas ve cómo crear una".
- [ ] 7.14 GREEN — vacío de la sección de saldos con enlace terciario "Crear cuenta". Test en verde.
- [ ] 7.15 REFACTOR — test en verde.
- [ ] 7.16 RED — `src/app/(privado)/panel/SelectorPeriodo.test.tsx`, test "El selector de período marca el período activo".
- [ ] 7.17 GREEN — `SelectorPeriodo.tsx` con tres `Link` y `aria-current="page"`. Test en verde.
- [ ] 7.18 REFACTOR — test en verde.
- [ ] 7.19 RED — mismo archivo, test "Cambiar de período muestra Actualizando junto al selector" (simula `useLinkStatus` de `next/link` con `pending: true`; leer antes `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-link-status.md`).
- [ ] 7.20 GREEN — indicador "Actualizando…" en `aria-live="polite"`. Test en verde.
- [ ] 7.21 REFACTOR — test en verde.
- [ ] 7.22 RED — `src/app/(privado)/panel/CategoriasGasto.test.tsx`, test "Período sin gastos muestra el aviso de la sección".
- [ ] 7.23 GREEN — `CategoriasGasto.tsx` con el aviso y sin gráfico si la lista está vacía. Test en verde.
- [ ] 7.24 REFACTOR — test en verde.
- [ ] 7.25 RED — mismo archivo, test "El gráfico de categorías tiene una alternativa en tabla".
- [ ] 7.26 GREEN — `GraficoCategorias.tsx` (cliente, Recharts según visualizacion.md 8.9: `var(--color-chart-1)`, eje desde cero, `LabelList` con `formatearImporte`, sin `Legend` ni `Tooltip`, `isAnimationActive={false}` con movimiento reducido) dentro de `role="img"` con `aria-label`, y tabla `sr-only`. Test en verde.
- [ ] 7.27 REFACTOR — test en verde.
- [ ] 7.28 RED — mismo archivo, test "Ver como tabla muestra la tabla a cualquier persona".
- [ ] 7.29 GREEN — botón terciario "Ver como tabla" con `aria-expanded`. Test en verde.
- [ ] 7.30 REFACTOR — `panel/` completo en verde.
- [ ] 7.31 Documentación — readme: HU-003 y TK-003 a ✅ (menos E2E y PR), sección 4 "Consulta 3 — Resumen del dashboard" (`cargarDashboard`, `?periodo=`, importes como texto) en lugar del endpoint previsto; `docs/pendientes.md`: quitar "Por dónde empezar". Verificación: los textos coinciden con la spec `dashboard`.

## 8. Estados de carga y error

- [ ] 8.1 RED — `src/app/(privado)/panel/estados.test.tsx`, test "Dashboard en carga muestra un esqueleto ocupado".
- [ ] 8.2 GREEN — `src/app/(privado)/panel/loading.tsx` con esqueleto estático de totales, saldos y categorías y `aria-busy="true"`. Test en verde.
- [ ] 8.3 REFACTOR — test en verde.
- [ ] 8.4 RED — mismo archivo, test "Error al cargar el dashboard ofrece reintentar".
- [ ] 8.5 GREEN — `src/app/(privado)/panel/error.tsx` ("No pudimos cargar tu resumen.", secundario "Reintentar" que llama a `retry`), como `cuentas/error.tsx`. Test en verde.
- [ ] 8.6 REFACTOR — `panel/` completo en verde.

## 9. Revisión manual

- [ ] 9.1 [HUMANO] Revisar `/panel` a 360 px y a 1280 px con datos, sin datos, período sin gastos, saldo negativo y cada período, pasando `docs/diseno/sistema/checklist.md` (incluida la sección de visualización, movimiento reducido y teclado). Verificación: hallazgos anotados en progress.md y corregidos o aceptados.

## 10. Cierre

- [ ] 10.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test:run` y `openspec validate dashboard --strict`. Verificación: todos sin errores; cada escenario de los deltas tiene un test con su nombre exacto.
