# Tasks

Leyenda: **[HUMANO]** = lo hace la persona; el agente se detiene antes.
Los `*.int.test.ts` corren contra `cuadre_test`. Los tests de acciones y pantallas son
unitarios (jsdom) y simulan `@/auth`, `next/navigation`, `next/cache` y el caso de uso.
"Si pasa sin cambios": detenerse y proponer cómo forzar el RED (config.yaml).
Sin migraciones: `Transaccion` ya existe en la migración init (design, Context).
Pantallas: cargar antes la skill `ux-cuadre`.

## 0. Decisiones previas

- [x] 0.1 [HUMANO] Elegir la opción de design d (tipo de transacción = tipo de categoría). Elegida: opción A, el tipo debe coincidir (grupo 5). Verificación: design d indica la opción elegida.
- [x] 0.2 [HUMANO] Autorizar la modificación de los tests existentes de design, riesgos: "La cabecera muestra la marca y la navegación principal" (`CabeceraPrivada.test.tsx`), "El menú móvil muestra la navegación y el cierre de sesión" (`MenuMovil.test.tsx`), "Las tarjetas de acceso del panel tienen un solo enlace" y "El panel usa el encabezado de página" (`panel.test.tsx`), y "Las pantallas privadas no enlazan de vuelta al panel" (`src/app/(privado)/navegacion.test.tsx`, se amplía a transacciones). Autorizada. Verificación: autorización registrada en progress.md.

## 1. Caracterización del saldo actual de cuentas

- [x] 1.1 CARACTERIZACIÓN — `src/server/cuentas/cuentas.int.test.ts`, test "Caracterización: el saldo de una cuenta sin transacciones es su saldo inicial" (saldos iniciales 0.00 y -120.00, por `listarCuentas` y por `obtenerCuenta`). Pasa con el código actual; `cuentas.int.test.ts` completo en verde.

## 2. Registro y listado (caso de uso y repositorio)

- [x] 2.1 RED — `src/server/transacciones/transacciones.int.test.ts`, test "Registrar un gasto válido". Debe fallar porque `registrarTransaccion` no existe.
- [x] 2.2 GREEN — `src/server/transacciones/esquemas.ts` (design b), `src/server/repositories/transaccionRepository.ts` (`crear`, `listar(usuarioId)` con nombres de cuenta y categoría), `src/server/transacciones/transacciones.ts` (`registrarTransaccion`, `listarTransacciones` → `TransaccionItem`) y el saldo de design e (`cuentaRepository.sumasPorCuenta` + `calcularSaldo` en `cuentas.ts`). Test en verde, y 1.1 también.
- [x] 2.3 REFACTOR — tests de los grupos 1 y 2 en verde.
- [x] 2.4 RED — mismo archivo, test "Registrar un ingreso válido con descripción". Si pasa sin cambios, forzar el RED.
- [x] 2.5 GREEN — `esquemas.ts`: coma decimal y descripción recortada (vacía → `null`); `calcularSaldo` suma ingresos si aún no lo hacía. Test en verde.
- [x] 2.6 REFACTOR — test en verde.
- [x] 2.7 RED — mismo archivo, test "Rechazar una transacción con monto inválido".
- [x] 2.8 GREEN — `esquemas.ts`: `refine` > 0 con "El monto debe ser mayor que 0"; `transacciones.ts` devuelve `{ ok: false, errores }` con `agruparErroresPorCampo`. Test en verde.
- [x] 2.9 REFACTOR — test en verde.
- [x] 2.10 RED — mismo archivo, test "Rechazar una transacción con monto de formato inválido".
- [x] 2.11 GREEN — `esquemas.ts`: regex de design b, mensaje "Escribe un monto con hasta 2 decimales, por ejemplo 25.50". Test en verde. Verificar por mutación cada parte de la regex que el test no haya exigido.
- [x] 2.12 REFACTOR — si se repite, extraer la normalización de importes compartida con `src/server/cuentas/esquemas.ts` a `src/server/validacion.ts`, con los tests de cuentas en verde.
- [x] 2.13 RED — mismo archivo, test "Rechazar una transacción sin campos obligatorios".
- [x] 2.14 GREEN — `esquemas.ts`: "Elige una cuenta", "Elige una categoría", "Indica la fecha". Test en verde.
- [x] 2.15 REFACTOR — test en verde.
- [x] 2.16 RED — mismo archivo, test "Rechazar una transacción con fecha inexistente".
- [x] 2.17 GREEN — `esquemas.ts`: formato AAAA-MM-DD y día real. Test en verde.
- [x] 2.18 REFACTOR — test en verde.
- [x] 2.19 RED — mismo archivo, test "Rechazar una transacción con tipo inválido". Si pasa sin cambios, forzar el RED.
- [x] 2.20 GREEN — `esquemas.ts`: `z.enum(['INGRESO','GASTO'], 'Elige si es un gasto o un ingreso')`. Test en verde.
- [x] 2.21 REFACTOR — test en verde.
- [x] 2.22 RED — mismo archivo, test "Longitud máxima de la descripción es 255 caracteres".
- [x] 2.23 GREEN — `esquemas.ts`: máximo 255 tras recortar, "La descripción puede tener como máximo 255 caracteres". Test en verde.
- [x] 2.24 REFACTOR — test en verde.
- [x] 2.25 RED — mismo archivo, test "Listado de transacciones de la más reciente a la más antigua".
- [x] 2.26 GREEN — `transaccionRepository.listar`: `orderBy` fecha y `creadoEn` descendentes. Test en verde.
- [x] 2.27 REFACTOR — test en verde.
- [x] 2.28 RED — mismo archivo, test "Filtrar transacciones por rango de fechas". Debe fallar porque `listarTransacciones` no recibe filtros.
- [x] 2.29 GREEN — `listarTransacciones(usuarioId, filtros)` y `where.fecha` `gte`/`lte` en el repositorio (design f). Test en verde.
- [x] 2.30 REFACTOR — test en verde.
- [x] 2.31 RED — mismo archivo, test "Filtrar transacciones por tipo y cuenta".
- [x] 2.32 GREEN — `where.tipo` y `where.cuentaId`, siempre junto a `usuarioId`. Test en verde.
- [x] 2.33 REFACTOR — test en verde.
- [x] 2.34 RED — mismo archivo, test "Un filtro con valor inválido se ignora".
- [x] 2.35 GREEN — `esquemas.ts`: `esquemaFiltros` con `.catch(undefined)` por campo. Test en verde.
- [x] 2.36 REFACTOR — test en verde.

## 3. Saldo calculado de cuentas

- [x] 3.1 RED — `src/server/cuentas/cuentas.int.test.ts`, test "Saldo de cuenta suma ingresos y resta gastos" (0.00 + 100.00 − 25.50 = 74.50, por lista y por identificador). Si pasa sin cambios, forzar el RED quitando temporalmente la suma de ingresos de `calcularSaldo`.
- [x] 3.2 GREEN — `obtenerCuenta` usa también el saldo calculado; si `_sum` devuelve `number`, detenerse y consultar. Test en verde.
- [x] 3.3 REFACTOR — test en verde.
- [ ] 3.4 RED — mismo archivo, test "Ver el saldo actualizado de una cuenta". Si pasa sin cambios, forzar el RED.
- [ ] 3.5 GREEN — sin cambios si ya lo cumple. Test en verde.
- [ ] 3.6 REFACTOR — test en verde.
- [ ] 3.7 RED — mismo archivo, test "El saldo de una cuenta solo cuenta sus transacciones". Si pasa sin cambios, forzar el RED quitando el agrupado por `cuentaId`.
- [ ] 3.8 GREEN — corregir el agrupado si hace falta. Test en verde.
- [ ] 3.9 REFACTOR — test en verde.
- [ ] 3.10 RED — mismo archivo, test "El saldo de una cuenta no cuenta transacciones de otro usuario". Si pasa sin cambios, forzar el RED quitando `usuarioId` de `sumasPorCuenta`.
- [ ] 3.11 GREEN — corregir el filtro si hace falta. Test en verde.
- [ ] 3.12 REFACTOR — `cuentas.int.test.ts` completo en verde.

## 4. Pertenencia de cuenta y categoría

- [ ] 4.1 RED — `src/server/transacciones/transacciones.int.test.ts`, test "Rechazar una transacción en una cuenta de otro usuario".
- [ ] 4.2 GREEN — `transacciones.ts`: `cuentaRepository.buscarPorId(usuarioId, cuentaId)`; si es `null`, "Elige una de tus cuentas" en `cuentaId` (design c). Test en verde.
- [ ] 4.3 REFACTOR — test en verde.
- [ ] 4.4 RED — mismo archivo, test "Rechazar una transacción con una categoría de otro usuario".
- [ ] 4.5 GREEN — `src/server/repositories/categoriaRepository.ts`: `buscarPorId(usuarioId, id)` con `findFirst({ where: { id, usuarioId } })`; `transacciones.ts`: si es `null`, "Elige una de tus categorías" en `categoriaId`. Test en verde, y `src/server/categorias/categorias.int.test.ts` también.
- [ ] 4.6 REFACTOR — tests de los grupos 2 y 4 en verde.

## 5. Tipo de transacción coincide con la categoría (opción A, design d)

- [ ] 5.1 RED — `transacciones.int.test.ts`, test "Rechazar una transacción cuyo tipo no coincide con su categoría".
- [ ] 5.2 GREEN — `transacciones.ts`: comparar el `tipo` de la categoría que devuelve `categoriaRepository.buscarPorId` (grupo 4) con `datos.tipo`; "Elige una categoría de gasto" / "Elige una categoría de ingreso" en `categoriaId`. Test en verde.
- [ ] 5.3 REFACTOR — tests de los grupos 2, 4 y 5 en verde.

## 6. Aislamiento entre usuarios

- [ ] 6.1 RED — `transacciones.int.test.ts`, test "Un usuario no ve las transacciones de otro". Si pasa sin cambios, forzar el RED quitando `usuarioId` del `where` de `listar`, y restaurar.
- [ ] 6.2 GREEN — corregir el filtro si hace falta. Test en verde.
- [ ] 6.3 REFACTOR — test en verde.
- [ ] 6.4 RED — mismo archivo, test "Filtrar por una cuenta de otro usuario no muestra sus movimientos". Si pasa sin cambios, forzar el RED como en 6.1.
- [ ] 6.5 GREEN — corregir el `where` si hace falta. Test en verde.
- [ ] 6.6 REFACTOR — test en verde.
- [ ] 6.7 RED — `src/server/transacciones/acciones.test.ts`, test "La transacción se crea siempre para el usuario de la sesión". Debe fallar porque `registrarTransaccionAccion` no existe.
- [ ] 6.8 GREEN — `acciones.ts` (`'use server'`): `exigirUsuarioId()` fuera del `try`, solo las claves esperadas del `FormData`; éxito → `revalidatePath('/transacciones')` y `{ exito, idCreado, creado: { tipo, monto, cuentaNombre } }`; error inesperado → `{ mensaje, valores }` (design g). Test en verde.
- [ ] 6.9 REFACTOR — test en verde.
- [ ] 6.10 RED — mismo archivo, test "Registrar una transacción sin sesión redirige al login". Si pasa sin cambios, forzar el RED.
- [ ] 6.11 GREEN — sin cambios si `exigirUsuarioId` ya lo cumple. Test en verde.
- [ ] 6.12 REFACTOR — test en verde.
- [ ] 6.13 RED — `src/server/auth/rutas.test.ts`, test "Ruta de transacciones sin sesión redirige al login". Pasará sin cambios (design h): forzar el RED añadiendo temporalmente `/transacciones` a `RUTAS_PUBLICAS`, y restaurar.
- [ ] 6.14 GREEN — sin cambios en `rutas.ts` ni `proxy.ts`. Test en verde.
- [ ] 6.15 REFACTOR — test en verde.

## 7. Navegación

- [ ] 7.1 RED — `src/components/navegacion/CabeceraPrivada.test.tsx`, test "La cabecera muestra la marca y la navegación principal" actualizado al orden Panel, Transacciones, Cuentas, Categorías (autorizado en 0.2). Falla porque falta la sección.
- [ ] 7.2 GREEN — `secciones.ts`: `{ href: '/transacciones', etiqueta: 'Transacciones' }` tras "Panel" (design h). Test en verde.
- [ ] 7.3 REFACTOR — tests de `src/components/navegacion/` en verde.
- [ ] 7.4 RED — `MenuMovil.test.tsx`, test "El menú móvil muestra la navegación y el cierre de sesión" con "Transacciones" (autorizado en 0.2). Si pasa sin cambios por 7.2, forzar el RED quitando temporalmente la sección.
- [ ] 7.5 GREEN — sin cambios en `MenuMovil.tsx` (usa `NavegacionPrincipal`). Test en verde.
- [ ] 7.6 REFACTOR — test en verde.
- [ ] 7.7 RED — `secciones.test.ts`, test "La cabecera marca Transacciones como activa con filtros en la URL" (`seccionActiva('/transacciones')`; `usePathname` no incluye la query). Si pasa sin cambios, forzar el RED quitando temporalmente la sección.
- [ ] 7.8 GREEN — sin cambios si ya lo cumple. Test en verde.
- [ ] 7.9 REFACTOR — test en verde.
- [ ] 7.10 RED — `src/app/(privado)/panel/panel.test.tsx`, test "El panel enlaza a transacciones".
- [ ] 7.11 GREEN — `ContenidoPanel.tsx`: `TarjetaAcceso` "Transacciones" primera, icono `ArrowLeftRight`, descripción "Lo que entra y sale de tu negocio: ingresos y gastos."; propósito "Desde aquí llegas a tus transacciones, cuentas y categorías." Test en verde.
- [ ] 7.12 REFACTOR — actualizar (autorizado en 0.2) "Las tarjetas de acceso del panel tienen un solo enlace" (tres tarjetas) y "El panel usa el encabezado de página" (nueva frase); `panel.test.tsx` y "El panel enlaza a cuentas y categorías" en verde.

## 8. Pantalla de transacciones: composición y listado

Tests en `src/app/(privado)/transacciones/transacciones.test.tsx` salvo que se indique otro.

- [ ] 8.1 RED — test "Pantalla de transacciones sin cuentas pide crear una cuenta primero". Debe fallar porque `ContenidoTransacciones` no existe.
- [ ] 8.2 GREEN — `src/server/transacciones/pantalla.ts` (`cargarTransacciones(filtros)` → `{ transacciones, cuentas, categorias, filtros, hoy }`), `page.tsx` (await de `searchParams`) y `ContenidoTransacciones.tsx` con `EncabezadoPagina` ("Transacciones" + propósito, **sin** `volverAlPanel`) y el estado sin cuentas (enlace primario a /cuentas). Test en verde.
- [ ] 8.3 REFACTOR — test en verde.
- [ ] 8.4 RED — test "Pantalla de transacciones muestra los movimientos y el formulario en dos columnas".
- [ ] 8.5 GREEN — rejilla `grid-cols-(--columnas-lista-formulario)`, `Tarjeta` con `h2` "Nueva transacción" en `max-w-formulario`, `FormularioTransaccion.tsx` mínimo con el botón primario "Guardar transacción" (design g). Test en verde.
- [ ] 8.6 REFACTOR — test en verde.
- [ ] 8.7 RED — test "La entrada de página se anima solo en el contenedor".
- [ ] 8.8 GREEN — `animate-entrada` solo en el contenedor `max-w-contenido`. Test en verde.
- [ ] 8.9 REFACTOR — test en verde.
- [ ] 8.10 RED — test "Listado muestra cada movimiento con su categoría, cuenta e importe con signo".
- [ ] 8.11 GREEN — `src/components/ListaMovimientos.tsx`: lista por día y `table` propia con tokens (componentes.md 7.4), `Importe` de tipo `ingreso`/`gasto` (7.5). Test en verde.
- [ ] 8.12 REFACTOR — test en verde.
- [ ] 8.13 RED — `src/app/(privado)/navegacion.test.tsx`, test "Las pantallas privadas no enlazan de vuelta al panel" ampliado a `ContenidoTransacciones` (autorizado en 0.2). Si pasa sin cambios, forzar el RED pasando temporalmente `volverAlPanel`.
- [ ] 8.14 GREEN — sin cambios si ya lo cumple. Test en verde.
- [ ] 8.15 REFACTOR — test en verde.

## 9. Formulario de nueva transacción

- [ ] 9.1 RED — `transacciones.test.tsx`, test "Selector de tipo empieza en Gasto y filtra las categorías".
- [ ] 9.2 GREEN — `src/components/ui/SelectorTipo.tsx` (design g; iconos `Minus`/`Plus` de `lucide-react`) y filtro de categorías por el tipo elegido en `FormularioTransaccion`. Test en verde.
- [ ] 9.3 REFACTOR — test en verde.
- [ ] 9.4 RED — mismo archivo, test "Formulario de transacción usa controles nativos y el monto con prefijo".
- [ ] 9.5 GREEN — `src/components/ui/Selector.tsx` (`select` nativo con tokens de campo, etiqueta y error) para categoría y cuenta, `Campo monto` con etiqueta "Monto", `noValidate`, primera cuenta por defecto. Test en verde.
- [ ] 9.6 REFACTOR — test en verde.
- [ ] 9.7 RED — `src/server/transacciones/pantalla.test.ts`, test "Fecha del formulario empieza en el día de hoy" (`vi.setSystemTime('2026-09-29T04:30:00Z')`).
- [ ] 9.8 GREEN — `pantalla.ts`: `hoy` con zona `America/Guayaquil`; el formulario lo usa como `defaultValue`. Test en verde.
- [ ] 9.9 REFACTOR — test en verde.
- [ ] 9.10 RED — `transacciones.test.tsx`, test "Formulario de transacción muestra el error junto a cada campo".
- [ ] 9.11 GREEN — errores y `aria-invalid` en cada campo, `useFocoPrimerError`. Test en verde.
- [ ] 9.12 REFACTOR — test en verde.
- [ ] 9.13 RED — mismo archivo, test "Error al guardar la transacción conserva los datos escritos".
- [ ] 9.14 GREEN — aviso `role="alert"` encima del botón, `defaultValue` desde `estado.valores` (también el tipo) y `key` por respuesta. Test en verde.
- [ ] 9.15 REFACTOR — test en verde.

## 10. Estados y filtros de la pantalla

- [ ] 10.1 RED — `transacciones.test.tsx`, test "Pantalla de transacciones sin movimientos muestra el estado vacío".
- [ ] 10.2 GREEN — vacío sin filtros con botón secundario que enfoca el monto (estados.md 9.1). Test en verde.
- [ ] 10.3 REFACTOR — test en verde.
- [ ] 10.4 RED — mismo archivo, test "Filtros sin resultados muestran el vacío por filtro".
- [ ] 10.5 GREEN — `src/components/FiltrosMovimientos.tsx` (design f) y el vacío por filtro con la frase del rango en `es-EC` y "Quitar filtros" terciario. Test en verde.
- [ ] 10.6 REFACTOR — test en verde.
- [ ] 10.7 RED — mismo archivo, test "Cambiar un filtro actualiza la URL y conserva los datos mientras carga".
- [ ] 10.8 GREEN — `router.replace` dentro de `useTransition` y "Actualizando…" mientras `isPending`. Test en verde.
- [ ] 10.9 REFACTOR — test en verde.
- [ ] 10.10 RED — mismo archivo, test "Quitar filtros solo aparece con un filtro activo". Si pasa sin cambios, forzar el RED.
- [ ] 10.11 GREEN — condición de filtro activo. Test en verde.
- [ ] 10.12 REFACTOR — test en verde.
- [ ] 10.13 RED — mismo archivo, test "Transacción registrada se anuncia y se resalta en el listado".
- [ ] 10.14 GREEN — región `aria-live` con `formatearImporte` y `creado.cuentaNombre`; `idResaltado` → `animate-resaltado` en la fila. Test en verde.
- [ ] 10.15 REFACTOR — test en verde.
- [ ] 10.16 RED — `src/app/(privado)/transacciones/estados.test.tsx`, test "Pantalla de transacciones en carga muestra un esqueleto ocupado".
- [ ] 10.17 GREEN — `loading.tsx` con `animate-esqueleto`. Test en verde.
- [ ] 10.18 REFACTOR — test en verde.
- [ ] 10.19 RED — mismo archivo, test "Error al cargar las transacciones ofrece reintentar".
- [ ] 10.20 GREEN — `error.tsx` con `retry()`. Test en verde.
- [ ] 10.21 REFACTOR — test en verde.
- [ ] 10.22 [HUMANO] Revisión manual con `npm run dev`: `docs/diseno/sistema/checklist.md` a 360 px y 1280 px, esqueleto con retardo, "Actualizando…" conservando la lista, y un gasto que cambia el saldo en `/cuentas`.

## 11. Documentación y cierre

- [ ] 11.1 `readme.md`: §4 sustituye `/api/transacciones` por las Server Actions de registrar y listar (entrada, filtros, errores por campo, sesión); HU-001 implementado; HU-004 con la asignación cubierta; HU-002 con saldo calculado. Verificación: `grep -n "api/transacciones" readme.md` sin resultados como endpoint vigente.
- [ ] 11.2 `docs/pendientes.md`: quitar "selector de tipo" y "lista y tabla de movimientos" de los componentes que faltan. Verificación: lectura del archivo.
- [ ] 11.3 Cierre — `npm run lint`, `npx tsc --noEmit`, `npx vitest run --reporter=dot` y `openspec validate transacciones --strict`, todo sin errores.
