# Progreso: esquema-y-autenticacion

- Siguiente: 3.15 RED — src/server/auth/rutas.test.ts, "Ruta privada sin sesión redirige al login"
- Decisiones: authConfig se exporta separado de NextAuth(authConfig) para probar los callbacks sin servidor ni BD; vitest.config.mts añade server.deps.inline para next-auth/@auth/core (importan "next/server" sin extensión, Node ESM puro no lo resuelve)
- Discrepancias: ninguna
