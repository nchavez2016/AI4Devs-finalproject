# Design: dashboard

## Context

Ver proposal.md (Why). Estado actual que condiciona el enfoque:

- `/panel` = `cargarPanel()` (`src/server/panel.ts`, usa `auth()` + `redirect`) y `ContenidoPanel` con
  tres `TarjetaAcceso`. Sin `loading.tsx` ni `error.tsx`. Tests en `panel.test.tsx`.
- `listarCuentas(usuarioId)` ya devuelve el saldo actual con `cuentaRepository.sumasPorCuenta`
  (`groupBy` por cuenta y tipo) + `calcularSaldo`, como cadena `toFixed(2)`.
- `hoy` en Ecuador: `Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil' })` dentro de
  `src/server/transacciones/pantalla.ts`, probado con reloj simulado ("Fecha del formulario empieza
  en el día de hoy"). Es independiente de la zona del proceso.
- `Transaccion.fecha` es `@db.Date`; los filtros la construyen con `Date.UTC` (medianoche UTC).
  Existe `@@index([usuarioId, fecha])`. Un usuario nuevo no tiene cuentas (el registro solo crea
  categorías).

**Discrepancias detectadas** (se sigue el readme salvo que el humano diga otra cosa):
1. El encargo sugiere "mes en curso / últimos 30 días / otro"; readme (API, TK-003) y la skill
   `dashboard-cuadre` dicen `dia | semana | mes`, por defecto `mes`.
2. TK-003 habla de `GET /api/dashboard` y shadcn/ui; la sección 4 del readme dice que el dashboard
   "seguirá la misma vía" (carga en servidor). Se carga en servidor y se usan componentes propios.
3. El JSON de ejemplo del readme usa `number`; AGENTS.md exige `Decimal` → cadenas en la UI.
4. Texto del vacío: readme "invita a registrar mi primera transacción"; estados.md 9.1 "No hay
   movimientos en este período." Se distinguen dos vacíos (decisión 0.3).
5. Ni readme ni skill fijan el inicio de semana ni el tamaño del top: decisiones 0.1 y 0.5.

## Goals / Non-Goals

**Goals:** agregaciones en base de datos (`groupBy`, nunca cargar filas para sumar); período
independiente de la zona del servidor; reutilizar `listarCuentas`; la pantalla no depende del seed.

**Non-Goals:** navegar a períodos anteriores, endpoint REST, caché/`use cache`, seed del revisor.

## Decisiones abiertas [HUMANO] (con recomendación; specs y tasks asumen la recomendada)

**Elegido por la persona: la opción recomendada en 0.1–0.6, con la semana de lunes a domingo.**

**0.1 Período por defecto, selector y URL.**
A) `?periodo=dia|semana|mes`, por defecto `mes`, solo el período en curso; semana lunes–domingo
(ISO 8601, uso habitual en Ecuador). B) `mes` / `ultimos30` / rango `desde`–`hasta` reutilizando
los filtros de transacciones (contradice el readme). C) A + `&ref=AAAA-MM-DD` para navegar a
períodos anteriores (más alcance y tests). **Recomendado: A.** Valor inválido → `mes` (mismo
criterio que los filtros: se ignora). El selector son tres enlaces (`Link`), sin JS obligatorio.

**0.2 Zona horaria y límites.**
A) Extraer el cálculo de `hoy` a `src/server/fechas.ts` (`hoyEnEcuador()` → `AAAA-MM-DD`) y
calcular `desde`/`hasta` con aritmética de calendario en UTC (`Date.UTC`), igual que `esquemas.ts`;
`pantalla.ts` de transacciones pasa a usarlo. B) Zona del navegador (cookie/cabecera): datos
distintos según dispositivo y más superficie. C) Zona del proceso (`TZ`): rompe en un servidor en
UTC (Vercel). **Recomendado: A.** Función pura `limitesPeriodo(periodo, hoy)` → `{ desde, hasta }`.

**0.3 Cuentas sin movimientos y transacciones fuera del período.**
Recomendado: totales y top **solo del período**; saldos por cuenta **acumulados** (incluyen fechas
fuera del período, también futuras, igual que `/cuentas`); cuentas sin movimientos se listan con su
saldo inicial; dos vacíos: sin ninguna transacción ("Todavía no has registrado movimientos…") y
período sin movimientos ("No hay movimientos en este período."). Alternativa: saldos a la fecha de
cierre del período (no lo pide el readme y diverge de `/cuentas`).

**0.4 Dónde vive.**
A) En `/panel`, sustituyendo las tarjetas de acceso (la cabecera ya navega a todo) y con
"Registrar movimiento" como único primario. B) En `/panel`, conservando las tres tarjetas debajo
(más ruido; ninguna spec cambia). C) Ruta nueva `/dashboard`: cambia la navegación, la redirección
de `/` y tres specs. **Recomendado: A** (REMOVED en la spec `cuentas`). Primario: en la cabecera de
página si hay datos; en el vacío "Dashboard sin datos", el botón del vacío (nunca dos).

**0.5 Tamaño del top y saldo total.** Recomendado: máximo 5 categorías, sin fila "Otras" (el total
de gastos ya está arriba); sin "saldo total" (la API del readme no lo incluye). Alternativa: top 5
+ "Otras", o mostrar todas.

**0.6 Gráfico.** A) Recharts (aprobada en AGENTS.md, pedida en TK-003; visualizacion.md 8.9 está
escrita para ella), versión exacta fijada al instalar. B) SVG propio con `<rect>` (sin dependencia,
pero reimplementa ejes, escalas y redimensión). C) Solo lista con importes (incumple
visualizacion.md 8.1). **Recomendado: A**, cargada en un componente cliente `GraficoCategorias`.
Instalada: `recharts@3.10.1` (versión exacta; peers `react`, `react-dom` y `react-is` compatibles con
React 19, `react-is` lo resuelve npm). `npm run build` y `npm run typecheck` sin errores.

## Decisiones técnicas

- **Capas.** `transaccionRepository` añade `sumasPorTipo(usuarioId, desde, hasta)` y
  `sumasGastoPorCategoria(usuarioId, desde, hasta)` (`groupBy`, `where` siempre con `usuarioId`) y
  `existeAlguna(usuarioId)`. Los nombres de categoría se toman de `categoriaRepository.listar`.
  Caso de uso `src/server/dashboard/dashboard.ts` (`calcularResumen`) ordena (total desc, nombre
  asc), recorta a 5 y convierte a `toFixed(2)`. `src/server/dashboard/pantalla.ts`
  (`cargarDashboard(parametrosDeUrl)`) usa `exigirUsuarioId()`, valida `periodo` con Zod y lanza las
  consultas con `Promise.all`. Sin server actions: el dashboard solo lee.
- **Estados de error/carga a nivel de página** (`panel/loading.tsx`, `panel/error.tsx`): las tres
  secciones salen de una sola carga. Desvía de visualizacion.md 8.6 (error por sección); separarlas
  exigiría `Suspense` + error boundary por sección. "Actualizando…" con `useLinkStatus` (Next 16).
- **Tests de datos.** `*.int.test.ts` contra `cuadre_test` (estrategia vigente) con reloj simulado
  solo para `Date`. En jsdom `ResponsiveContainer` mide 0: los tests de componente comprueban la
  tabla y el `aria-label`, no las barras SVG.

## Risks / Trade-offs

- [Recharts + React 19 / peer `react-is`] → instalar la versión exacta, `npm run build` en la tarea.
- [Fechas futuras cuentan en "mes" y en saldos] → coherente con `/cuentas`; documentado en 0.3.
- [Cambiar `panel.test.tsx` y `pantalla.ts` de transacciones] → caracterización previa y
  autorización 0.7 en tasks.md.
- [Seed del revisor] → el dashboard no asume datos; el seed solo inserta filas.

## Migration Plan

Sin migraciones ni variables nuevas. Rollback: revertir los commits del change.
