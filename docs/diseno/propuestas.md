# Propuestas de diseño — Cuadre

Material de partida para el análisis del experto UX. No son decisiones tomadas.

---

## Concepto 1: "Confianza Corporativa Moderna"

**Enfoque:** Claridad absoluta, jerarquía visual y eficiencia.

### 1. Tarjetas del Dashboard (Cards)

**Diseño:** Bordes sutiles (1px #E2E8F0), esquinas ligeramente redondeadas (8px) y sombras muy difusas y suaves para dar profundidad sin ruido.

**Estructura de Data:**
- Gastos actuales: Fondo blanco puro, texto en azul pizarra (#0F172A).
- Proyecciones: Fondo ligeramente tintado (ej. un verde o ámbar al 5% de opacidad) para diferenciarlo visualmente de los datos históricos. Usa una línea punteada sutil en los gráficos de proyección.

**UX Tip:** Incluye un "Sparkline" (mini gráfico de líneas) en la esquina superior derecha de la tarjeta para mostrar la tendencia de los últimos 30 días de un solo vistazo.

### 2. Botones

**Estilo:** Bordes redondeados (6px).
- Primario: Fondo sólido Verde Esmeralda (#10B981), texto blanco.
- Secundario: Fondo transparente, borde Verde Esmeralda, texto Verde Esmeralda.

**Estados:**
- Hover: El fondo se oscurece un 10%.
- Active (clic): Escala ligeramente hacia abajo (scale: 0.98) para dar sensación de presión física.
- Loading: El texto desaparece y aparece un spinner minimalista en el centro, manteniendo el ancho del botón para que no "salte" el layout.

### 3. Animaciones en el sitio

- **Entrada (Staggered Fade-in):** Al cargar el dashboard, las tarjetas no aparecen todas a la vez. Aparecen en cascada (la primera, luego la segunda 50ms después, etc.) con un suave fade-in y un desplazamiento hacia arriba de 10px.
- **Contador (Odometer):** Los números de "Total Gastado" y "Proyección Mensual" no aparecen estáticos; "cuentan" desde cero hasta el valor final en 0.8 segundos.
- **Transiciones de página:** Deslizamiento horizontal suave (slide) al navegar entre secciones (ej. de Dashboard a Reportes).

---

## Concepto 2: "Fintech Innovador y Dinámico"

**Enfoque:** Fluidez, tecnología, engagement y modo oscuro.

### 1. Tarjetas del Dashboard (Cards)

**Diseño:** Glassmorphism (Glass effect). Fondo semitransparente (rgba(255,255,255,0.05) en modo oscuro), backdrop-filter: blur(12px), y un borde interno sutil de 1px con gradiente.

**Estructura de Data:**
- Las tarjetas de proyección tienen un "Glow" (resplandor) sutil en la esquina inferior con el color del acento (Cian o Índigo).
- Uso de íconos 3D o ilustraciones Lottie pequeñas dentro de las tarjetas para hacer los datos menos áridos.

### 2. Botones

**Estilo:** Bordes más redondeados (12px o tipo "Pill").
- Primario: Relleno con gradiente lineal (Índigo a Cian).

**Estados:**
- Hover: Efecto "Magnetic" (el botón se mueve ligeramente hacia el cursor cuando te acercas) y el gradiente brilla más (aumento de box-shadow con color).
- Active: Efecto "Ripple" (onda) que se expande desde el punto exacto donde hiciste clic.

### 3. Animaciones en el sitio

- **Shared Element Transition (Transición de elemento compartido):** Si haces clic en una tarjeta de "Proyección Q3", la tarjeta no desaparece. Se expande fluidamente (morphing) para ocupar toda la pantalla y mostrar los detalles.
- **Skeleton Loaders:** En lugar de un spinner, mientras cargan los datos de la API, se muestran "esqueletos" de las tarjetas con un efecto de brillo que se desplaza (shimmer) de izquierda a derecha.
- **Gráficos Interactivos:** Al pasar el mouse sobre un gráfico de proyección, la línea se "engrosa" y aparece un tooltip flotante con efecto blur que sigue suavemente al cursor (suavizado con interpolación).

---

## Concepto 3: "Minimalismo Sofisticado y Premium"

**Enfoque:** Elegancia, espacio negativo, tipografía y cero fricción visual.

### 1. Tarjetas del Dashboard (Cards)

**Diseño:** Invisibles. Sin bordes, sin sombras. Solo se definen por el espacio en blanco (whitespace) que las rodea.

**Estructura de Data:**
- Tipografía grande y contrastada para los números clave.
- Las proyecciones se indican con un cambio sutil de peso tipográfico (ej. el gasto real en Bold y la proyección en Regular o Light) o usando un color Bronce/Dorado muy sutil para los números proyectados.
- Separadores: Líneas "Hairline" (de 1px de grosor, color gris muy claro #E7E5E4) en lugar de cajas cerradas.

### 2. Botones

**Estilo:** Minimalistas. Bordes rectos o muy ligeramente redondeados (4px).
- Primario: Fondo negro mate (#18181B) o Bronce, texto blanco. Sin brillos, sin gradientes. Totalmente plano y sólido.
- Secundario (Ghost): Solo texto con un subrayado elegante.

**Estados:**
- Hover: En el botón primario, el fondo cambia a un gris oscuro (#27272A). En el secundario, el subrayado se "dibuja" de izquierda a derecha con una animación suave.

### 3. Animaciones en el sitio

- **Curvas de Aceleración Cinematográficas:** Olvida los ease-in-out estándar. Usa curvas personalizadas como cubic-bezier(0.16, 1, 0.3, 1) (ease-out-expo). Esto hace que los elementos entren rápido y se desaceleren suavemente al final, dando una sensación de "peso" y lujo.
- **Revelación de Datos:** Los números y textos no solo aparecen; se revelan mediante una máscara (clip-path) que se desplaza de abajo hacia arriba, como si se levantara un telón sutil.
- **Dibujo de Gráficos:** Los gráficos de proyección se "dibujan" solos en la pantalla con una animación de trazo (stroke-dashoffset) lenta y elegante, acompañados de un punto final que pulsa suavemente.

---

## Reglas de Oro UX para Botones y Tarjetas (aplicables a los 3)

- **Ley de Fitts en Tarjetas:** Si una tarjeta de "Gasto" o "Proyección" es clickeable para ver detalles, toda la tarjeta debe ser el área de clic (hitbox), no solo el texto o un botón de "Ver más". Aumenta el área de clic y reduce la frustración.
- **Jerarquía de Botones por Pantalla:** En cualquier vista (especialmente al registrar un nuevo gasto o ajustar una proyección), debe haber un solo botón primario. Los demás deben ser secundarios o terciarios (texto). Nunca compitas por la atención del usuario.
- **Feedback de "Éxito" en Tarjetas:** Cuando el usuario registra un gasto y la tarjeta del "Total Disponible" se actualiza, la tarjeta debe tener un micro-parpadeo (flash) sutil en el color de éxito (verde) por 300ms para confirmar que la acción impactó en el saldo.
- **Manejo de Proyecciones Negativas:** Si una proyección indica que se van a pasar del presupuesto, la tarjeta no debe volverse roja chillona de golpe. Debe usar un tono ámbar/naranja suave, y al hacer hover, revelar un tooltip explicando por qué (ej. "Se proyecta exceder por gastos variables de marketing").