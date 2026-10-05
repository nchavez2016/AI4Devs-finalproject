# Progreso: cuentas-y-categorias
- Siguiente: 5.12 RED — `cuentas.test.tsx`, test "Pantalla de cuentas limita el ancho del contenido y del formulario".
- Decisiones: ContenidoCuentas y ContenidoCategorias usan EncabezadoPagina con volverAlPanel; se borra el marcado duplicado.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
