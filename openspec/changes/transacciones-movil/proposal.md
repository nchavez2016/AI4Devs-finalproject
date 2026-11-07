# Proposal

## Why

El brief pide "móvil primero en el registro", pero a 360 px el formulario de `/transacciones`
aparece después de cuatro filtros y de toda la lista: registrar un gasto, la tarea más
frecuente, es lo último que se alcanza. componentes.md (7.1, 7.2 y 7.4) ya describe el
registro móvil que no se construyó.

## What Changes

- Por debajo de `escritorio`, el formulario "Nueva transacción" va antes que "Movimientos", en
  el DOM y no solo con CSS, para que lectura, foco y vista coincidan (WCAG 2.4.3). En
  escritorio siguen las dos columnas con el formulario a la derecha. Sin foco automático al
  cargar.
- En móvil los filtros se colapsan tras un botón "Filtros" que muestra cuántos hay activos
  (`aria-expanded`, `aria-controls`); en escritorio se ven siempre. "Quitar filtros" y
  "Actualizando…" siguen visibles.
- En móvil, "Guardar transacción" queda fijo abajo, a todo el ancho, con
  `safe-area-inset-bottom`; la página reserva `reserva-barra-inferior` y la aplica a
  `scroll-padding-bottom`.
- La cabecera del día de hoy en la lista móvil dice "Hoy · vie, 6 nov".
- Se elimina el hueco vertical que deja la región `aria-live` vacía entre el encabezado y el
  primer bloque.
- El selector de tipo se especifica con icono −/+ decorativo y nombre accesible "Gasto" /
  "Ingreso" (componentes.md 7.2).
- Documentación: regla "en pantallas de registro frecuente, el formulario va primero en móvil"
  en `.agents/skills/ux-cuadre/SKILL.md`, y ajustes en componentes.md, tokens.md y checklist.md.
- Cuentas y categorías: se evalúa en design.md y se mantienen con la lista primero.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `transacciones`: cambian los requirements "Pantalla de transacciones" (orden en móvil, botón
  fijo, cabecera "Hoy", espaciado), "Formulario de nueva transacción" (selector de tipo con
  icono decorativo, sin foco automático) y "Estados de la pantalla de transacciones" (filtros
  colapsables en móvil).

Specs no afectadas: `cuentas`, `categorias`, `formularios`, `navegacion`.

## Impact

- Código: `ContenidoTransacciones.tsx`, `FormularioTransaccion.tsx`,
  `src/components/FiltrosMovimientos.tsx`, `src/components/ListaMovimientos.tsx`,
  `src/app/globals.css` (tokens del margen seguro, `scroll-padding-bottom` y fill-mode de
  `animate-entrada`).
- Tests: el test existente "Pantalla de transacciones muestra los movimientos y el formulario
  en dos columnas" exige hoy los movimientos antes que el formulario; hay que modificarlo, con
  autorización previa.
- Dependencias nuevas: ninguna.

## Fuera de alcance

Registro en un Sheet o pantalla aparte, edición de movimientos, filtros avanzados, dashboard,
"Ayer" en las cabeceras de día, recordar la última cuenta usada, y cambiar el orden en cuentas
y categorías.
