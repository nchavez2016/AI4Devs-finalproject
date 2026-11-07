# Progreso: e2e-playwright
- Siguiente: 5.1 (crear playwright.config.ts).
- Decisiones: next build + next start con globalSetup, base cuadre_e2e_test, puerto 3100; solo Chromium en escritorio y móvil 360 px; se incluyen redirect sin sesión y aislamiento; CI solo diseño.
- Discrepancias: en 2.3 la mutación (quitar la guarda de preparar-base-e2e.ts) no hace fallar el test, porque crearBaseSiNoExiste ya aplica la misma guarda (defensa redundante). RED de 4.1 observado: faltaba correo-unico.ts. Añadidos por /opsx:update: screenshot only-on-failure (5.1) y evidencias opcionales (6.4, D5).
