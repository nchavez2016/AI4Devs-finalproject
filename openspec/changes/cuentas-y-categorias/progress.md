# Progreso: cuentas-y-categorias
- Siguiente: 6.1 [HUMANO] Con docker compose up -d y npm run dev (grupo 6, Prueba manual y verificación final).
- Decisiones: ContenidoPanel usa EncabezadoPagina sin volverAlPanel ni accion en max-w-contenido; Cerrar sesión queda fuera del encabezado.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
