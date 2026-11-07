# Progreso: dashboard

- Siguiente: 3.1 RED "Ver saldo por cuenta" (tras la parada (a) del grupo 2)
- Decisiones: 0.1–0.6 la opción recomendada, semana de lunes a domingo | 0.7 autorizada: modificar panel.test.tsx como indica la tarea y retirar src/server/panel.ts y panel.test.ts si quedan sin uso | 0.8 no aplica; sin commits ni push en este apply, por orden de la persona
- Discrepancias: añadido periodo.test.ts ("La semana de un domingo termina ese mismo domingo") porque la mutación pedida en 2.8 sobrevivió; RED de 2.10 forzado con lte→lt (método de la tarea); RED de 2.13 forzado con la mutación float, pero falla por formato ('0.3' vs '0.30'), no por deriva, porque Postgres suma en exacto antes de llegar a JS
