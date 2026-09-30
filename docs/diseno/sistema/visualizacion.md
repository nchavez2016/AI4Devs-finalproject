# Visualización de datos — Cuadre

Sección 8 del sistema de diseño. Índice completo en [README.md](README.md).

## 8. Visualización de datos

### 8.1 Qué exige el MVP

Revisión de readme.md (HU-003 y sección 4, especificación de la API):

| Elemento del dashboard | Cómo se muestra | Historia de usuario |
|---|---|---|
| Saldo actual, ingresos y gastos del período, balance | Cifras (`importe-principal` / `importe-resumen`), no un gráfico | HU-003, escenario "Ver totales del período" |
| Saldo por cuenta | Lista o tabla (componentes.md, 7.4), no un gráfico | HU-003, escenario "Ver saldo por cuenta" |
| Categorías de gasto ordenadas de mayor a menor | **Un gráfico de barras horizontales** | HU-003, escenario "Ver principales categorías de gasto" |

El MVP define **un solo gráfico**: las categorías de gasto del período (`topCategoriasGasto` en la
sección 4 del readme, ya devuelto ordenado de mayor a menor). Ninguna historia ni criterio de
aceptación pide comparar períodos, mostrar una tendencia o proyectar un valor futuro — de hecho, en
decisiones.md, sección 1, ya se descartaron sparklines, gráficos de proyección y contadores animados
por chocar con el alcance del MVP (presupuestos y proyecciones están fuera de alcance según AGENTS.md).
**Este documento no añade, por tanto, ningún gráfico de comparación entre períodos ni ningún otro
tipo de gráfico: solo el de categorías de gasto.**

### 8.2 Criterio y límite de gráficos

- **Cada gráfico responde a una única pregunta concreta del usuario**, formulable en una frase ("¿en qué categoría gasto más?"). Si una idea de gráfico no puede formularse así, no se construye. — Por qué: es el mismo criterio que en decisiones.md, sección 1, separa una lectura útil de una decoración.
- **Máximo un gráfico en el dashboard del MVP.** — Por qué: es el único que exige una historia de usuario (8.1); el resto de la información se lee más rápido como cifra (totales) o como lista (saldo por cuenta), y un gráfico por dato que no lo necesita convertiría el dashboard en un panel de BI en lugar del vistazo rápido que pide el brief.
- **Si un change futuro justifica un segundo gráfico** (con su propia historia de usuario y criterio de aceptación), el límite pasa a dos como máximo en el dashboard. — Por qué: con dos preguntas distintas conviviendo en una pantalla de uso diario, un tercer gráfico empieza a competir por la atención que el brief reserva para el registro y la lectura rápida.

### 8.3 Tipo de gráfico según la pregunta

| Pregunta | Tipo de gráfico | Por qué |
|---|---|---|
| "¿En qué categorías gasto más?" (comparar magnitudes entre categorías) | **Barras horizontales, ordenadas de mayor a menor** | Dejan sitio para el nombre completo de la categoría a la izquierda, coinciden con la lectura de izquierda a derecha del importe, y el orden ya lo entrega la API — no hace falta una leyenda de color para saber cuál es cuál. |

**El gráfico circular (o de anillo) no se usa nunca en este sistema.** Razones:
1. Comparar el tamaño de dos porciones circulares es una tarea visual más difícil que comparar dos longitudes de barra; con más de cuatro o cinco categorías —el caso normal de un negocio— se vuelve ilegible.
2. Dependería del color para diferenciar cada porción, lo que choca con que el color siempre tiene un significado fijo en este sistema (tokens.md, 3.1) y multiplicaría los pares que verificar en la tabla 3.4 de tokens.md cada vez que cambia el número de categorías.
3. Sin un valor visible en cada porción no se puede leer la cifra exacta, y este sistema no aproxima importes de dinero (componentes.md, 7.5).

Si en el futuro apareciera una pregunta genuina de "parte de un todo" (por ejemplo, "¿qué porcentaje
de mis gastos es cada categoría?"), se resuelve con las mismas barras horizontales mostrando el
porcentaje en la etiqueta, no con un gráfico circular.

### 8.4 Tokens de gráfico y contraste

| Token | Valor | Uso |
|---|---|---|
| `--color-chart-1` | `#5C574E` (= `muted-foreground`) | Único color de las barras: todas las categorías comparten el mismo tono, porque el color no distingue nada — el nombre de la categoría (a la izquierda) y la longitud de la barra ya lo hacen. |

Contraste (ya calculado en la tabla 3.4 de tokens.md, reutilizado aquí): `chart-1` sobre `card`
**7,17:1** y sobre `background` **6,76:1** — ambos cumplen 4,5:1 aunque el color se use como relleno y
no como texto, porque además lleva junto a la barra la etiqueta de valor en `foreground` (17,01:1 y
16,03:1).

El MVP tiene una sola serie (el importe de gasto por categoría), así que no hace falta un segundo
`--color-chart-*`. **Si un change futuro añade una segunda serie a un gráfico** (por ejemplo, dos
períodos superpuestos), se cumplen dos reglas: (1) se da de alta `--color-chart-2` en tokens.md,
3.3.1, con su ratio calculado en la tabla 3.4 de tokens.md igual que cualquier otro color, y (2) las
dos series se distinguen además del color por una segunda señal — posición (barras agrupadas, no
apiladas por color), un patrón (una trama en una de las dos) o una etiqueta directa en cada barra —
nunca solo por el tono. — Por qué: es la misma regla que ya separa ingreso de gasto por signo además
de color (tokens.md, 3.1); aplicarla aquí evita un gráfico que solo se lea distinguiendo un tono de
otro.

### 8.5 Etiquetas, ejes y qué se prohíbe

- **Etiqueta directa de valor** al final de cada barra, con el mismo formato que el componente Importe (componentes.md, 7.5): dos decimales, separador de miles `es-EC`, cifras tabulares. Al ser un total con su propia etiqueta (el nombre de la categoría), usa el caso "Totales con etiqueta" de la tabla de 7.5: sin signo y en `foreground`, no en `chart-1`. — Por qué: es un total de gasto, no un movimiento individual; no necesita el signo "−" porque el título de la sección ("Categorías de gasto") ya dice qué es.
- **El eje de valores arranca siempre en cero** — la longitud de la barra es proporcional al importe sin truncar el eje — aunque no se dibujan ni sus marcas ni líneas de cuadrícula, porque el valor exacto ya está en la etiqueta directa. Una única línea base en `border` marca el cero. — Por qué: truncar un eje para exagerar la diferencia entre categorías falsea la lectura, y es justo el tipo de manipulación visual que un sistema honesto con datos de dinero no puede permitirse.
- El eje de categorías (vertical) muestra el nombre completo de cada una en `detalle` y `muted-foreground`, sin abreviar; si no cabe, se trunca con `…` y el nombre completo queda disponible en la tabla accesible (8.7). — Por qué: mismo criterio que las listas de movimientos (componentes.md, 7.4).
- **Prohibido en cualquier gráfico de este sistema:** efectos 3D o de perspectiva, degradados de color, sombras proyectadas por las barras o los sectores, y cualquier animación de entrada (barras que "crecen", que se dibujan con `stroke-dashoffset` o que aparecen con retardo escalonado). — Por qué: son exactamente los rasgos descartados en decisiones.md, sección 1 (Concepto 1 y Concepto 3) por decorativos y por falsear la lectura de un dato financiero.
- Sin leyenda (`Legend`) en un gráfico de una sola serie. — Por qué: no hay nada que la leyenda explique que el propio eje de categorías no diga ya.

### 8.6 Estados vacío, carga y error de un gráfico

El gráfico vive dentro de una tarjeta (componentes.md, 7.3) que agrupa la sección "Categorías de
gasto", y sigue el mismo patrón que cualquier sección que carga sus propios datos (estados.md, 9.2 y
9.3):

- **Vacío:** si el usuario tiene movimientos pero ningún gasto en el período (por ejemplo, solo ingresos), la tarjeta no dibuja ejes ni una barra vacía: muestra el texto "No hay gastos registrados en este período." en `muted-foreground`, sin gráfico. Es un caso distinto del vacío general del dashboard (estados.md, 9.1, HU-003 "Dashboard sin datos"), que cubre a un usuario sin ningún movimiento. — Por qué: un eje sin barras se lee como un error, no como "cero gastos".
- **Carga:** esqueleto estático (estados.md, 9.2) con la forma exacta del gráfico — una franja por cada fila esperada, en `muted`, de ancho variable para no parecer una tabla — sin brillo ni pulso, con `aria-busy="true"` en la tarjeta. — Por qué: mismo criterio que cualquier otra sección con datos propios.
- **Error:** si la carga falla, la tarjeta reemplaza el gráfico por el mensaje y el "Reintentar" de una sección (estados.md, 9.3); el resto del dashboard (totales, saldo por cuenta) sigue funcionando aunque este gráfico haya fallado. — Por qué: un gráfico es una sección más, no debe bloquear el resto de la pantalla.

### 8.7 Accesibilidad

- El gráfico (el SVG) lleva `role="img"` y un `aria-label` que resume la lectura ("Categorías de gasto de mayor a menor, de $400,00 a $50,00"), para que un lector de pantalla no intente leer cada elemento gráfico interno. — Por qué: un SVG generado por una librería de gráficos no es, por sí mismo, accesible.
- Junto al gráfico, visualmente oculta con la utilidad `sr-only` (una utilidad de accesibilidad de Tailwind sin valor de tema: no la alcanza la eliminación de tokens.md, 3.2), va **una tabla real** con dos columnas, Categoría e Importe, con los mismos datos exactos que las barras. — Por qué: es la alternativa textual que exige el brief, y una tabla permite a quien usa lector de pantalla recorrer y comparar los valores, algo que un `aria-label` único no ofrece.
- Un botón terciario "Ver como tabla" (componentes.md, 7.1) alterna la tabla a visible para cualquier persona, no solo para quien usa lector de pantalla — por ejemplo, alguien con dificultad motriz que prefiere navegar filas con teclado a interpretar longitudes de barra. — Por qué: la alternativa textual no debe reservarse a un único perfil de usuario.
- **No hace falta un tooltip que solo responda al hover:** cada barra ya lleva su valor exacto como etiqueta directa y permanente (8.5), visible igual con ratón, teclado o táctil. Si un gráfico futuro necesitara un detalle que no cabe en la etiqueta directa, su disparador debe responder tanto a `onClick`/`onFocus` como a `onMouseEnter`, y el detalle debe poder cerrarse con la tecla Escape. — Por qué: un detalle que solo aparece al pasar el ratón no existe para quien usa el dashboard desde el móvil, el contexto de uso prioritario del brief.

### 8.8 Adaptación a móvil

- Las barras horizontales ya son, por su propia forma, el diseño "móvil primero" para comparar categorías: se apilan verticalmente y no necesitan ancho de pantalla para leerse, a diferencia de una barra vertical o una disposición en cuadrícula. — Por qué: no hace falta reestructurar nada entre móvil y escritorio, solo el ancho de la tarjeta que lo contiene.
- La tarjeta ocupa el ancho disponible (componentes.md, 7.3) tanto en móvil como en escritorio; no hay una versión "resumida" del gráfico para pantallas pequeñas. — Por qué: son pocas categorías (las que `topCategoriasGasto` ya limita en el backend) y todas caben sin necesidad de recortar la lista en el cliente.
- El nombre de categoría y su etiqueta de valor comparten la misma fila; en un ancho muy estrecho, el nombre se trunca con `…` antes que el valor, nunca al revés. — Por qué: el importe exacto es el dato que no puede perderse (componentes.md, 7.5); el nombre completo sigue disponible en la tabla accesible (8.7).

### 8.9 Implementación con Recharts

Recharts es la dependencia ya aprobada para gráficos (AGENTS.md). Reglas para que el gráfico de
categorías de gasto —y cualquier gráfico futuro— use solo tokens:

- **Colores por variable CSS, no por valor.** Los props de color de Recharts (`fill`, `stroke`) aceptan cualquier cadena de color válida en CSS, incluida una función `var()`; se les pasa `"var(--color-chart-1)"`, `"var(--color-border)"`, `"var(--color-muted-foreground)"`, nunca un hexadecimal ni un nombre de la paleta de colores por defecto de Recharts. — Por qué: así un tema oscuro o de marca (tokens.md, 3.5) cambia también los gráficos sin tocar el componente.
- **`isAnimationActive={false}` en cada `<Bar>` / `<Line>` / `<Pie>` que se use.** Recharts anima la aparición de sus series por defecto (las barras "crecen" al montarse); hay que desactivarlo explícitamente en cada serie. — Por qué: es exactamente la animación de entrada prohibida en 8.5 y en toda pantalla de uso diario (movimiento.md, sección 6).
- **`<CartesianGrid>` no se usa**, o si se usa solo para la línea base del cero, con una única línea y `stroke="var(--color-border)"`. — Por qué: sin cuadrícula de fondo, coherente con el hairline de la dirección "Libro de caja" (decisiones.md, sección 2) y con que el valor exacto ya está en la etiqueta.
- **Eje de valores:** `<XAxis type="number" domain={[0, 'dataMax']} tick={false} axisLine={false} />`, que garantiza que arranca en cero sin dibujar marcas (8.5). **Eje de categorías:** `<YAxis type="category" tick={{ fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />`.
- **Etiquetas de valor** con `<LabelList position="right" formatter={formatearImporte} style={{ fill: 'var(--color-foreground)' }} />`, donde `formatearImporte` es la misma función que usa el componente Importe (componentes.md, 7.5) — nunca una cadena formateada aparte dentro del gráfico. — Por qué: dos formateadores del mismo dato es dos sitios donde pueden divergir.
- **Sin `<Legend>`** en este gráfico (8.5); sin `<Tooltip>` propio de Recharts, que solo responde a hover — se usa la tabla accesible de 8.7 en su lugar (o, si un gráfico futuro necesita un detalle puntual, un `<Tooltip>` disparado en clic o foco, no por el hover por defecto).
- El contenedor del gráfico usa `<ResponsiveContainer>` para heredar el ancho de la tarjeta (componentes.md, 7.3) sin fijar un ancho en píxeles. — Por qué: es el propio mecanismo de Recharts para adaptarse a móvil y escritorio sin media queries adicionales.
