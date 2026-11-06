# Design

## Context

`Transaccion` existe desde la migración init (`monto Decimal(14,2)`, `fecha @db.Date`), así
que no hay cambio de schema. Se reutiliza lo de `cuentas-y-categorias` (caso de uso con
`usuarioId`, `{ ok, errores }`, `exigirUsuarioId()`, `useActionState` con `key` y
`defaultValue`, `loading.tsx`/`error.tsx`, `cuadre_test` + `limpiarBD`) y lo de
`rediseno-base`: layout `(privado)` con cabecera, `SECCIONES`, `Tarjeta`/`TarjetaAcceso`,
`Campo monto`, `useFocoPrimerError`, `animate-entrada`, `--columnas-lista-formulario` y
`lucide-react`. Hoy cuentas y categorías escriben su `<select>` a mano.

## Goals / Non-Goals

**Goals:** montos que nunca pasan por `number`; pertenencia comprobada en el servidor; saldo
calculado en un único sitio; filtros que viven en la URL.
**Non-Goals:** shadcn/ui (Select, Table), dependencias nuevas, reformateo del monto al salir
del campo (sigue en `docs/pendientes.md`).

## Decisions

**a) Capas, sin API REST.** `src/server/transacciones/` (`esquemas.ts`, `transacciones.ts`,
`acciones.ts`, `pantalla.ts`) + `transaccionRepository`. *Descartado:* `/api/transacciones`,
que duplicaría validación y sesión; el readme §4 se corrige al cerrar.

**b) Monto y fecha.** Monto: recorta, acepta `^-?\d{1,12}([.,]\d{1,2})?$`, coma → punto y un
`refine` con `Prisma.Decimal` > 0 ("El monto debe ser mayor que 0"); el signo se admite en el
formato para que "-25.50" reciba ese mensaje. Fecha: `^\d{4}-\d{2}-\d{2}$` + día real (ida y
vuelta por `Date.UTC`); se guarda a medianoche UTC y vuelve como texto. `TransaccionItem`:
`monto: string`, `fecha: string`, `cuenta`/`categoria` `{ id, nombre }`.

**c) Pertenencia.** `cuentaRepository.buscarPorId(usuarioId, id)` y un nuevo
`categoriaRepository.buscarPorId(usuarioId, id)`; si no aparecen, el mismo error para ajena e
inexistente. *Descartado:* confiar en la FK, que acepta una cuenta de otro usuario.

**d) El tipo de la transacción debe coincidir con el de la categoría.** Decisión del humano
(tarea 0.1): opción A.
- *A (elegida): sí.* Un gasto en "Ventas" corrompería el top de gastos del dashboard. La
  pantalla ya filtra las categorías por tipo; el servidor hace cumplir lo mismo. Se compara
  con el `tipo` de la categoría que devuelve `categoriaRepository.buscarPorId` (decisión c),
  sin otra consulta. Error "Elige una categoría de {gasto|ingreso}" en `categoriaId`.
- *B (descartada): no.* Más flexible, pero el dashboard tendría que decidir cómo agrupar los
  cruces.

Orden en tasks.md: la pertenencia (c) es el grupo 4 y esta comprobación, el grupo 5.

**e) Saldo calculado.** `cuentaRepository.sumasPorCuenta(usuarioId)` con
`transaccion.groupBy({ by: ['cuentaId','tipo'], _sum: { monto } })` filtrado por `usuarioId`;
`calcularSaldo` puro con `Decimal` en `cuentas.ts`. La forma de `CuentaItem` no cambia.
*Descartado:* traer todas las filas o SQL crudo.

**f) Filtros por URL.** `page.tsx` recibe `searchParams` (asíncrono en Next 16) y
`cargarTransacciones(filtros)` los valida con `esquemaFiltros` (Zod, cada campo `.catch(undefined)`:
un valor inválido se ignora). El repositorio añade `fecha gte/lte`, `tipo` y `cuentaId` al
`where`, siempre junto a `usuarioId`, así que una cuenta ajena da lista vacía.
`FiltrosMovimientos` (cliente): dos `input type="date"`, tipo y cuenta con `Selector`; al
cambiar, `router.replace` con la URL nueva dentro de `useTransition`; mientras `isPending`
muestra "Actualizando…" y la lista anterior sigue en pantalla. "Quitar filtros" (terciario)
solo con un filtro activo. Sin botón "Aplicar": así la vista conserva un solo primario.
*Descartado:* filtrar en el cliente (no escala y separa la URL del dato).

**g) Pantalla y componentes.** Composición de cuentas: `main` > contenedor `max-w-contenido`
con `animate-entrada` > `EncabezadoPagina` (sin `volverAlPanel`) > región `aria-live` > rejilla
`grid-cols-(--columnas-lista-formulario)` con [filtros + movimientos] y la `Tarjeta`
"Nueva transacción" en `max-w-formulario`. Nuevos:
- `ui/SelectorTipo.tsx`: dos radios nativos `name="tipo"` en control segmentado, iconos
  `Minus`/`Plus`, Gasto primero (componentes.md 7.2).
- `ui/Selector.tsx`: `select` nativo con los tokens del campo, etiqueta, error y
  `aria-invalid`, como `Campo`. Se usa en el formulario y en los filtros (tercer y cuarto uso
  de un `select`: se extrae ahora). Cuentas y categorías no se migran en este change.
- `ListaMovimientos.tsx`: lista por día (oculta desde `escritorio`) y `table` propia (oculta
  por debajo), ambas en el DOM con `display: none`, que las saca del árbol de accesibilidad;
  los tests consultan dentro de `role="table"` o `role="list"`. Importes con `Importe`.
- Éxito: la acción devuelve `{ exito, idCreado, creado: { tipo, monto, cuentaNombre } }`, para
  anunciar "Gasto de $25,50 registrado en Efectivo." aunque un filtro oculte la fila
  (`formatearImporte`). El formulario: `noValidate`, `useFocoPrimerError`, `hoy` calculado en
  el servidor con zona `America/Guayaquil`, primera cuenta por defecto.

**h) Navegación.** Se añade `{ href: '/transacciones', etiqueta: 'Transacciones' }` en
`SECCIONES` después de "Panel": es la tarea más frecuente. `NavegacionPrincipal` y `MenuMovil`
leen `SECCIONES`, así que no cambian; cambian sus tests. El panel suma una `TarjetaAcceso`
(icono `ArrowLeftRight`) primera, y su frase de propósito pasa a "Desde aquí llegas a tus
transacciones, cuentas y categorías." Rutas: `resolverRedireccion` solo enumera las públicas,
así que `/transacciones` ya exige sesión; ni `rutas.ts` ni `proxy.ts` cambian, solo se añade
un test.

## Risks / Trade-offs

- [Tests existentes que el nuevo orden contradice] → autorizado por el humano (tarea 0.2):
  se modifican "La cabecera muestra la marca y la navegación principal", "El menú móvil muestra
  la navegación y el cierre de sesión", "Las tarjetas de acceso del panel tienen un solo
  enlace", "El panel usa el encabezado de página" y se amplía "Las pantallas privadas no
  enlazan de vuelta al panel".
- [`groupBy` con `_sum` de `Decimal` no probado en Prisma 7.10] → lo ejercita el RED del
  saldo; si devuelve `number`, detenerse.
- [`useTransition` + `router.replace` en jsdom] → el test simula `next/navigation` y comprueba
  la URL pedida y "Actualizando…"; la conservación real de datos se revisa a mano (tarea 10.22).
- [Lista y tabla duplican marcado] → aceptado sin paginación en el MVP.
- [Los RED de aislamiento pueden pasar solos] → se fuerzan quitando temporalmente el filtro de
  `usuarioId`.
