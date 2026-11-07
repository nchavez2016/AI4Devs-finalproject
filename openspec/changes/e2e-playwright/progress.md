# Progreso: e2e-playwright
- Siguiente: 4.1 (RED del escenario "Cada ejecución E2E usa un correo distinto").
- Decisiones: next build + next start con globalSetup, base cuadre_e2e_test, puerto 3100; solo Chromium en escritorio y móvil 360 px; se incluyen redirect sin sesión y aislamiento; CI solo diseño.
- Discrepancias: en 2.3 la mutación (quitar la guarda de preparar-base-e2e.ts) no hace fallar el test, porque crearBaseSiNoExiste ya aplica la misma guarda (defensa redundante). RED de 3.1 observado: comprobarBaseE2E no existía.
