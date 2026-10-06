# Progreso: cuentas-y-categorias
- Siguiente: 5.18 CARACTERIZACIÓN — ejecutar `src/app/(privado)/panel/panel.test.tsx` y confirmar que está en verde antes de tocar `ContenidoPanel.tsx`.
- Decisiones: ContenidoCategorias envuelve su contenido en max-w-contenido y su formulario en max-w-formulario.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
