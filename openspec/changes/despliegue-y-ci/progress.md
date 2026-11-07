# Progreso: despliegue-y-ci
- Siguiente: 14.1 RED del workflow de CI (src/config/ci.test.ts)
- Decisiones: 0.1 migraciones a mano con URL directa; 0.2 seed mínimo; 0.3 build dentro del webServer; 0.4 SEED_CONFIRMAR_BASE; 0.5 tsx exacto aprobado (4.23.15, en AGENTS.md)
- Discrepancias: db:seed necesita AUTH_SECRET además de DATABASE_URL (env.ts); npm avisa de que el postinstall de esbuild no se ejecuta (allow-scripts), tsx funciona igual; seed verificado dos veces contra la base local cuadre, panel no abierto en navegador
