# Brief de diseño — Cuadre

## Producto
App web de control de gastos e ingresos para quien lleva el dinero de un negocio pequeño o
actividad independiente. Alcance: el MVP de readme.md.
Nada fuera de alcance según AGENTS.md (presupuestos, ahorros, préstamos, tarjetas,
suscripciones, asistente de IA) debe aparecer en el diseño, ni como elemento decorativo.

## Contexto de uso
- Uso frecuente y breve: registrar un gasto recién hecho, sobre todo desde el móvil.
- Revisar saldos y movimientos, en móvil y escritorio.
- Prioridades: rapidez de registro y lectura clara de las cifras.

## Objetivo
Definir el sistema de diseño base de Cuadre: el estándar que heredarán todas las pantallas.
Se implementará como variables del tema de shadcn/ui y reglas documentadas.

## Material de partida
docs/diseno/propuestas.md: tres conceptos y reglas de oro. Son insumo para analizar, no
decisiones tomadas.

## Restricciones técnicas
- Next.js 16, Tailwind CSS 4, shadcn/ui. Los tokens se definen como variables CSS del tema.
- Sin librerías de animación nuevas: solo CSS y lo que ofrecen Tailwind y shadcn/ui.
- Moneda: USD. Configuración regional a confirmar (por ejemplo es-EC), aplicada con Intl.NumberFormat.

## Accesibilidad (obligatoria)
- WCAG 2.2 nivel AA: contraste mínimo 4.5:1 en texto y 3:1 en componentes de interfaz.
- Todo usable con teclado y con foco visible.
- Respeta prefers-reduced-motion.

## Criterios anti-IA (prohibidos)
- Paleta por defecto de Tailwind o shadcn/ui sin personalizar (slate, zinc, emerald, indigo tal cual).
- Gradientes índigo, violeta o cian; glassmorphism; brillos y resplandores.
- Rejilla de tarjetas idénticas con sombra suave y esquinas muy redondeadas.
- Animación de entrada en todos los elementos.
- Iconos genéricos dentro de círculos de color.
- Textos genéricos de marketing ("Toma el control de tus finanzas").
- Una sola tipografía genérica sin decisión tipográfica.

## Principios obligatorios
- Un punto de vista propio, coherente con el producto, no una plantilla.
- Color con significado: el color de acción no coincide con los de ingreso o gasto, y
  ingresos y gastos se distinguen también sin color (signo o icono).
- Números: cifras tabulares, alineadas a la derecha en tablas, decimales siempre visibles,
  negativos con signo.
- Movimiento solo funcional (confirmar acciones, transiciones de estado), breve y nunca
  decorativo en pantallas que se abren a diario.
- Un solo botón primario por vista; la tarjeta clicable entera es el área de clic; los botones
  mantienen su ancho al cargar; confirmación en acciones destructivas.
- Cada pantalla contempla estados vacío, carga, error y éxito.
- Móvil primero en el registro de movimientos.

## Entregable esperado
docs/diseno/sistema/ (un archivo por tema, con índice en docs/diseno/sistema/README.md) con:
1. Análisis de los tres conceptos: qué se conserva, qué se descarta y por qué.
2. Dirección recomendada y una alternativa, cada una con su concepto en dos líneas.
3. Tokens de color, con el ratio de contraste calculado para cada par texto/fondo.
4. Tipografía: familias, escala, pesos y uso de cifras tabulares.
5. Espaciado, radios, bordes y elevación.
6. Movimiento: qué se anima, duraciones, curvas y comportamiento con movimiento reducido.
7. Componentes base: botón, campo de formulario, tarjeta, lista o tabla de movimientos,
   importe (positivo, negativo, cero).
8. Patrones de estado: vacío, carga, error y éxito.
9. Checklist de revisión UX para cada pantalla nueva.
Cada decisión, justificada en una línea.