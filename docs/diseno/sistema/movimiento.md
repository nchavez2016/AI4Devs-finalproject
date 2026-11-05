# Movimiento — Cuadre

Sección 6 del sistema de diseño. Índice completo en [README.md](README.md).

## 6. Movimiento

Valores en tokens.md, 3.3.8. Regla general: el movimiento solo explica un cambio de estado o confirma una
acción. Nada se anima al cargar una pantalla, salvo la entrada breve del contenedor de la página
(`--animate-entrada`), que ocurre una sola vez.

| Se anima | Cómo | Por qué |
|---|---|---|
| Color de hover y pulsado | Transición de color con la duración y curva por defecto (`--duracion-rapida`, `--ease-entrada`) | Confirma que el control responde. |
| Apertura de menús y selectores | Opacidad + un pequeño desplazamiento de 0,25rem, `--duracion-base` | Muestra de dónde sale el menú. |
| Diálogo y panel inferior | Opacidad (diálogo) o entrada desde abajo (panel), `--duracion-panel` | Explica que la capa está encima de la página. |
| Fila recién guardada | `--animate-resaltado` | Enseña dónde quedó el movimiento (estados.md, 9.4). |
| Indicador de carga en botón | `--animate-giro` | Indica que la acción sigue en marcha. |
| Entrada de la página | `--animate-entrada` (opacidad y subida de 0,25rem, `--duracion-entrada`), **una sola vez** en el contenedor principal | Da continuidad al cambiar de sección sin retrasar la lectura. |
| Tarjeta clicable | Transición de sombra (`--shadow-tarjeta` → `--shadow-tarjeta-hover`) con la duración por defecto | Confirma que toda la tarjeta responde. |

**No se anima:** la entrada de cada tarjeta o fila por separado (solo el contenedor de la página
entra, una vez); las cifras (sin contadores); los esqueletos (sin shimmer ni pulso). Los gráficos
pueden tener una entrada breve con `--duracion-entrada` (visualizacion.md, 8.5).

- Las salidas usan `--ease-salida`, que se percibe más corta con la misma duración. — Por qué: lo que se va ya no aporta información y no debe hacer esperar.
- Nada supera `--duracion-panel` (220 ms) salvo el resaltado de fila, que es un cambio de color y no un desplazamiento. — Por qué: son pantallas que se abren a diario.
- `tw-animate-css` **no se instala** (decisión de rediseno-base). Las entradas y salidas de los componentes de shadcn/ui (por ejemplo el Sheet) usan fotogramas propios definidos en `globals.css`, con `duration-(--duracion-base)` o `duration-(--duracion-panel)`. — Por qué: ninguna duración puede quedar fuera de los tokens y se evita una dependencia que Tailwind sin tema por defecto no necesita.

**Movimiento reducido** (`prefers-reduced-motion: reduce`): solo se redefinen valores de tokens.

| Token | Valor con movimiento reducido | Por qué |
|---|---|---|
| `--duracion-rapida`, `--duracion-base`, `--duracion-panel` | `0ms` | Menús, diálogos y panel aparecen sin desplazamiento, que es lo que afecta a las personas sensibles al movimiento. |
| `--duracion-resaltado` | `2000ms` | El resaltado se mantiene fijo más tiempo… |
| `--duracion-resaltado-salida` | `0ms` | …y desaparece sin transición: la confirmación se conserva sin movimiento. |
| `--animate-giro` | `none` | El indicador deja de girar; el botón muestra el texto "Guardando…" (componentes.md, 7.1). |
| `--animate-entrada` | `none` | La página aparece sin desplazamiento ni fundido. |
