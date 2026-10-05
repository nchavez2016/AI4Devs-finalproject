# Progreso: cuentas-y-categorias
- Siguiente: 2.25 RED — mismo archivo, test "Crear categoría rechazada por tipo inválido".
- Decisiones: cada ciclo RED/GREEN/REFACTOR va en un commit con la suite en verde; el RED se registra en el cuerpo del commit. Las mutaciones de índice se hacen con `docker exec cuadre-db psql` sobre `cuadre_test` y se restauran antes del commit. Esquema de nombre compartido en `src/server/validacion.ts`.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`.
