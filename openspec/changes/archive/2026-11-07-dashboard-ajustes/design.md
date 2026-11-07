# Design: dashboard-ajustes

## Context

Ver proposal.md (Why). Hoy `cargarDashboard` obtiene `hoy` con `hoyEnEcuador()` y el período
validado, y `calcularResumen` llama a `limitesPeriodo(periodo, hoy)`, que devuelve `desde` y
`hasta` como medianoche UTC de cada fecha calendario. `ListaMovimientos` ya formatea fechas con
`Intl.DateTimeFormat('es-EC', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' })`
("vie, 6 nov"). `EncabezadoPagina` pone título y acción en una fila `flex justify-between` sin
salto, por eso el botón se estrecha y parte su texto a 360 px.

## Decisiones

**1. Encabezado: cambiar `EncabezadoPagina`, no solo el panel.**
La fila pasa a `flex flex-wrap items-start justify-between gap-entre-campos` y la acción va en un
contenedor `shrink-0 whitespace-nowrap`. La frase de propósito ocupa más de 360 px, así que el
bloque del título llena la línea y la acción baja sola; en escritorio queda al lado.
- Es lo menos invasivo: el panel es la única pantalla que pasa `accion` a `EncabezadoPagina`
  (las demás `accion=` del código son acciones de formulario), así que ninguna otra pantalla
  cambia, y el arreglo queda donde vive la regla "una acción primaria" para las futuras.
- Alternativa descartada: sacar el botón del encabezado solo en el panel. Saca la acción del
  `header`, duplica maquetación y deja el defecto latente en el componente.
- `flex-wrap` y `whitespace-nowrap` no son valores del tema; si el hook de pre-commit los
  rechazara, detenerse y avisar (no buscar equivalentes por cuenta propia).

**2. Rango del período: texto armado en el servidor.**
- Nueva función pura `textoRangoPeriodo(periodo, limites)` en `src/server/dashboard/periodo.ts`.
  `cargarDashboard` llama a `limitesPeriodo(periodo, hoy)` con el mismo `hoy` que el resumen y
  añade `rangoPeriodo: string` a `DatosDashboard`. El cliente solo muestra el texto: no hay
  segundo cálculo de fechas ni riesgo de que la zona horaria del navegador corra el día.
- Formato: `Intl.DateTimeFormat('es-EC', { timeZone: 'UTC', ... })` con `formatToParts`,
  coherente con "vie, 6 nov" (mismas abreviaturas), pero sin coma, como en los ejemplos pedidos;
  se quita un posible punto final de las abreviaturas para no depender de la versión de ICU.
  Reglas: día → `"vie 6 nov"`; semana mismo mes → `"lun 2 – dom 8 nov"`; semana entre meses →
  `"lun 30 nov – dom 6 dic"`; mes → `"1 – 30 nov"`. Separador: espacio, raya corta U+2013, espacio.
  Sin año (siempre es el período en curso).
- Se muestra en `ContenidoPanel` (componente de servidor), justo después de `SelectorPeriodo`,
  agrupados en `flex flex-col gap-fila-y`, con `text-detalle text-muted-foreground`. No se toca
  `SelectorPeriodo` (cliente): mientras dice "Actualizando…", el rango anterior sigue con los
  datos anteriores, que es coherente.
- Alternativa descartada: pasar `desde`/`hasta` al cliente y formatear allí; obliga a
  serializar fechas y a repetir la regla de zona horaria.

**3. Subtítulo de saldos.**
Texto: **"Saldo de cada cuenta con todos sus movimientos. No cambia con el período elegido."**
En `SaldosCuentas`, un `p` `text-detalle text-muted-foreground` justo después del `h2`, en ambos
casos (con y sin cuentas).
- Se descartó "Lo que tiene hoy cada cuenta": el saldo suma todos los movimientos, también los de
  fecha futura (igual que en /cuentas), así que "hoy" no sería exacto.

**4. Documentar la regla del encabezado.** `componentes.md` no tiene sección propia de
`EncabezadoPagina`; la regla "la acción primaria se mantiene en una línea y baja bajo el título si
no cabe" se añade como viñeta en 7.7, junto a la mención existente, sin valores literales.

## Riesgos / Trade-offs

- [El salto de línea no es comprobable en jsdom] → los tests verifican las clases que lo
  permiten; la revisión manual a 360 px y 1280 px (tarea final) confirma el resultado visual.
- [ICU distinto entre Node y navegador] → el texto se genera solo en el servidor y los tests
  fijan la salida exacta.
- [`limitesPeriodo` se llama dos veces por carga] → es aritmética pura; no justifica cambiar la
  firma de `calcularResumen`.

## Plan de migración

Ninguno: sin schema, sin datos, sin dependencias.
