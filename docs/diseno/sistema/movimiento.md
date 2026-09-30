# Movimiento — Cuadre

Sección 6 del sistema de diseño. Índice completo en [README.md](README.md).

## 6. Movimiento

Valores en tokens.md, 3.3.8. Regla general: el movimiento solo explica un cambio de estado o confirma una
acción. Nada se anima al cargar una pantalla.

| Se anima | Cómo | Por qué |
|---|---|---|
| Color de hover y pulsado | Transición de color con la duración y curva por defecto (`--duracion-rapida`, `--ease-entrada`) | Confirma que el control responde. |
| Apertura de menús y selectores | Opacidad + un pequeño desplazamiento de 0,25rem, `--duracion-base` | Muestra de dónde sale el menú. |
| Diálogo y panel inferior | Opacidad (diálogo) o entrada desde abajo (panel), `--duracion-panel` | Explica que la capa está encima de la página. |
| Fila recién guardada | `--animate-resaltado` | Enseña dónde quedó el movimiento (estados.md, 9.4). |
| Indicador de carga en botón | `--animate-giro` | Indica que la acción sigue en marcha. |

**No se anima:** la entrada de pantallas, tarjetas o filas; las cifras (sin contadores); los
cambios de ruta; los gráficos al aparecer; los esqueletos (sin shimmer ni pulso).

- Las salidas usan `--ease-salida`, que se percibe más corta con la misma duración. — Por qué: lo que se va ya no aporta información y no debe hacer esperar.
- Nada supera `--duracion-panel` (220 ms) salvo el resaltado de fila, que es un cambio de color y no un desplazamiento. — Por qué: son pantallas que se abren a diario.
- Las animaciones de los componentes de shadcn/ui (`tw-animate-css`, instalado por shadcn/ui) reciben la duración con `duration-(--duracion-base)` o `duration-(--duracion-panel)`. Hay que verificar al instalar que respetan esa clase. — Por qué: ninguna duración puede quedar fuera de los tokens.

**Movimiento reducido** (`prefers-reduced-motion: reduce`): solo se redefinen valores de tokens.

| Token | Valor con movimiento reducido | Por qué |
|---|---|---|
| `--duracion-rapida`, `--duracion-base`, `--duracion-panel` | `0ms` | Menús, diálogos y panel aparecen sin desplazamiento, que es lo que afecta a las personas sensibles al movimiento. |
| `--duracion-resaltado` | `2000ms` | El resaltado se mantiene fijo más tiempo… |
| `--duracion-resaltado-salida` | `0ms` | …y desaparece sin transición: la confirmación se conserva sin movimiento. |
| `--animate-giro` | `none` | El indicador deja de girar; el botón muestra el texto "Guardando…" (componentes.md, 7.1). |
