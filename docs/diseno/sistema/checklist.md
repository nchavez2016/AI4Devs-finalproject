# Checklist de revisión UX — Cuadre

Sección 10 del sistema de diseño. Índice completo en [README.md](README.md).

## 10. Checklist de revisión UX para cada pantalla nueva

**Alcance y contenido**
- [ ] No aparece nada fuera del MVP (presupuestos, ahorros, préstamos, tarjetas, suscripciones, asistente de IA), ni como decoración.
- [ ] Hay un único `h1` y los textos son concretos, sin frases de marketing.
- [ ] Las etiquetas de los botones dicen verbo y objeto.

**Tokens**
- [ ] Todo valor visual sale de un token de tokens.md, 3.3: sin hexadecimales, valores literales, clases arbitrarias con valores (`p-[13px]`), opacidades sobre colores (`bg-primary/10`) ni estilos en línea con valores.
- [ ] No hay variantes `dark:` ni selectores de tema en componentes.
- [ ] Si la pantalla necesitó un valor nuevo, se añadió como token con nombre de función en tokens.md, 3.3 (y, si es un color, a la tabla 3.4 de tokens.md con su ratio calculado).
- [ ] El commit pasa el hook `pre-commit` (que incluye la comprobación automática de clases del tema por defecto descrita en tokens.md, 3.2). Este punto ya no se revisa a mano: si el hook falla, se corrige antes de continuar.

**Color**
- [ ] Ingreso y gasto se distinguen sin color (signo e icono o texto oculto para lectores).
- [ ] `primary` solo aparece en elementos interactivos; `destructive` y `negativo`, solo en errores, lo destructivo y saldos negativos.

**Números**
- [ ] Todos los importes pasan por el componente Importe (componentes.md, 7.5): dos decimales, signo U+2212, cifras tabulares.
- [ ] En listas y tablas, los importes y sus cabeceras están alineados a la derecha.

**Jerarquía e interacción**
- [ ] Hay exactamente un botón primario en la vista.
- [ ] Las tarjetas y filas clicables lo son en toda su superficie y no contienen otros interactivos.
- [ ] Los botones mantienen su ancho en carga y no se pueden pulsar dos veces.
- [ ] Toda eliminación pasa por un diálogo de confirmación que nombra el elemento.
- [ ] No hay una rejilla de tarjetas idénticas, iconos en círculos de color ni `rounded-full`.

**Estados**
- [ ] Están diseñados los estados vacío (y vacío por filtro si hay filtros), carga, error y éxito.
- [ ] Un error nunca borra lo que el usuario escribió.

**Visualización de datos** (si la pantalla incluye un gráfico)
- [ ] El gráfico responde a una única pregunta formulable en una frase, y el dashboard no supera el máximo de gráficos vigente (visualizacion.md, 8.2).
- [ ] No es un gráfico circular o de anillo (visualizacion.md, 8.3).
- [ ] Usa `--color-chart-*` existentes o, si necesita uno nuevo, se dio de alta en tokens.md, 3.3.1, con su ratio calculado en la tabla 3.4 de tokens.md; con dos series, se distinguen también por posición, patrón o etiqueta, no solo por color (visualizacion.md, 8.4).
- [ ] Las etiquetas de valor usan el mismo formato que el componente Importe (componentes.md, 7.5) y el eje de valores arranca en cero sin truncarlo (visualizacion.md, 8.5).
- [ ] Sin 3D, degradados, sombras ni animación de entrada; `isAnimationActive={false}` en cada serie de Recharts (visualizacion.md, 8.5 y 8.9).
- [ ] Tiene sus propios estados vacío, carga y error, sin bloquear el resto de la pantalla si falla (visualizacion.md, 8.6).
- [ ] Lleva `role="img"` con `aria-label`, una tabla accesible con los mismos datos y, si aplica, un detalle que también responda a clic o foco, no solo a hover (visualizacion.md, 8.7).
- [ ] Se ha revisado en 360 px de ancho sin necesitar una versión distinta del gráfico (visualizacion.md, 8.8).

**Móvil**
- [ ] Se ha probado primero a 360 px de ancho, sin scroll horizontal.
- [ ] Los objetivos táctiles miden al menos `objetivo-tactil` (44 px).
- [ ] Los campos numéricos abren el teclado adecuado (`inputmode`).
- [ ] Una barra fija inferior no tapa el campo enfocado (`reserva-barra-inferior` aplicado a `scroll-padding-bottom`; criterio 2.4.11 de WCAG 2.2).

**Teclado y lectores de pantalla**
- [ ] Todo se puede hacer con teclado, en un orden de foco lógico, y el foco global es visible en cada elemento.
- [ ] Los diálogos atrapan el foco y lo devuelven al cerrarse.
- [ ] Cada campo tiene etiqueta asociada, y la ayuda y el error están enlazados con `aria-describedby`.
- [ ] Las confirmaciones y los errores se anuncian (`aria-live` o `role="alert"`).
- [ ] El inicio de sesión permite pegar la contraseña y usar el gestor de contraseñas (criterio 3.3.8 de WCAG 2.2).
- [ ] No se pide dos veces un dato que el usuario ya introdujo en el mismo flujo (criterio 3.3.7).

**Movimiento**
- [ ] Nada se anima al cargar la pantalla.
- [ ] Toda duración y curva sale de los tokens de tokens.md, 3.3.8.
- [ ] Con movimiento reducido activado, no hay desplazamientos ni giros continuos.

**Formato regional**
- [ ] Importes y fechas usan `es-EC` y la zona horaria `America/Guayaquil`.
