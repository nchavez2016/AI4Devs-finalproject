# Progreso: dashboard

- Siguiente: 8.1 RED "Dashboard en carga muestra un esqueleto ocupado" (estados.test.tsx)
- Decisiones: 0.1–0.6 la opción recomendada, semana de lunes a domingo | 0.7 autorizada y aplicada: panel.test.tsx modificado, src/server/panel.ts y panel.test.ts retirados (cubiertos por 5.13) | un commit por grupo, sin push (orden de la persona)
- Discrepancias: tests extra (periodo.test.ts, saldo de cada cuenta, categorías en el panel); REDs forzados por mutación en 2.10, 3.4, 3.7, 4.4, 5.7, 5.13; CabeceraPrivada.test.tsx y el test "El panel muestra el negocio..." se adaptaron a las nuevas props/origen de datos sin cambiar sus aserciones; hrefs del selector son /panel?periodo=... (spec ajustada); el gráfico no se dibuja en jsdom (sin ResizeObserver), solo se prueban su etiqueta y la tabla
