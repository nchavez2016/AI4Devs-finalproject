# Progreso: cuentas-y-categorias
- Siguiente: 5.15 RED — `categorias.test.tsx`, test "Pantalla de categorías limita el ancho del contenido y del formulario".
- Decisiones: ContenidoCuentas envuelve su contenido en max-w-contenido y su formulario en max-w-formulario.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
