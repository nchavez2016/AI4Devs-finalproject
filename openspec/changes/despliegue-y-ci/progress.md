# Progreso: despliegue-y-ci
- Hecho: 18.4 comprobado, el job verificar de CI pasa en verde en GitHub con typecheck en clon limpio
- Siguiente: despliegue en Vercel y URL de producción; marcar el grupo 16 [HUMANO]; después /opsx:verify y archivar
- Decisiones: 0.1 migraciones a mano con URL directa; 0.2 seed mínimo; 0.3 build dentro del webServer; 0.4 SEED_CONFIRMAR_BASE; 0.5 tsx exacto aprobado (4.23.15, en AGENTS.md)
- Discrepancias: el primer CI falló en typecheck (LayoutProps sin .next/types); resuelto en grupo 18 con next typegen; quedan menciones a tsc suelto en AGENTS.md, openspec/config.yaml y antigravity-adapter.mjs (ver design.md, Riesgos); readme 1.5 usa "Cooperativa Andina" porque el seed ya crea "Banco Pichincha"