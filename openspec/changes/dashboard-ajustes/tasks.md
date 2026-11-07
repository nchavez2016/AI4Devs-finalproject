# Tasks

Leyenda: **[HUMANO]** = lo hace la persona; el agente se detiene antes.
`textoRangoPeriodo` se prueba como función pura (sin `Date` simulado). Los `*.int.test.ts` corren
contra `cuadre_test` y simulan solo `Date` (`vi.useFakeTimers({ toFake: ['Date'] })`). Los tests de
componente son jsdom y reciben los datos por props. "Si pasa sin cambios": detenerse y proponer
cómo forzar el RED. Sin migraciones ni dependencias. Pantallas: cargar antes la skill `ux-cuadre`.

## 0. Decisiones previas y tests existentes

- [x] 0.1 [HUMANO] Aprobar la opción del encabezado (design, decisión 1: cambiar `EncabezadoPagina` con `flex-wrap` y acción `whitespace-nowrap`). Verificación: aprobación registrada en progress.md.
- [x] 0.2 [HUMANO] Aprobar el formato del rango sin coma ("vie 6 nov", "lun 2 – dom 8 nov", "lun 30 nov – dom 6 dic", "1 – 30 nov") y el texto del subtítulo de saldos (design, decisiones 2 y 3). Verificación: aprobación registrada en progress.md; si cambia algo, `/opsx:update` y `openspec validate dashboard-ajustes --strict` sin errores.
- [x] 0.3 [HUMANO] Autorizar el cambio en `src/app/(privado)/panel/panel.test.tsx`: añadir `rangoPeriodo: '1 – 30 nov'` al fixture `datos()` (nuevo campo obligatorio de `DatosDashboard`), sin cambiar ninguna aserción. Verificación: autorización registrada en progress.md.

## 1. Caracterización

- [x] 1.1 CARACTERIZACIÓN — ejecutar `src/components/EncabezadoPagina.test.tsx`, `src/app/(privado)/panel/panel.test.tsx` y `src/server/dashboard/pantalla.int.test.ts`: en verde con el código actual antes de tocarlos.

## 2. Rango del período (función pura)

- [x] 2.1 RED — `src/server/dashboard/periodo.test.ts`, test "El rango del período día muestra la fecha de hoy" (`textoRangoPeriodo('dia', limitesPeriodo('dia', '2026-11-06'))` → "vie 6 nov"). Debe fallar porque `textoRangoPeriodo` no existe.
- [x] 2.2 GREEN — `src/server/dashboard/periodo.ts`: `textoRangoPeriodo` con `Intl.DateTimeFormat('es-EC', { timeZone: 'UTC' })` y `formatToParts` (design, decisión 2). Test en verde.
- [x] 2.3 REFACTOR — test en verde.
- [x] 2.4 RED — mismo archivo, test "El rango del período semana muestra de lunes a domingo" (hoy 2026-11-06 → "lun 2 – dom 8 nov"). Debe fallar porque solo se formatea un día.
- [x] 2.5 GREEN — rango con un solo mes al final. Test en verde.
- [x] 2.6 REFACTOR — tests del archivo en verde.
- [x] 2.7 RED — mismo archivo, test "El rango de una semana que cruza de mes nombra ambos meses" (hoy 2026-12-01 → "lun 30 nov – dom 6 dic"). Debe fallar porque el mes se escribe una sola vez.
- [x] 2.8 GREEN — mes en cada extremo cuando difieren. Test en verde.
- [x] 2.9 REFACTOR — tests del archivo en verde.
- [x] 2.10 RED — mismo archivo, test "El rango del período mes va del primer al último día" (hoy 2026-11-06 → "1 – 30 nov"). Debe fallar porque incluye el día de la semana.
- [x] 2.11 GREEN — sin día de la semana en `mes`. Test en verde.
- [x] 2.12 REFACTOR — tests del archivo y `npx vitest run src/server/dashboard --reporter=dot` en verde.

## 3. Rango en la pantalla

- [x] 3.1 El agente, con la autorización 0.3 y antes de 3.3, añade `rangoPeriodo: '1 – 30 nov'` al fixture `datos()` de `src/app/(privado)/panel/panel.test.tsx`. Verificación: el diff solo añade esa línea; el test sigue en verde tras 3.3 y `npx tsc --noEmit` no da errores.
- [x] 3.2 RED — `src/server/dashboard/pantalla.int.test.ts`, test "El rango del período usa la fecha de Ecuador" (instante 2026-12-01T03:30:00Z, período "mes" → `rangoPeriodo` "1 – 30 nov"). Debe fallar porque `DatosDashboard` no tiene `rangoPeriodo`.
- [x] 3.3 GREEN — `src/server/dashboard/pantalla.ts`: `limitesPeriodo(periodo, hoy)` con el mismo `hoy` y `rangoPeriodo: textoRangoPeriodo(...)`. Test en verde; `npx tsc --noEmit` sin errores.
- [x] 3.4 REFACTOR — test en verde.
- [x] 3.5 RED — `src/app/(privado)/panel/panel.test.tsx`, test "El rango del período semana muestra de lunes a domingo" (mismo escenario que 2.4, ahora en pantalla) con `datos({ periodo: 'semana', rangoPeriodo: 'lun 2 – dom 8 nov' })`: el texto aparece justo después de la `nav` "Período" en el DOM. Debe fallar porque `ContenidoPanel` no lo muestra.
- [x] 3.6 GREEN — `ContenidoPanel.tsx`: selector y rango agrupados en `flex flex-col gap-fila-y`, `p` con `text-detalle text-muted-foreground` (design, decisión 2). Test en verde.
- [x] 3.7 REFACTOR — `npx vitest run "src/app/(privado)/panel" --reporter=dot` en verde.

## 4. Aclaración de los saldos por cuenta

- [x] 4.1 RED — `src/app/(privado)/panel/panel.test.tsx`, test "Los saldos por cuenta aclaran que no dependen del período" (`periodo: 'semana'`, cuenta "Banco" 500.00): el `h2` "Saldos por cuenta" va seguido de "Saldo de cada cuenta con todos sus movimientos. No cambia con el período elegido.". Debe fallar porque el subtítulo no existe.
- [x] 4.2 GREEN — `SaldosCuentas.tsx`: `p` `text-detalle text-muted-foreground` tras el `h2`, con y sin cuentas. Test en verde.
- [x] 4.3 REFACTOR — tests de la carpeta del panel en verde.

## 5. Acción del encabezado en una línea

- [x] 5.1 RED — `src/app/(privado)/panel/panel.test.tsx`, test "La acción del encabezado no parte su texto" (`hayTransacciones: true`): el enlace "Registrar movimiento" dentro del `banner` tiene un ancestro con `whitespace-nowrap` dentro del `header`. Debe fallar porque hoy no lo tiene.
- [x] 5.2 GREEN — `src/components/EncabezadoPagina.tsx`: acción envuelta en `shrink-0 whitespace-nowrap` (design, decisión 1). Test en verde.
- [x] 5.3 REFACTOR — test en verde.
- [x] 5.4 RED — `src/components/EncabezadoPagina.test.tsx`, test "La acción del encabezado baja bajo el título si no cabe": el padre común del `h1` y la acción tiene `flex-wrap`. Debe fallar porque la fila no admite salto.
- [x] 5.5 GREEN — fila con `flex flex-wrap items-start justify-between gap-entre-campos`. Test en verde; si el hook de pre-commit rechaza alguna clase, detenerse y avisar.
- [x] 5.6 REFACTOR — `npx vitest run src/components "src/app/(privado)" --reporter=dot` en verde (las otras pantallas no pasan `accion` y no cambian).
- [x] 5.7 Documentar en `docs/diseno/sistema/componentes.md`, como viñeta en 7.7 junto a la mención de `EncabezadoPagina` (no hay sección propia; design, decisión 4), que la acción primaria se mantiene en una línea y baja bajo el título si no cabe, con su "Por qué". Sin valores literales. Verificación: el diff solo añade esa viñeta y `grep` no encuentra valores literales en ella.

## 6. Revisión manual

- [ ] 6.1 [HUMANO] Revisar `/panel` a 360 px y a 1280 px con cada período (incluida una semana que cruce de mes si es posible), con y sin cuentas y con y sin transacciones, pasando `docs/diseno/sistema/checklist.md`: botón en una línea (debajo del título en móvil, al lado en escritorio), rango legible bajo el selector y subtítulo de saldos. Verificación: hallazgos anotados en progress.md y corregidos o aceptados.

## 7. Cierre

- [ ] 7.1 `npm run lint`, `npx tsc --noEmit`, `npx vitest run --reporter=dot` y `openspec validate dashboard-ajustes --strict` sin errores.
