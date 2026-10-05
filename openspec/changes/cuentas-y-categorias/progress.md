# Progreso: cuentas-y-categorias
- Siguiente: 2.28 RED — mismo archivo, test "Un usuario no ve las categorías de otro" (si pasa sin cambios, forzar quitando `usuarioId` del filtro de `listar`).
- Decisiones: cada ciclo RED/GREEN/REFACTOR va en un commit con la suite en verde; el RED se registra en el cuerpo del commit. Las mutaciones se hacen con `docker exec cuadre-db psql` sobre `cuadre_test` y se restauran antes del commit. Esquema de nombre compartido en `src/server/validacion.ts`.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`.
