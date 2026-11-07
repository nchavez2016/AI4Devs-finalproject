# Progreso: e2e-playwright
- Siguiente: 6.1 (RED del flujo principal en e2e/flujo-principal.spec.ts).
- Decisiones: next build + next start con globalSetup, base cuadre_e2e_test, puerto 3100; solo Chromium en escritorio y móvil 360 px; se incluyen redirect sin sesión y aislamiento; CI solo diseño. La base E2E la crea migrate deploy, no global-setup.ts (desvío de D1, en design.md).
- Discrepancias: en 2.3 la mutación (quitar la guarda de preparar-base-e2e.ts) no hace fallar el test, porque la guarda también está en aplicarMigraciones (defensa redundante). Hook de pre-commit falló una vez en 3 tests sin identificar; pasó al repetir. La tarea 9.1 exige que la primera ejecución parta de cuadre_e2e_test inexistente (la borra la persona).
