# Progreso: cuentas-y-categorias
- Siguiente: 5.22 RED — `src/app/(privado)/panel/panel.test.tsx`, test "El panel usa el encabezado de página".
- Decisiones: ContenidoPanel añade la sección "Por dónde empezar" con enlaces a /cuentas y /categorias.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
