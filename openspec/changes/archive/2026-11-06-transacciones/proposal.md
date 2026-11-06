# Proposal

## Why

Cuadre todavía no registra el dinero que entra y sale: las cuentas muestran solo su saldo
inicial y las categorías no se usan en ningún movimiento. HU-001 es el núcleo del MVP y
desbloquea el saldo real de las cuentas (HU-002), la asignación de categorías (HU-004) y el
dashboard (HU-003). rediseno-base ya dejó la cabecera, la composición y los formularios que
esta pantalla reutiliza.

## What Changes

- Registrar una transacción (ingreso o gasto) con monto, fecha, cuenta, categoría y
  descripción opcional, validada en el servidor con Zod; monto en texto → `Decimal`, > 0.
- La cuenta y la categoría deben pertenecer al usuario de la sesión. El tipo debe coincidir
  con el de la categoría (decisión abierta, design.md; la spec recoge la opción recomendada).
- Listado de la más reciente a la más antigua, con filtros básicos por URL: `desde`,
  `hasta`, `tipo`, `cuentaId`.
- Saldo de cuenta calculado: saldo inicial + ingresos − gastos, previa caracterización.
- Pantalla `/transacciones` con la composición de rediseno-base: movimientos y tarjeta
  "Nueva transacción" en dos columnas, selector de tipo, `select` nativos, monto con "$"
  dentro del borde, foco en el primer error, lista por día en móvil y tabla propia en
  escritorio, estados de estados.md (vacío, vacío por filtro, "Actualizando…", carga, error,
  éxito).
- Navegación: "Transacciones" en la cabecera, en el menú móvil y como tarjeta de acceso del
  panel.
- Al cerrar: el readme §4 documenta las Server Actions en lugar de `/api/transacciones`, y
  HU-001/HU-004 actualizan su estado.

Mismas capas que cuentas. Sin migración: `Transaccion` existe desde la migración init.

## Capabilities

### New Capabilities
- `transacciones`: registro, listado y filtros de transacciones, pertenencia de cuenta y
  categoría, aislamiento entre usuarios, pantalla `/transacciones` y sus estados.

### Modified Capabilities
- `cuentas`: saldo calculado; el panel suma la tarjeta "Transacciones".
- `navegacion`: "Transacciones" en la navegación principal y en el menú móvil.

`categorias` y `formularios` no cambian de requirements: la asignación de categoría se
especifica en `transacciones` (cubre el criterio pendiente de HU-004) y el formulario nuevo
sigue las reglas de `formularios`. `autenticacion` no cambia: `/transacciones` ya queda
protegida por la regla general de rutas privadas.

## Impact

- Nuevo: `transaccionRepository`, `src/server/transacciones/`,
  `src/app/(privado)/transacciones/`, `src/components/ui/SelectorTipo.tsx`,
  `src/components/ui/Selector.tsx`, `src/components/ListaMovimientos.tsx`,
  `src/components/FiltrosMovimientos.tsx`.
- Cambia: `cuentaRepository`, `categoriaRepository`, `cuentas.ts`, `secciones.ts`,
  `ContenidoPanel.tsx`, tests existentes de navegación y panel (con autorización),
  `readme.md`, `docs/pendientes.md`.
- Dependencias: ninguna nueva. Se usan `lucide-react` (ya instalada por rediseno-base); sin
  shadcn/ui.

## Fuera de alcance

Editar y eliminar (HU-005), por eso las filas no abren una vista de edición; filtros
avanzados (categoría, rangos libres, búsqueda de texto); paginación; recordar la última
cuenta usada; subcategorías; dashboard (HU-003); Playwright.
