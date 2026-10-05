---
name: ux-cuadre
description: "Patrones de pantalla y checklist UX de Cuadre. Úsala al crear o modificar cualquier pantalla, formulario o lista."
---
# UX de Cuadre

Fuente de verdad: docs/diseno/sistema/ (empieza por README.md). Esta skill solo fija
los patrones de pantalla; no repitas valores, usa los tokens de tokens.md.

## Estructura de toda pantalla privada
1. Cabecera de la app compartida (marca, navegación, cerrar sesión).
2. Contenedor centrado con ancho máximo (--container-contenido) y margen de página.
3. Encabezado de página: h1, una frase de propósito, enlace "← Volver" si no es el
   panel, y como máximo una acción primaria.
4. Secciones separadas por --spacing-seccion.

## Formularios
- Dentro de un contenedor con --container-formulario; nunca a todo el ancho.
- Un único botón primario; el error va junto al campo.
- Tras guardar: confirmar y mostrar lo creado resaltado.

## Listas y estados
- Renglones finos; importes a la derecha con el componente Importe.
- Vacío: una frase que explica y un botón que lo resuelve. Nunca una pantalla en blanco.
- Carga, error y éxito según estados.md.

## Que invite a usarse, sin decorar
- Cada pantalla responde: dónde estoy, para qué sirve, qué hago ahora.
- Primer uso: mostrar el siguiente paso (crear cuenta, registrar movimiento).
- Textos con verbo y objeto; sin frases de marketing.
- Prohibido: gradientes, sombras de tarjeta, iconos en círculos, animación de entrada.

## Antes de dar una pantalla por terminada
Pasar checklist.md y revisar a 360 px y a 1280 px.