# Progreso: despliegue-y-ci
- Siguiente: 13.1 RED del script db:seed (package.json y prisma.config.ts)
- Decisiones: 0.1 migraciones a mano con URL directa; 0.2 seed mínimo; 0.3 build dentro del webServer; 0.4 SEED_CONFIRMAR_BASE; 0.5 tsx exacto aprobado
- Discrepancias: 9–12 sin RED natural (GREEN de 8 ya cubría), verificados por mutación: hash en claro rompe 9; sin borrados rompe 10, 11 y 12; borrar sin filtro por usuarioId rompe 12. El seed necesita AUTH_SECRET además de DATABASE_URL (env.ts); a documentar
