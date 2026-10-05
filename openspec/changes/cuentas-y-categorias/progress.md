# Progreso: cuentas-y-categorias
- Siguiente: 2.19 RED — mismo archivo, test "Categorías duplicadas rechazadas aunque se envíen a la vez" (forzar con la mutación del índice).
- Decisiones: cada ciclo RED/GREEN/REFACTOR va en un commit con la suite en verde; el RED se registra en el cuerpo del commit. Esquema de nombre compartido en `src/server/validacion.ts`. Migración de categorías creada y aplicada por el humano (`prisma migrate dev` no es ejecutable en este entorno).
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`.
