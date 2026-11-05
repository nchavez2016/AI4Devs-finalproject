# Decisiones de diseño — Cuadre

Secciones 1 y 2 del sistema de diseño. Índice completo en [README.md](README.md).

Estándar base que heredan todas las pantallas del MVP. Se implementa como tokens del tema de
Tailwind CSS 4 y shadcn/ui, más las reglas de este documento.

**Decisiones de partida (confirmadas con el responsable del producto, 2026-09-29):**
- Configuración regional `es-EC`, moneda USD. — Por qué: es el mercado del producto y coincide con la zona `America/Guayaquil` de los tests.
- Solo modo claro en el MVP. — Por qué: una sola paleta que verificar ahora.
- Todo valor de diseño es un token semántico, y un tema oscuro o una variante de marca futuros cambian solo valores de tokens, nunca componentes (tokens.md, sección 3). — Por qué: requisito del producto; el sistema tiene que poder crecer sin reescribir pantallas.
- Contexto de uso del brief validado: registro breve desde el móvil justo después del gasto; consulta en móvil y escritorio. Usuario: quien lleva el dinero de un negocio pequeño o actividad.

**Decisión del 2026-11-05 (responsable del producto): se relajan las prohibiciones visuales.**
- Se permiten iconos, iconos en contenedores redondeados, sombras de tarjeta suaves, degradados sutiles monocromos de la marca (nada índigo, violeta ni cian) y una animación de entrada breve. — Por qué: sin ellos las pantallas se veían planas y poco profesionales, y un producto de dinero necesita transmitir solidez.
- Se mantienen la paleta propia, la ausencia de glassmorphism y resplandores, los gráficos sin 3D ni ejes truncados, los textos sin marketing, WCAG 2.2 AA, `prefers-reduced-motion`, un solo botón primario por vista y los estados vacío, carga, error y éxito. — Por qué: protegen la identidad "Libro de caja", la legibilidad de las cifras y la accesibilidad.
- Cada elemento permitido se materializa como un token con nombre de función (tokens.md, 3.3), con el ratio de contraste de todo color o par nuevo en tokens.md, 3.4. — Por qué: el sistema debe seguir pudiendo cambiar de tema sin tocar componentes.
- Donde el análisis de la sección 1 cita una de estas prohibiciones como motivo de descarte (sombras difusas, entrada escalonada), el descarte de ese concepto se mantiene, pero ya no por esa prohibición: sigue siendo decorativo para el producto. Esa tabla es histórica y no se reescribe. — Por qué: conservar el razonamiento original sin contradecir la regla vigente.

---

## 1. Análisis de los tres conceptos

Criterio de filtro: se descarta todo lo que choca con los criterios anti-IA o los principios
obligatorios del brief, lo que queda fuera del alcance del MVP y lo que cae por debajo de WCAG 2.2 AA.
Los ratios citados se calcularon con la fórmula de luminancia relativa de WCAG (ver tokens.md, sección 3.4).

### Concepto 1 — "Confianza Corporativa Moderna"

| Idea | Decisión | Por qué |
|---|---|---|
| Bordes de 1 px y radios pequeños | **Se conserva** (con otros colores y un radio de 6 px) | Delimitan sin ruido y evitan el look de "tarjetas infladas". |
| Botón en carga que mantiene su ancho | **Se conserva** | Es un principio obligatorio del brief: el layout no salta. |
| Hover que oscurece el botón | **Se conserva** como token (`--color-primary-hover`), no como "oscurecer un 10 %" | Un color fijo permite calcular su contraste; un porcentaje no. |
| Pizarra `#0F172A`, borde `#E2E8F0`, esmeralda `#10B981` | **Se descarta** | Son la paleta por defecto de Tailwind (slate, emerald), prohibida por el brief. Además, texto blanco sobre `#10B981` da **2,53:1** y no llega al 4,5:1. |
| Verde como color de acción | **Se descarta** | El color de acción no puede coincidir con el de ingreso. |
| Sombras difusas en tarjetas | **Se descarta** | La rejilla de tarjetas con sombra suave es un patrón prohibido. |
| Proyecciones, fondos tintados de proyección, sparklines | **Se descarta** | Las proyecciones no existen en el MVP (se acercan a presupuestos, que están fuera de alcance). |
| Entrada escalonada de tarjetas | **Se descarta** | La animación de entrada en todos los elementos está prohibida y retrasa la lectura en una pantalla diaria. |
| Contador tipo odómetro | **Se descarta** | Durante 0,8 s muestra cifras falsas: en una app de dinero, un número incorrecto nunca es decorativo. |
| Transición de página deslizante | **Se descarta** | Es decorativa y se repetiría en cada navegación diaria. |
| `scale(0.98)` al pulsar | **Se descarta** | El cambio de color ya confirma la pulsación, y escalar difumina el texto del botón. |

### Concepto 2 — "Fintech Innovador y Dinámico"

| Idea | Decisión | Por qué |
|---|---|---|
| Esqueletos de carga | **Se conserva la idea, sin shimmer** | Reservan el sitio del contenido y evitan saltos. El brillo que se desplaza es decorativo. |
| Glassmorphism, blur, borde con gradiente | **Se descarta** | Prohibido por el brief. Además, el texto sobre un fondo translúcido tiene un contraste variable que no se puede garantizar. |
| Resplandor (glow) cian o índigo | **Se descarta** | Prohibido (brillos y resplandores; paleta índigo/cian). |
| Botón con gradiente índigo → cian | **Se descarta** | Prohibido. Blanco sobre cian `#06B6D4` da **2,42:1**. |
| Iconos 3D e ilustraciones Lottie | **Se descarta** | Son decorativos y Lottie sería una dependencia de animación nueva, que el brief no permite. |
| Botones tipo píldora (12 px o más) | **Se descarta** | Las esquinas muy redondeadas son un rasgo anti-IA listado. |
| Botón "magnético" y ripple | **Se descarta** | Movimiento decorativo; el magnético además desplaza el objetivo del clic. |
| Morphing de tarjeta a pantalla completa | **Se descarta** | Decorativo, costoso de hacer accesible y sin soporte en shadcn/ui. |
| Tooltip con blur que sigue al cursor | **Se descarta** | No funciona en táctil (la mitad del uso) y el blur está prohibido. |
| Modo oscuro por defecto | **Se aplaza** | Fuera del MVP por decisión del producto; los tokens lo dejan preparado (tokens.md, 3.5). |

### Concepto 3 — "Minimalismo Sofisticado y Premium"

| Idea | Decisión | Por qué |
|---|---|---|
| Jerarquía por tipografía y cifras grandes | **Se conserva** | El producto es, sobre todo, leer números. |
| Separadores hairline en lugar de cajas | **Se conserva** | Es la base de la dirección recomendada: un libro de caja rayado. |
| Botones planos, sólidos, radio de 4 px | **Se conserva** | Sin brillos ni gradientes; coherente con los criterios anti-IA. |
| Distinguir por peso tipográfico | **Se conserva** | Añade una señal que no depende del color. |
| Tarjetas totalmente invisibles | **Se descarta en parte** | Una tarjeta clicable necesita un límite visible para indicar que es un objeto; se usa un borde hairline. |
| Negro mate `#18181B` / `#27272A`, hairline `#E7E5E4` | **Se descarta** | Son `zinc-900`, `zinc-800` y `stone-200` de Tailwind sin personalizar. |
| Primario negro | **Se descarta** | En este sistema el gasto se muestra en tinta casi negra (tokens.md, 3.3.1): un primario negro coincidiría con el color de gasto. |
| Bronce o dorado para proyecciones | **Se descarta** | No hay proyecciones en el MVP. |
| Subrayado que se "dibuja", curvas "cinematográficas" | **Se descarta** | Movimiento decorativo. Se usan curvas estándar con duraciones cortas (movimiento.md, sección 6). |
| Revelado con clip-path, gráficos que se dibujan, punto que pulsa | **Se descarta** | Decorativo en la pantalla que más se abre; el punto que pulsa es movimiento continuo. |

### Reglas de oro de las propuestas

| Regla | Decisión | Por qué |
|---|---|---|
| Toda la tarjeta clicable es el área de clic | **Se conserva** | Es un principio obligatorio (Ley de Fitts). |
| Un solo botón primario por vista | **Se conserva** | Es un principio obligatorio. |
| Destello verde en el saldo al registrar | **Se reemplaza** | El verde significa "entra dinero": un destello verde tras registrar un *gasto* dice lo contrario. Se usa el resaltado de la fila nueva (estados.md, 9.4). |
| Proyección negativa en ámbar con tooltip | **Se descarta** | Depende de presupuestos (fuera de alcance) y el tooltip al pasar el ratón no existe en táctil. Se conserva su intención: no alarmar con rojo sin motivo (tokens.md, 3.3.1). |

---

## 2. Dirección

### Recomendada: "Libro de caja"

> Cuadre se lee como el cuaderno de caja bien llevado de un negocio: papel cálido, tinta oscura,
> renglones finos y cifras alineadas en columna.
> El color solo aparece cuando significa algo: entra dinero, hay un problema o se puede actuar.

- Fondo papel cálido y superficies blancas con borde fino y una elevación suave en las tarjetas. — Por qué: separa zonas sin la rejilla de tarjetas redondeadas que sigue prohibida.
- Serif solo en los títulos y sans con cifras tabulares en todo lo demás. — Por qué: da identidad sin sacrificar la lectura de números.
- **Los gastos van en tinta, no en rojo**; el rojo queda para los errores, lo destructivo y los saldos negativos. — Por qué: en un negocio la mayoría de filas son gastos; pintarlas de rojo genera fatiga de alarma y confunde un gasto normal con un error.
- Por qué se recomienda: nace del nombre y del problema del producto (reemplazar el cuaderno o el Excel que "se descuadra") y responde a la prioridad de leer cifras con claridad.

### Alternativa: "Mostrador"

> Cuadre como la caja registradora del mostrador: botones grandes, contraste alto y una sola
> acción evidente en cada pantalla, pensada para usarse de pie y con prisa.
> Verde para lo que entra y rojo para lo que sale, siempre con signo e icono.

- Cuándo elegirla: si las pruebas con usuarios muestran que casi todo el uso es registrar y casi nada es revisar. Sacrifica densidad de lectura en escritorio a cambio de velocidad de registro.
- Qué cambiaría: gracias a tokens.md (sección 3), casi solo **valores de tokens**: un `--color-primary` cálido y saturado, `--color-gasto` en rojo, `--font-titulo` igual a `--font-interfaz` y `--spacing-alto-control` mayor. Ningún componente cambia.

El resto del sistema de diseño desarrolla la dirección **"Libro de caja"**.
