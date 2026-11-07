# Progreso: despliegue-y-ci
- Siguiente: 15.1 docs/despliegue.md
- Decisiones: 0.1 migraciones a mano con URL directa; 0.2 seed mínimo; 0.3 build dentro del webServer; 0.4 SEED_CONFIRMAR_BASE; 0.5 tsx exacto aprobado (4.23.15, en AGENTS.md)
- Discrepancias: 14.1 el primer GREEN falló por un fallo del propio test (rebanaba el paso desde uses: y el if: va antes); corregido el test, no el YAML. CI no ejecutado aún en GitHub (tarea 16.5, humano)
