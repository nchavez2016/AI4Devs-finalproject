# Design

## Context

`ContenidoTransacciones` pinta una rejilla `grid-cols-(--columnas-lista-formulario)` con la
sección "Movimientos" (título, `FiltrosMovimientos`, `ListaMovimientos`) y después la tarjeta
del formulario. Bajo el encabezado hay un `div aria-live` vacío que, como hijo del contenedor
`gap-seccion`, añade una segunda separación de 2rem antes del primer bloque. El contenedor de
la página lleva `animate-entrada`, cuyo fotograma `entrada` anima `transform` con `both`
(`globals.css`). En móvil no hay barra de navegación inferior: la navegación es la cabecera
superior con el menú en un Sheet lateral (`fixed`, `z-50`). Los tests de pantalla corren en jsdom, que no aplica Tailwind: el diseño responsive solo se puede
comprobar por clases y por el orden del DOM.

## Goals / Non-Goals

**Goals:** formulario primero en móvil sin duplicar el formulario ni depender de JS para el
diseño; tests existentes intactos salvo el que fija el orden antiguo.

**Non-Goals:** detectar el ancho con `matchMedia`; cambiar cuentas y categorías.

## Decisions

**a. Orden del DOM: formulario primero; colocación en escritorio por rejilla.** El contenedor de
la tarjeta va antes de la sección "Movimientos" y lleva `escritorio:col-start-2
escritorio:row-start-1`; la sección, `escritorio:col-start-1 escritorio:row-start-1`.
Alternativas: `order` de CSS (descartada: el foco no seguiría lo visual en móvil, que es lo que
pide WCAG 2.4.3); pintar dos veces el formulario (descartada: ids duplicados). Consecuencia en
escritorio: el foco va del formulario (derecha) a los movimientos (izquierda). Se acepta: el
orden conserva el significado (primero la tarea principal) y es el mismo que en móvil.

**b. Filtros plegables solo con clases.** `FiltrosMovimientos` guarda `abierto` (empieza en
`false`). El botón "Filtros (n)" lleva `escritorio:hidden`; la región, `hidden escritorio:grid`
cuando está plegada. Así en escritorio siempre se ve, sin `matchMedia` ni desajustes de
hidratación, y los tests actuales siguen encontrando los controles (jsdom no oculta por clase).
No se usa el atributo `hidden`: ocultaría también en escritorio. "Actualizando…" y "Quitar
filtros" pasan a una fila fuera de la región. El número sale de las claves con valor de
`filtros` (desde, hasta, tipo, cuentaId), con un helper `contarFiltrosActivos` en `filtros.ts`
junto a `hayFiltrosActivos`.

**c. Botón fijo con `position: fixed`, no `sticky`.** `componentes.md` 7.1 pide fijo. El botón
se queda dentro del `form` (sigue enviando); su envoltorio lleva `fixed inset-x-ninguno
bottom-ninguno` con fondo `card`, borde superior `border`, relleno `pagina` y
`pb-relleno-barra-inferior`, y `escritorio:static` sin fondo, borde ni rellenos. `sticky` se
descartó: desaparece al bajar a la lista y no da el alcance del pulgar que se busca. Tokens
nuevos en `globals.css` y tokens.md 3.3.4: `--spacing-margen-seguro-inferior:
env(safe-area-inset-bottom, 0px)` y `--spacing-relleno-barra-inferior: calc(var(--spacing-pagina)
+ var(--spacing-margen-seguro-inferior))`. El `main` lleva `pb-reserva-barra-segura` (tercer
token: `reserva-barra-inferior` + margen seguro) y `escritorio:pb-seccion`.

- *Sin `viewport-fit=cover`.* Con el valor por defecto (`auto`) iOS ya limita la página al área
  segura y `env(safe-area-inset-bottom, 0px)` vale 0, así que los tokens no añaden nada; si en el
  futuro se activa `cover`, el botón ya respeta el margen. Activarlo ahora obligaría a gestionar
  márgenes seguros en todo el sitio.
- *Animación de entrada.* Un `transform` (o `filter`) que siga aplicado en un ancestro convierte
  a ese ancestro en el bloque contenedor del `fixed`, y el botón dejaría de quedar pegado a la
  pantalla. Hoy `entrada` termina en `transform: none`, pero con `both` el relleno mantiene el
  efecto de la animación aplicado. Ajuste: `--animate-entrada` pasa de `both` a `backwards`. El
  estado final del fotograma (opacidad 1, sin transform) coincide con el natural, así que nada
  cambia a la vista; durante los 200 ms de entrada el botón sube con la página, lo que es
  aceptable. Se actualiza la fila de `--animate-entrada` en tokens.md 3.3.8. Alternativa
  descartada: sacar el botón del contenedor animado (dejaría de estar dentro del `form` o
  obligaría al atributo `form=`, más frágil).
- *Convivencia con la navegación.* No hay barra inferior de navegación con la que competir. El
  envoltorio lleva `z-10` para quedar sobre las cabeceras de día `sticky` de la lista, que van
  después en el DOM, y por debajo del Sheet del menú (`z-50`), que lo tapa al abrirse.

**d. `scroll-padding-bottom` global por debajo de escritorio.** En `@layer base`,
`html { scroll-padding-bottom: var(--spacing-reserva-barra-inferior) }` y `0` desde
`escritorio`. Solo afecta a desplazamientos hacia un elemento enfocado; en pantallas sin barra
deja 4.75rem extra al hacer scroll al foco, efecto aceptable. Alternativa por página con
`html:has(...)` descartada por complejidad. El test lee `globals.css` como texto (jsdom no
calcula estilos); es el primer test que lo hace.

**e. Cabecera "Hoy".** `ListaMovimientos` recibe `hoy` (AAAA-MM-DD, ya calculado en Ecuador por
`cargarTransacciones`) y antepone "Hoy · " al grupo cuya fecha coincide. Sin "Ayer" (fuera de
alcance).

**f. Hueco bajo el encabezado.** La región `aria-live` pasa a un grupo `flex flex-col
gap-entre-campos` junto a `EncabezadoPagina`; el grupo es un solo hijo del contenedor
`gap-seccion`. La región sigue existiendo vacía desde el primer render (necesario para que se
anuncie). Se deja `EncabezadoPagina` sin tocar.

**g. Cuentas y categorías mantienen la lista primero.** Se registran pocas veces (alta inicial)
y se visitan sobre todo para consultar saldos o nombres; poner el formulario primero empujaría
abajo lo que se busca. La regla de la skill se limita a "pantallas de registro frecuente".

**h. Sin foco automático.** Un `autoFocus` en el monto saltaría el encabezado y la navegación
para lectores de pantalla y abriría el teclado al entrar. Se ajusta componentes.md 7.2 ("recibe
el foco al abrir") para que valga solo para un registro abierto a propósito (Sheet futuro).

## Risks / Trade-offs

- [El test "…en dos columnas" exige hoy los movimientos antes de la tarjeta] → se modifica con
  autorización previa (tasks 0.1).
- [jsdom no verifica el aspecto real] → revisión manual a 360 px y 1280 px, con el teclado
  virtual abierto, en la tarea final.
- [En iOS el teclado puede cubrir el botón fijo] → aceptable: el botón vuelve al cerrar el
  teclado y `scroll-padding-bottom` mantiene visible el campo.
