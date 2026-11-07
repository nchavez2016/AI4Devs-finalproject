# Progreso: dashboard

- Siguiente: 9.1 [HUMANO] revisión manual de /panel a 360 px y 1280 px con el checklist de UX; después 10.1 (lint, typecheck, suite y openspec validate)
- Decisiones: 0.1–0.6 la opción recomendada, semana de lunes a domingo | 0.7 autorizada y aplicada: panel.test.tsx modificado, src/server/panel.ts y panel.test.ts retirados (cubiertos por 5.13) | un commit por grupo, sin push (orden de la persona)
- Discrepancias: tests extra (periodo.test.ts, saldo de cada cuenta, categorías en el panel); REDs forzados por mutación en 2.10, 3.4, 3.7, 4.4, 5.7, 5.13; CabeceraPrivada.test.tsx y el test "El panel muestra el negocio..." adaptados a las nuevas props sin cambiar sus aserciones; el gráfico no se dibuja en jsdom (sin ResizeObserver): solo se prueban su etiqueta y la tabla, por eso el dibujo real queda para 9.1; npm run build correcto
