# Tokens de diseño — Cuadre

Sección 3 del sistema de diseño. Índice completo en [README.md](README.md).

## 3. Tokens de diseño

### 3.1 Reglas

1. **Todo valor de diseño es un token**: colores, familias y pesos tipográficos, tamaños de texto, espaciados, tamaños de elementos, anchos, puntos de corte, radios, anchos de borde y de foco, sombras, duraciones y curvas de movimiento. — Por qué: un valor escrito a mano en un componente es un sitio que un tema futuro no puede alcanzar.
2. **El nombre describe la función, nunca el valor**: `--color-ingreso`, no `--verde`; `--spacing-entre-campos`, no `--spacing-4`; `--radius-control`, no `--radius-sm`. — Por qué: en un tema oscuro el ingreso ya no será el mismo verde, y el nombre debe seguir siendo cierto.
3. **No existe una capa de primitivos con nombre de color.** Varios tokens pueden compartir hoy el mismo valor (por ejemplo, `--color-gasto` y `--color-foreground` son la misma tinta). — Por qué: cada uno puede separarse en otro tema sin tocar el otro.
4. **Solo existen los tokens de Cuadre**: se elimina todo el tema por defecto de Tailwind (paleta, escala numérica de espaciado, tamaños `sm`/`md`, sombras, curvas, animaciones). — Por qué: si `text-green-700` o `p-4` no existen, nadie los puede usar por descuido.
5. **Nombres de shadcn/ui cuando shadcn/ui ya tiene la función** (`primary`, `muted`, `destructive`, `border`, `input`, `ring`, `card`, `popover`) y **nombres en español para las funciones propias de Cuadre** (`ingreso`, `gasto`, `negativo`, `resaltado`). — Por qué: los nombres de shadcn/ui ya describen una función, y conservarlos evita reescribir cada componente instalado.
6. **En los componentes está prohibido**: hexadecimales y valores literales; clases arbitrarias con valores (`p-[13px]`, `text-[#333]`); opacidades sobre colores (`bg-primary/10`); variantes `dark:`; estilos en línea con valores. — Por qué: cada una es una excepción al tema.

### 3.2 Implementación en Tailwind 4 y shadcn/ui

Comprobado sobre Tailwind 4.3.3, la versión instalada:

- **Eliminar el tema por defecto** con `--*: initial` al comienzo del bloque `@theme`. — Por qué: es el mecanismo de Tailwind 4 para dejar solo los tokens propios. Desaparecen la paleta, `--spacing` (y con él todas las clases numéricas como `p-4`, `gap-2` o `inset-0`), los `--text-*`, `--radius-*`, `--shadow-*`, `--ease-*`, `--animate-*` y los puntos de corte `sm`/`md`/`lg`.
- **Tokens con clase de utilidad** (`--color-*`, `--font-*`, `--font-weight-*`, `--text-*`, `--spacing-*`, `--container-*`, `--breakpoint-*`, `--radius-*`, `--shadow-*`, `--ease-*`, `--animate-*` y `--default-*`) → en `@theme static`. — Por qué: `static` emite todas las variables en `:root` aunque no se usen, así que un tema puede redefinir cualquiera de ellas.
- **Tokens sin utilidad propia en Tailwind** (duraciones, separación del foco) → en `:root`, y se usan con la sintaxis de variable de Tailwind: `duration-(--duracion-base)`. — Por qué: Tailwind 4 no tiene espacio de nombres para duraciones; así siguen siendo tokens.
- **Tokens que cambian según el ancho de pantalla** (margen de página, alto de control, títulos) se redefinen en `:root` dentro de `@variant escritorio`. — Por qué: el componente usa una sola clase (`h-alto-control`) sin variantes `escritorio:`, y el punto de corte se escribe una sola vez.
- **shadcn/ui**: su comando de inicio escribe en `globals.css` sus propias variables (`--background`, `--primary`, … en `:root`, un bloque `.dark`, `--radius` y derivados, `--sidebar-*`, `--chart-2` a `--chart-5`). Se sustituyen por el catálogo 3.3 y se borran los sobrantes. — Por qué: de lo contrario convivirían dos fuentes de verdad.
- **Componentes de shadcn/ui**: su código se copia en el proyecto. Al instalar cada uno, sus clases con valores por defecto (`h-9`, `px-4`, `text-sm`, `rounded-md`, `shadow-xs`, `sm:`, `focus-visible:ring-[3px]`) se cambian por las clases de tokens (`h-alto-control`, `px-control-x`, `text-cuerpo`, `rounded-control`, sombra solo con los tokens `shadow-tarjeta` o `shadow-flotante`, `escritorio:`, foco global). — Por qué: con el tema por defecto eliminado, esas clases no generan CSS y el componente se vería roto.
- **Riesgo: Tailwind no avisa cuando una clase no existe; simplemente no genera CSS.** Con el tema por defecto eliminado, una clase como `p-4` o `text-green-700` no rompe el build ni el tipado: el elemento se queda sin ese estilo y el fallo pasa desapercibido en revisión visual. Por eso no queda como punto de la checklist manual (checklist.md, sección 10), sino como una **comprobación automática obligatoria del hook `pre-commit`**, que se implementa en el change que construye este sistema de diseño (junto a los pasos de lint, typecheck y tests ya definidos en el proyecto). No basta con mirar los atributos `class`/`className`: los componentes de shadcn/ui arman sus clases con `cva(...)` y `cn(...)`, como cadenas de texto sueltas fuera de cualquier atributo, y quedarían sin revisar. Por eso la comprobación recorre **todas las cadenas de texto** (literales y de plantilla) de los archivos en stage bajo `src/**/*.{ts,tsx}`, más las reglas `@apply` de los archivos `.css` en stage, y bloquea el commit si alguna contiene, como palabra suelta dentro de la cadena, alguno de estos patrones:
  - **Escala numérica del tema por defecto**: una utilidad de espaciado, tamaño o posición seguida de un número de la escala de Tailwind sin que sea uno de los tokens de 3.3.3–3.3.4 (por ejemplo `p-4`, `gap-2`, `w-96`, `h-9`, `-mt-2`, `inset-0`, `top-1/2`). Como el proyecto elimina `--spacing`, ninguna de estas clases genera CSS.
  - **Tamaños y sombras por defecto**: `text-xs` a `text-9xl`, `rounded-none`/`-sm`/`-md`/`-lg`/`-xl`/`-2xl`/`-3xl`/`-full`, `shadow-none`/`-sm`/`-md`/`-lg`/`-xl`/`-2xl`/`-inner`, `blur-*`, `ease-linear`/`-in`/`-out`/`-in-out`, `duration-<número>` sin la sintaxis de variable (ver más abajo la excepción).
  - **Paleta por defecto de Tailwind**: cualquier utilidad de color con el nombre de una familia de la paleta eliminada (`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `mauve`, `olive`, `mist`, `taupe`) en cualquier prefijo (`bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`, `from-`, `via-`, `to-`, `decoration-`, `outline-`, `divide-`, `placeholder-`, `caret-`, `accent-`), así como `bg-white`, `bg-black`, `text-white`, `text-black`, `border-white`, `border-black`.
  - **Puntos de corte por defecto**: los prefijos `sm:`, `md:`, `lg:`, `xl:`, `2xl:` (los tokens propios son `escritorio:` y `amplio:`).
  - **Clases arbitrarias con un valor literal**: cualquier utilidad seguida de `[...]` con un valor concreto (`p-[13px]`, `text-[#333]`, `bg-[rgb(0,0,0)]`, `w-[240px]`). Se exceptúa la sintaxis de variable de tema, `utilidad-(--token)` (por ejemplo `duration-(--duracion-base)`), que sí está permitida porque referencia un token.
  - **Opacidad sobre un color con `/`**: cualquier utilidad de color de shadcn/ui o de Cuadre seguida de una fracción de opacidad (`bg-primary/10`, `text-foreground/50`, `border-input/20`). Un tono translúcido no tiene un ratio de contraste calculable.
  - **Variante `dark:`**: cualquier clase con el prefijo `dark:`. El tema oscuro se activa por atributo (`data-tema="oscuro"`, sección 3.5), nunca por esta variante de Tailwind.
  El mensaje de error del hook cita el archivo, la línea y la clase encontrada, y remite a la sección 3.3 de este documento para sustituirla por un token. El `design.md` del change que implemente esta comprobación define la expresión exacta (o el paquete, si se decide usar uno ya aprobado) y queda sujeto a las mismas reglas de dependencias de AGENTS.md.
- **Falsos positivos:** al revisar todas las cadenas de texto (no solo `class`/`className`), la comprobación puede señalar por error un texto que no es una clase de Tailwind (por ejemplo, un contenido traducible o un identificador que casualmente coincide con un patrón). Cuando esto ocurra, se corrige ajustando la expresión de detección en el change que la implementa o la mantiene, para que distinga ese caso; nunca se resuelve desactivando la comprobación, ni en ese archivo ni en el hook completo. — Por qué: desactivarla, aunque sea puntualmente, reabre el riesgo de que una clase del tema por defecto pase sin avisar.
- Al implementar se elimina el bloque `@media (prefers-color-scheme: dark)` que trae hoy `src/app/globals.css` y se declara `color-scheme: light`. — Por qué: sin un tema oscuro completo, ese bloque produciría una interfaz mitad oscura y sin contraste verificado.

### 3.3 Catálogo completo de tokens

Los valores con "→" cambian en el punto de corte `escritorio` (y `amplio` si se indica).

#### 3.3.1 Color (`@theme static`)

| Token | Valor | Uso |
|---|---|---|
| `--color-background` | `#FAF8F4` | Fondo de página: papel cálido. |
| `--color-foreground` | `#1E1C18` | Texto principal (tinta). |
| `--color-card` | `#FFFFFF` | Tarjetas y fondo de campos. |
| `--color-card-foreground` | `#1E1C18` | Texto sobre tarjetas. |
| `--color-popover` | `#FFFFFF` | Menús, selectores, diálogos, panel inferior. |
| `--color-popover-foreground` | `#1E1C18` | Texto sobre capas flotantes. |
| `--color-primary` | `#1F4D78` | Único color de acción: botón primario, enlaces, controles activos. |
| `--color-primary-foreground` | `#FFFFFF` | Texto sobre el primario. |
| `--color-primary-hover` | `#173B5C` | Hover y pulsado del primario. |
| `--color-secondary` | `#FFFFFF` | Fondo del botón secundario. |
| `--color-secondary-foreground` | `#1E1C18` | Texto del botón secundario. |
| `--color-muted` | `#F1EDE4` | Zonas atenuadas, hover de filas, fondo de controles segmentados, esqueletos. |
| `--color-muted-foreground` | `#5C574E` | Texto secundario, cabeceras de columna, metadatos, ayuda. |
| `--color-accent` | `#F1EDE4` | Hover de opciones en menús y selectores. |
| `--color-accent-foreground` | `#1E1C18` | Texto de la opción en hover. |
| `--color-destructive` | `#B0271B` | Botón destructivo, texto y borde de error. |
| `--color-destructive-foreground` | `#FFFFFF` | Texto sobre el destructivo (shadcn/ui v4 ya no lo define). |
| `--color-destructive-hover` | `#8F1F15` | Hover y pulsado del destructivo. |
| `--color-border` | `#E2DCD0` | Renglones, separadores y borde de tarjeta (decorativos). |
| `--color-input` | `#8C8577` | Borde de campos, controles segmentados y botón secundario. |
| `--color-ring` | `#1F4D78` | Anillo de foco. |
| `--color-chart-1` | `#5C574E` | Barras del gráfico de categorías de gasto. |
| `--color-ingreso` | `#1E6B3C` | Importe de ingreso y su signo "+". |
| `--color-ingreso-fondo` | `#E6F0E8` | Segmento "Ingreso" seleccionado. |
| `--color-gasto` | `#1E1C18` | Importe de gasto y su signo "−". |
| `--color-negativo` | `#B0271B` | Saldo o balance por debajo de cero. |
| `--color-negativo-fondo` | `#F8E6E3` | Fondo del aviso de error de sección o formulario. |
| `--color-resaltado` | `#FFF1BF` | Fila recién creada o editada: marcador fluorescente sobre el libro. |
| `--color-velo` | `rgb(30 28 24 / 0.40)` | Capa detrás de diálogos y panel inferior. |
| `--color-icono` | `#1F4D78` | Icono dentro de su contenedor (7.3 de componentes.md). |
| `--color-icono-fondo` | `#E3ECF4` | Fondo del contenedor de icono: tono claro de la marca. |

Ningún valor es un color de la paleta por defecto de Tailwind o de shadcn/ui. `--color-chart-2` a
`--color-chart-5` y `--color-sidebar-*` no existen en el MVP.

#### 3.3.2 Tipografía (`@theme static`)

| Token | Valor | Uso |
|---|---|---|
| `--font-interfaz` | IBM Plex Sans (cargada con `next/font`); respaldo `system-ui, sans-serif` | Interfaz, texto e **importes**. |
| `--font-titulo` | Source Serif 4 (cargada con `next/font`); respaldo `Georgia, serif` | Títulos de página y de sección. |
| `--default-font-family` | `var(--font-interfaz)` | Fuente del documento. |
| `--default-font-feature-settings` | `"tnum", "lnum"` | Cifras tabulares y de caja alta en toda la app. |
| `--font-weight-lectura` | `400` | Texto corrido y metadatos. |
| `--font-weight-control` | `500` | Etiquetas, botones, importes de fila, categoría en la fila. |
| `--font-weight-enfasis` | `600` | Títulos, totales, importe principal, opción seleccionada. |

Escala tipográfica. Cada `--text-*` define tamaño, `--text-*--line-height` y `--text-*--font-weight`
(este último apunta a un token de peso).

| Token | Tamaño | Interlineado | Peso | Uso |
|---|---|---|---|---|
| `--text-titulo-pagina` | 1.75rem → 2rem | 2.125rem → 2.375rem | enfasis | Un `h1` por pantalla (en `--font-titulo`). |
| `--text-titulo-seccion` | 1.25rem | 1.75rem | enfasis | `h2`: "Saldo por cuenta", "Movimientos" (en `--font-titulo`). |
| `--text-importe-principal` | 2rem → 2.5rem | 2.375rem → 2.875rem | enfasis | Balance del período en el dashboard. |
| `--text-importe-campo` | 1.75rem | 2.25rem | control | Campo de monto en el registro. |
| `--text-importe-resumen` | 1.25rem | 1.75rem | enfasis | Totales de ingresos y gastos, saldo de cada cuenta. |
| `--text-cuerpo` | 1rem | 1.5rem | lectura | Texto general, valores de campos, botones, importe en filas. |
| `--text-detalle` | 0.875rem | 1.25rem | lectura | Metadatos de fila, ayuda y error de campo. |
| `--text-etiqueta` | 0.875rem | 1.25rem | control | Etiquetas de campo y cabeceras de tabla. |
| `--text-grupo` | 0.8125rem | 1.25rem | enfasis | Cabecera de día en la lista ("Hoy · lun, 28 sept"). |

#### 3.3.3 Espaciado (`@theme static`, espacio de nombres `--spacing-*`)

| Token | Valor | Uso |
|---|---|---|
| `--spacing-ninguno` | `0` | Anular un espacio o posicionar a cero (`p-ninguno`, `inset-ninguno`); sustituye a `0`, que ya no existe sin `--spacing`. |
| `--spacing-pagina` | 1rem → 1.5rem → 2rem (`amplio`) | Margen lateral de página. |
| `--spacing-seccion` | 2rem | Separación entre secciones de una pantalla. |
| `--spacing-tarjeta` | 1rem → 1.25rem | Relleno interno de tarjeta. |
| `--spacing-entre-campos` | 1rem | Separación entre campos de un formulario. |
| `--spacing-etiqueta` | 0.375rem | Entre la etiqueta y su campo. |
| `--spacing-mensaje` | 0.25rem | Entre el campo y su ayuda o error. |
| `--spacing-control-x` | 1rem | Relleno horizontal de botones. |
| `--spacing-campo-x` | 0.75rem | Relleno horizontal de campos. |
| `--spacing-icono-texto` | 0.5rem | Entre un icono y su texto. |
| `--spacing-acciones` | 0.75rem | Entre botones de un grupo de acciones. |
| `--spacing-fila-x` | 1rem | Relleno horizontal de filas y sangría de sus separadores. |
| `--spacing-fila-y` | 0.5rem | Relleno vertical de filas y cabeceras de día. |
| `--spacing-opcion-x` | 0.75rem | Relleno horizontal de opciones de menú. |
| `--spacing-opcion-y` | 0.5rem | Relleno vertical de opciones de menú. |

#### 3.3.4 Tamaños y anchos (`@theme static`)

| Token | Valor | Uso |
|---|---|---|
| `--spacing-alto-control` | 2.75rem → 2.5rem | Alto de botones y controles segmentados. |
| `--spacing-alto-campo` | 3rem → 2.5rem | Alto de campos de formulario. |
| `--spacing-alto-fila` | 3.5rem | Alto mínimo de fila en la lista móvil. |
| `--spacing-alto-fila-tabla` | 2.75rem | Alto de fila en la tabla de escritorio. |
| `--spacing-objetivo-tactil` | 2.75rem | Área mínima de botones solo con icono. |
| `--spacing-icono` | 1.25rem | Iconos en botones, campos y filas. |
| `--spacing-icono-detalle` | 1rem | Iconos junto a `--text-detalle` (mensajes de error). |
| `--spacing-reserva-barra-inferior` | 4.75rem | Espacio reservado bajo el contenido y `scroll-padding-bottom` cuando hay barra fija inferior (alto de control + 2 × margen de página). |
| `--spacing-contenedor-icono` | 2.5rem | Lado del contenedor de icono. |
| `--spacing-alto-cabecera` | 3.5rem → 4rem | Alto de la cabecera de la app. |
| `--container-formulario` | 30rem | Ancho máximo de formulario. |
| `--container-dialogo` | 30rem | Ancho máximo de diálogo. |
| `--container-contenido` | 65rem | Ancho máximo del contenido de página. |

#### 3.3.5 Puntos de corte (`@theme static`)

| Token | Valor | Uso |
|---|---|---|
| `--breakpoint-escritorio` | 48rem (768 px) | Variante `escritorio:`; la lista pasa a tabla y cambian los tokens marcados con "→". |
| `--breakpoint-amplio` | 64rem (1024 px) | Variante `amplio:`; solo cambia `--spacing-pagina`. |

#### 3.3.6 Radios, bordes y foco

| Token | Dónde | Valor | Uso |
|---|---|---|---|
| `--radius-control` | `@theme static` | 0.25rem | Botones, campos, controles segmentados. |
| `--radius-superficie` | `@theme static` | 0.375rem | Tarjetas, diálogos, menús; esquinas superiores del panel inferior. |
| `--radius-contenedor-icono` | `@theme static` | 0.5rem | Contenedor redondeado de un icono (nunca un círculo completo). |
| `--default-border-width` | `@theme static` | 1px | Único ancho de borde del sistema (clase `border`). |
| `--default-outline-width` | `@theme static` | 2px | Ancho del anillo de foco. |
| `--foco-separacion` | `:root` | 2px | Separación entre el elemento y su anillo de foco. |

#### 3.3.7 Elevación (`@theme static`)

| Token | Valor | Uso |
|---|---|---|
| `--shadow-flotante` | `0 8px 24px rgb(30 28 24 / 0.16)` | Capas flotantes: menús, selectores, diálogos, panel inferior. |
| `--shadow-tarjeta` | `0 1px 2px rgb(30 28 24 / 0.06), 0 2px 8px rgb(30 28 24 / 0.06)` | Tarjeta en reposo: elevación suave, sin resplandor. |
| `--shadow-tarjeta-hover` | `0 2px 4px rgb(30 28 24 / 0.08), 0 6px 16px rgb(30 28 24 / 0.10)` | Tarjeta clicable en hover o con el foco encima. |

Las sombras de tarjeta se tiñen con la tinta (`30 28 24`), nunca con un color de marca. — Por qué: una sombra de color es un resplandor, que sigue prohibido.

#### 3.3.7b Degradado de marca y composición (`:root`)

| Token | Valor | Uso |
|---|---|---|
| `--degradado-marca` | `linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))` | Único degradado: de `primary` a `primary-hover`, monocromo. Se usa con `bg-(image:--degradado-marca)` en la marca de la cabecera y el distintivo de login y registro. |
| `--columnas-lista-formulario` | `minmax(0, 1fr)` → `minmax(0, 1fr) minmax(0, var(--container-formulario))` | Columnas de las pantallas con lista y formulario; una en móvil y dos desde `escritorio`. Se usa con `grid-cols-(--columnas-lista-formulario)`. |

#### 3.3.8 Movimiento

| Token | Dónde | Valor | Uso |
|---|---|---|---|
| `--duracion-rapida` | `:root` | 100ms | Hover, pulsado, cambios de color. |
| `--duracion-base` | `:root` | 160ms | Apertura de menús y selectores. |
| `--duracion-panel` | `:root` | 220ms | Diálogo y panel inferior. |
| `--duracion-resaltado` | `:root` | 600ms | Tiempo que la fila nueva mantiene el resaltado fijo. |
| `--duracion-resaltado-salida` | `:root` | 1000ms | Desvanecimiento del resaltado. |
| `--duracion-giro` | `:root` | 800ms | Una vuelta del indicador de carga. |
| `--duracion-espera-esqueleto` | `:root` | 400ms | Espera antes de mostrar el esqueleto de carga, para no parpadear en cargas rápidas (estados.md 9.2). |
| `--duracion-entrada` | `:root` | 200ms | Entrada de la página (una vez, en el contenedor principal). |
| `--desplazamiento-entrada` | `:root` | 0.25rem | Distancia que sube el contenido al entrar. |
| `--ease-entrada` | `@theme static` | `cubic-bezier(0.2, 0, 0, 1)` | Lo que aparece: arranca rápido y frena al llegar. |
| `--ease-salida` | `@theme static` | `cubic-bezier(0.4, 0, 1, 1)` | Lo que desaparece: se va sin frenar. |
| `--default-transition-duration` | `@theme static` | `var(--duracion-rapida)` | Duración de cualquier `transition-*` sin duración explícita. |
| `--default-transition-timing-function` | `@theme static` | `var(--ease-entrada)` | Curva de cualquier `transition-*` sin curva explícita. |
| `--animate-giro` | `@theme static` | fotograma `giro` (rotación 360°), `var(--duracion-giro)`, lineal, infinito | Indicador de carga en botones. |
| `--animate-resaltado` | `@theme static` | fotograma `resaltado` (de `--color-resaltado` a transparente), `var(--duracion-resaltado-salida)`, `var(--ease-salida)`, retardo `var(--duracion-resaltado)` | Fila recién guardada. |
| `--animate-esqueleto` | `@theme static` | fotograma `esqueleto` (opacidad de 0 a 1), duración 0ms, retardo `var(--duracion-espera-esqueleto)`, `both` | Aparición del esqueleto de carga tras la espera. Sin pulso ni brillo. |
| `--animate-entrada` | `@theme static` | fotograma `entrada` (opacidad de 0 a 1 y subida de `--desplazamiento-entrada`), `var(--duracion-entrada)`, `var(--ease-entrada)`, `both` | Entrada breve del contenedor de la página. Con movimiento reducido vale `none`. |

Con `prefers-reduced-motion: reduce` solo cambian valores de estos tokens (movimiento.md, sección 6).

### 3.4 Contraste calculado

Método: luminancia relativa y ratio de WCAG 2.2, `(L1 + 0,05) / (L2 + 0,05)`, calculados con un
script sobre los valores de 3.3.1, no estimados. Los ratios se **truncan** a dos decimales para no
redondear nunca hacia arriba. Umbrales: texto 4,5:1 (se exige también en texto grande); componentes
de interfaz y foco 3:1. La tabla está escrita por tokens: es la plantilla que hay que repetir en
cada tema nuevo.

**Texto sobre fondo**

| Texto | Fondo | Ratio | Mínimo | Resultado |
|---|---|---|---|---|
| `foreground`, `gasto` | `background` | 16,03 | 4,5 | Cumple |
| `foreground`, `gasto`, `card-foreground`, `popover-foreground`, `secondary-foreground` | `card`, `popover`, `secondary` | 17,01 | 4,5 | Cumple |
| `foreground`, `gasto`, `accent-foreground` | `muted`, `accent` | 14,55 | 4,5 | Cumple |
| `foreground`, `gasto` | `resaltado` | 15,05 | 4,5 | Cumple |
| `foreground` | `ingreso-fondo` | 14,57 | 4,5 | Cumple |
| `foreground` | `negativo-fondo` | 14,11 | 4,5 | Cumple |
| `muted-foreground` | `background` | 6,76 | 4,5 | Cumple |
| `muted-foreground` | `card` | 7,17 | 4,5 | Cumple |
| `muted-foreground` | `muted` | 6,13 | 4,5 | Cumple |
| `muted-foreground` | `resaltado` | 6,34 | 4,5 | Cumple |
| `primary` (enlace, terciario) | `background` | 8,28 | 4,5 | Cumple |
| `primary` | `card` | 8,78 | 4,5 | Cumple |
| `primary` | `muted` | 7,51 | 4,5 | Cumple |
| `primary` | `resaltado` | 7,77 | 4,5 | Cumple |
| `primary-foreground` | `primary` | 8,78 | 4,5 | Cumple |
| `primary-foreground` | `primary-hover` | 11,56 | 4,5 | Cumple |
| `ingreso` | `background` | 6,14 | 4,5 | Cumple |
| `ingreso` | `card` | 6,51 | 4,5 | Cumple |
| `ingreso` | `muted` | 5,57 | 4,5 | Cumple |
| `ingreso` | `ingreso-fondo` | 5,58 | 4,5 | Cumple |
| `ingreso` | `resaltado` | 5,76 | 4,5 | Cumple |
| `destructive`, `negativo` | `background` | 6,28 | 4,5 | Cumple |
| `destructive`, `negativo` | `card` | 6,66 | 4,5 | Cumple |
| `destructive`, `negativo` | `muted` | 5,70 | 4,5 | Cumple |
| `destructive`, `negativo` | `negativo-fondo` | 5,52 | 4,5 | Cumple |
| `destructive`, `negativo` | `resaltado` | 5,89 | 4,5 | Cumple |
| `destructive-foreground` | `destructive` | 6,66 | 4,5 | Cumple |
| `destructive-foreground` | `destructive-hover` | 8,84 | 4,5 | Cumple |
| `icono` | `icono-fondo` | 7,34 | 4,5 | Cumple |
| `foreground` | `icono-fondo` | 14,23 | 4,5 | Cumple |
| `primary-foreground` | `primary` (inicio del degradado de marca) | 8,78 | 4,5 | Cumple |
| `primary-foreground` | `primary-hover` (final del degradado de marca) | 11,56 | 4,5 | Cumple |

**Componentes de interfaz y foco**

| Elemento | Contra | Ratio | Mínimo | Resultado |
|---|---|---|---|---|
| `input` | `background` | 3,45 | 3 | Cumple |
| `input` | `card` | 3,66 | 3 | Cumple |
| `input` | `muted` | 3,13 | 3 | Cumple |
| `ring` | `background` | 8,28 | 3 | Cumple |
| `ring` | `card` | 8,78 | 3 | Cumple |
| `chart-1` | `card` | 7,17 | 3 | Cumple |

**Pares que no alcanzan el mínimo, y por qué está permitido**

| Par | Ratio | Por qué no se exige |
|---|---|---|
| `border` / `background` | 1,28 | Los renglones son decorativos: los campos se identifican por `--color-input` y las tarjetas por su contenido. |
| `border` / `card` | 1,36 | Igual que el anterior. |
| `card` / `background` | 1,06 | La tarjeta lleva además un borde `--color-border`; su límite no transmite información. |
| `muted` / `background` (hover de fila) | 1,10 | El hover es un refuerzo; el foco de teclado usa `--color-ring` (8,28). |
| `icono-fondo` / `card` | 1,19 | El contenedor es decorativo: el icono que contiene (7,34 sobre `icono-fondo`) siempre acompaña a un texto y no transmite información por sí solo. |
| `icono-fondo` / `background` | 1,12 | Igual que el anterior. |

El degradado de marca es un fondo detrás de un texto o un icono blanco: se mide en sus dos extremos (arriba) y el punto medio queda entre ambos (10,14), porque la luminancia entre dos extremos es monótona.

Colores de las propuestas medidos con el mismo método: blanco sobre esmeralda `#10B981` 2,53;
blanco sobre cian `#06B6D4` 2,42; `#E2E8F0` sobre blanco 1,23; `#E7E5E4` sobre blanco 1,25.

Estados deshabilitados: WCAG los exime, pero usan `muted-foreground` sobre `muted` (6,13) para que se
sigan leyendo.

### 3.5 Temas y variantes futuras

Un tema oscuro o una variante de marca es **un bloque que redefine valores de tokens** y nada más:

- Se activan con un atributo en `<html>`: `data-tema="oscuro"` o `data-marca="<nombre>"`. Dentro de ese selector se redefinen las variables de 3.3 que cambien. — Por qué: las utilidades de Tailwind leen `var(--color-…)`, así que el cambio se propaga solo.
- Un tema puede cambiar cualquier token, no solo los colores: una marca puede tener otra `--font-titulo`, otros `--radius-*` u otra `--shadow-flotante`. — Por qué: el requisito cubre toda variante, no solo la de color.
- Cada tema nuevo repite completa la tabla 3.4 con sus valores, y no se publica si un par no cumple. — Por qué: los pares están escritos por token, así que la verificación es mecánica.
- En oscuro, `--shadow-flotante` apenas se ve: el tema la sustituye por un valor que funcione (por ejemplo, un borde claro simulado con sombra). — Por qué: la elevación sigue siendo el mismo token, solo cambia su valor.
- Criterio de aceptación de cualquier tema: el cambio **no modifica ningún archivo** de `src/components/` ni de `src/app/` salvo `globals.css` (y el atributo en el layout). — Por qué: es la prueba de que el sistema cumple el requisito.
