# Progreso: cuentas-y-categorias
- Siguiente: 5.4 RED — `src/components/EncabezadoPagina.test.tsx`, test "EncabezadoPagina muestra el enlace al panel solo si se pide".
- Decisiones: EncabezadoPagina usa header con h1 y p como hermano directo para preservar los tests existentes.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
