# Proposal: dashboard

## Why

HU-003 es la última historia must-have pendiente. Hoy `/panel` solo muestra el negocio y tres
tarjetas de acceso: no se ve cuánto entró y salió en el período, cuánto hay en cada cuenta ni en
qué se gasta más. HU-001 está archivada: el dashboard solo lee y agrega datos reales.

## What Changes

- `/panel` pasa a ser el dashboard (decisión 0.4, recomendada): sustituye a la sección estática
  de accesos.
- Selector de período `dia` / `semana` / `mes` (por defecto `mes`) que viaja en la URL
  (`?periodo=`), con límites calculados en fechas calendario de Ecuador (decisiones 0.1 y 0.2).
- Totales del período: ingresos, gastos y balance (ingresos − gastos), como importes con
  2 decimales.
- Saldo actual de cada cuenta (acumulado: saldo inicial + ingresos − gastos), reutilizando el
  cálculo de cuentas.
- Categorías de gasto del período ordenadas de mayor a menor, con un gráfico de barras
  horizontales y su tabla equivalente (visualizacion.md, 8).
- Estados vacío (sin transacciones y período sin movimientos), carga y error.
- Agregaciones nuevas en `transaccionRepository` (sumas agrupadas, no carga de filas).
- **BREAKING (spec)**: se retiran las tarjetas de acceso del panel (decisión 0.4); la navegación
  de la cabecera ya cubre esos destinos.

## Capabilities

### New Capabilities
- `dashboard`: período y sus límites, totales, saldos por cuenta, top de categorías de gasto,
  gráfico accesible, estados y aislamiento entre usuarios.

### Modified Capabilities
- `cuentas`: se elimina el requirement "Acceso desde el panel" (tarjetas de acceso).

La spec `autenticacion` ("El panel muestra el negocio del usuario autenticado") no cambia: el
dashboard conserva el nombre del negocio como `h1`.

## Fuera de alcance

- Seed del usuario revisor, E2E con Playwright, despliegue y CI (changes posteriores; el diseño
  no los impide).
- Navegar a períodos anteriores, rangos personalizados, comparación entre períodos, tendencias.
- Subcategorías, editar o eliminar movimientos (HU-005).
- Endpoint REST `GET /api/dashboard`: se carga en el servidor como el resto de pantallas
  (readme, sección 4).
- Ahorros, presupuestos, préstamos, tarjetas, suscripciones, IA.

## Impact

- Código: `src/app/(privado)/panel/*` (página, contenido, `loading.tsx` y `error.tsx` nuevos),
  `src/server/panel.ts` → carga del dashboard, `src/server/repositories/transaccionRepository.ts`,
  extracción de `hoy` en Ecuador desde `src/server/transacciones/pantalla.ts` a un módulo común.
- Tests: `panel.test.tsx` cambia (requiere autorización, tarea 0.7); tests nuevos unitarios,
  de componente e integración (`*.int.test.ts`).
- Dependencias: **Recharts** (aprobada en AGENTS.md), versión exacta, justificada en design.md
  (decisión 0.6). Sin migraciones: el índice `@@index([usuarioId, fecha])` ya existe.
