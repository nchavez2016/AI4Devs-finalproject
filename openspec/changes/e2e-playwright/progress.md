# Progreso: e2e-playwright
- Siguiente: 3.1 (RED del escenario "La suite E2E acepta una base que termina en _test").
- Decisiones: next build + next start con globalSetup, base cuadre_e2e_test, puerto 3100; solo Chromium en escritorio y móvil 360 px; se incluyen redirect sin sesión y aislamiento; CI solo diseño.
- Discrepancias: en 2.3 la mutación (quitar la guarda de preparar-base-e2e.ts) no hace fallar el test, porque crearBaseSiNoExiste ya aplica la misma guarda; la de prepararBaseE2E es defensa redundante. RED de 2.2 observado: falta el módulo preparar-base-e2e. 2.1 no necesitó código: guardia.test.ts ya caracteriza la guarda; se exportaron crearBaseSiNoExiste y aplicarMigraciones de global-setup.ts (sin duplicar), por lo que 2.4 no produjo cambios.
