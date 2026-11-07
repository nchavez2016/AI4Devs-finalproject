# Proposal: dashboard-ajustes

## Why

En la revisión de /panel a 360 px aparecieron tres puntos que restan claridad: el botón
"Registrar movimiento" se parte en dos líneas junto al `h1`; el selector dice "Esta semana" o
"Este mes" pero no qué días abarca; y no se entiende que "Saldos por cuenta" no cambia al elegir
otro período, a diferencia del resto del panel.

## What Changes

- El encabezado de página mantiene su acción en una sola línea; si no cabe junto al título, la
  acción baja debajo del título en vez de partirse.
- Bajo el selector de período, una línea con el rango exacto del período en fechas de Ecuador:
  "vie 6 nov" (hoy), "lun 2 – dom 8 nov" (semana), "1 – 30 nov" (mes); si la semana cruza de mes,
  "lun 30 nov – dom 6 dic". El texto se arma en el servidor a partir de `limitesPeriodo`, sin
  recalcular fechas en el cliente.
- Bajo el título "Saldos por cuenta", un subtítulo que aclara que el saldo incluye todos los
  movimientos de la cuenta y que no depende del período elegido.
- `docs/diseno/sistema/componentes.md` documenta que la acción del encabezado no se parte y baja
  bajo el título si no cabe.
- Sin cambios de schema, migraciones ni dependencias nuevas.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `dashboard`: se añaden tres requisitos: rango visible del período, aclaración de que los saldos
  no dependen del período y acción primaria del encabezado en una sola línea.

Las demás specs (`navegacion`, `formularios`, `cuentas`, `categorias`, `transacciones`) no se
ven afectadas: `EncabezadoPagina` solo recibe `accion` en el panel.

## Impact

- `src/server/dashboard/periodo.ts`: nueva función pura que da el texto del rango.
- `src/server/dashboard/pantalla.ts`: `DatosDashboard` gana el campo `rangoPeriodo`.
- `src/app/(privado)/panel/ContenidoPanel.tsx` y `SaldosCuentas.tsx`: nueva línea de rango y
  subtítulo.
- `src/components/EncabezadoPagina.tsx`: fila del encabezado que admite salto de línea y acción
  sin cortes.
- Tests existentes que cambian (autorización [HUMANO] en el grupo 0): el fixture `datos()` de
  `panel/panel.test.tsx` debe incluir `rangoPeriodo`.

## Fuera de alcance

- Enlaces entre pantallas (por ejemplo, desde una cuenta a sus movimientos).
- Navegar a períodos anteriores o posteriores.
- Cambios en el gráfico de categorías.
- Tests E2E con Playwright.
