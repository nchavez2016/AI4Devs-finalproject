---
name: ux-cuadre
description: "Patrones de pantalla y checklist UX de Cuadre. Úsala al crear o modificar cualquier pantalla, formulario o lista."
---
# UX de Cuadre

Fuente de verdad: docs/diseno/sistema/ (empieza por README.md). Esta skill solo fija
los patrones de pantalla; no repitas valores, usa los tokens de tokens.md.
Decisión vigente del 2026-11-05 (decisiones.md): se permiten iconos, sombras de tarjeta suaves,
degradado monocromo de la marca y una entrada de página breve.

## Estructura de toda pantalla privada
1. La cabecera compartida la pone `src/app/(privado)/layout.tsx` (marca, navegación con
   `aria-current`, cerrar sesión, menú móvil; componentes.md, 7.7). La pantalla NO la repite ni
   añade un enlace "← Volver".
2. Contenedor centrado con `max-w-contenido`, margen de página y `animate-entrada` (una sola vez,
   solo en este contenedor; movimiento.md).
3. `EncabezadoPagina`: un `h1`, una frase de propósito y, como máximo, una acción primaria.
4. Secciones separadas por `--spacing-seccion`.
5. Una sección nueva de navegación se añade en `src/components/navegacion/secciones.ts`.

## Composición lista + formulario
- En escritorio, dos columnas con `grid grid-cols-(--columnas-lista-formulario)`; en móvil, una columna. En pantallas de registro frecuente (transacciones), el formulario va primero en móvil, también en el DOM; en el resto, la lista primero (tokens.md, 3.3.7b).
- En móvil, los filtros del listado empiezan plegados tras el botón "Filtros (n)" y la acción de guardar queda fija abajo con `fixed` sin tapar el campo enfocado.
- El formulario va en una `Tarjeta` con su título `h2` ("Nueva cuenta") y dentro de un contenedor `max-w-formulario`.
- Pantallas sin sesión (login, registro): `PaginaAcceso`, tarjeta centrada con `MarcaCuadre`.
- Accesos del panel: `TarjetaAcceso` (un único enlace que cubre la tarjeta, componentes.md, 7.3).

## Elevación, iconos y marca
- Tarjeta: `shadow-tarjeta` (hover clicable: `shadow-tarjeta-hover`); lo que flota: `shadow-flotante`.
  Nunca sombras de color ni `rounded-full`.
- Iconos: `lucide-react`, `aria-hidden` junto a un texto, `size-icono`. En un
  `ContenedorIcono` (fondo `icono-fondo`, color `icono`) solo en tarjetas de acceso y estados vacíos.
- Degradado: solo `bg-(image:--degradado-marca)` en la marca; nada índigo, violeta ni cian.
- Entrada: `animate-entrada` en el contenedor de la página; ninguna tarjeta o fila se anima sola.
  Con movimiento reducido el token vale `none`.

## Formularios
- Un único botón primario por vista; si la vista ya tiene el del formulario, el del estado vacío
  es secundario (estados.md, 9.1).
- El error va junto al campo; la validación se muestra al enviar (`noValidate`) y el foco va al
  primer campo inválido con `useFocoPrimerError` (componentes.md, 7.2).
- Monto: `Campo monto`, con el "$" dentro del contenedor con borde. Selectores: `select` nativo con
  los tokens del campo; nada de Select de shadcn/ui.
- Tras guardar: confirmar con la región `aria-live` y resaltar lo creado.

## Listas y estados
- Renglones finos; importes a la derecha con el componente Importe.
- Vacío: una frase que explica y un botón que lo resuelve. Nunca una pantalla en blanco.
- Carga, error y éxito según estados.md.

## Tokens y shadcn/ui
- Solo clases de tokens (tokens.md, 3.3). El hook de pre-commit rechaza las del tema por defecto
  de Tailwind (`p-4`, `min-w-0`, `text-sm`, `rounded-md`, `sm:`, `/10`, `dark:`). Equivalentes:
  `p-tarjeta`, `min-w-ninguno`, `text-detalle`, `rounded-control`, `escritorio:`.
- shadcn/ui solo donde ahorre trabajo y adaptado a tokens (hoy: `Sheet`). `cn()` es `clsx`, sin
  `tailwind-merge`.

## Que invite a usarse, sin decorar
- Cada pantalla responde: dónde estoy, para qué sirve, qué hago ahora.
- Primer uso: mostrar el siguiente paso (crear cuenta, registrar movimiento).
- Textos con verbo y objeto; sin frases de marketing.
- Siguen prohibidos: paleta por defecto de Tailwind o shadcn/ui, glassmorphism, resplandores,
  gráficos en 3D o con ejes truncados, y animar cada elemento por separado.

## Antes de dar una pantalla por terminada
Pasar checklist.md y revisar a 360 px y a 1280 px.
