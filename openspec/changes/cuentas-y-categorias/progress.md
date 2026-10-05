# Progreso: cuentas-y-categorias
- Siguiente: 2.16 RED — mismo archivo, test "Crear categoría rechazada por nombre duplicado en el mismo tipo".
- Decisiones: cada ciclo RED/GREEN/REFACTOR va en un commit con la suite en verde; el RED se registra en el cuerpo del commit. Esquema de nombre compartido en `src/server/validacion.ts`.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo.
