# Tipografía y espaciado — Cuadre

Secciones 4 y 5 del sistema de diseño. Índice completo en [README.md](README.md).

## 4. Tipografía

Valores en tokens.md, 3.3.2.

- **`--font-interfaz` = IBM Plex Sans** para interfaz, texto e importes. — Por qué: pensada para interfaces de datos, con cifras claras y figuras tabulares; tiene carácter sin ser llamativa.
- **`--font-titulo` = Source Serif 4**, solo en `h1` y `h2`. — Por qué: la serif da la voz de "libro de caja" y separa la jerarquía de los datos sin restar legibilidad.
- Las dos se cargan con `next/font/google` y sustituyen a Geist. — Por qué: viene incluido en Next.js, así que no añade ninguna dependencia, y las fuentes se sirven desde el propio dominio.
- Las cifras **nunca** van en `--font-titulo`. — Por qué: todas las cantidades deben compartir ancho y forma para compararse en columna.
- Tres pesos (`lectura`, `control`, `enfasis`) y solo esos se descargan. — Por qué: cubren la jerarquía y limitan el peso de la página.
- Nada por debajo de `--text-grupo` (13 px). — Por qué: las cifras y los metadatos se leen de pie y en pantallas pequeñas.
- El texto de los campos usa `--text-cuerpo` (16 px) o mayor. — Por qué: con menos, iOS hace zoom al enfocar y rompe el registro rápido.
- Sin mayúsculas sostenidas ni tracking: no existen tokens `--tracking-*`. — Por qué: restan legibilidad y son un recurso de plantilla.

**Cifras tabulares**
- `--default-font-feature-settings: "tnum", "lnum"` las aplica a toda la app. — Por qué: en Cuadre casi todos los números (importes, fechas, conteos) son datos que se comparan en columna; activarlo globalmente hace imposible olvidarlo.
- Verificación obligatoria al implementar: los textos "111,11" y "888,88" deben medir lo mismo en IBM Plex Sans; si no, la fuente no aplica `tnum` y hay que corregir la carga antes de seguir. — Por qué: no basta con elegir la fuente; la característica tiene que llegar al navegador.
- El símbolo `$`, los enteros y los decimales van al mismo tamaño y peso. — Por qué: los decimales siempre visibles incluyen que se lean bien; los céntimos en superíndice son un recurso decorativo.

---

## 5. Espaciado, radios, bordes y elevación

Valores en tokens.md, 3.3.3 a 3.3.7.

**Espaciado y tamaños**
- Los espacios se nombran por la relación que separan (`entre-campos`, `etiqueta`, `mensaje`), no por su tamaño. — Por qué: al diseñar una pantalla se elige "qué separo", y el sistema da la medida.
- Todos los valores son múltiplos de 0,25rem (4 px), salvo `--spacing-etiqueta` (6 px). — Por qué: ritmo coherente; la etiqueta va más pegada a su campo para leerse como una unidad.
- Los altos de control y campo son mayores en móvil (44 y 48 px) que en escritorio (40 px). — Por qué: el pulgar necesita más área que el ratón, y ambos superan el mínimo de 24 px de WCAG 2.2.
- `--breakpoint-escritorio` en 768 px. — Por qué: por debajo, una tabla de cinco columnas no cabe.
- `--container-formulario` en 30rem y `--container-contenido` en 65rem. — Por qué: una columna de formulario legible y tablas sin líneas demasiado largas.

**Radios**
- Dos radios: `--radius-control` (4 px) y `--radius-superficie` (6 px). — Por qué: firme en lo que se pulsa y un punto más suave en lo que contiene, sin llegar a "inflado".
- Sin píldoras ni círculos: `rounded-full` no se usa en componentes. Los iconos pueden ir en un contenedor redondeado (`--radius-contenedor-icono`, componentes.md 7.3), nunca en un círculo. — Por qué: las píldoras siguen siendo un rasgo anti-IA; el contenedor cuadrado de esquinas suaves no.

**Bordes y foco**
- Un único ancho de borde (1 px). Se usa `--color-border` en renglones, separadores y tarjetas; `--color-input` en controles; y `--color-destructive` más icono y mensaje en campos con error. — Por qué: la jerarquía la da el color del borde, no su grosor; el error nunca se comunica solo con color.
- El foco se define una sola vez en la hoja global para `:focus-visible`: contorno de `--default-outline-width` en `--color-ring`, separado `--foco-separacion`. Los componentes no lo redefinen. — Por qué: un foco idéntico y visible en toda la app (8,28:1).

**Elevación**
- Nivel 0 para filas, cabeceras, campos y todo lo que vive en la página sin ser una tarjeta: sin sombra. — Por qué: la jerarquía la dan la tipografía, el papel y el blanco.
- Nivel 1, `--shadow-tarjeta` (y `--shadow-tarjeta-hover` en una tarjeta clicable) más borde `--color-border`, para las tarjetas que agrupan contenido. — Por qué: una elevación suave separa la tarjeta del papel (decisión del 2026-11-05).
- Nivel 2, `--shadow-flotante` más borde `--color-border`, solo para lo que flota: menús, selectores, diálogos y panel inferior. — Por qué: lo que tapa contenido debe notarse más que una tarjeta.
- Detrás de diálogos y panel, `--color-velo` sin blur. — Por qué: aísla la capa; el blur está prohibido.
