# Progreso: esquema-y-autenticacion

- Siguiente: 3.21 RED — src/server/auth/acciones.test.ts, "Cierre de sesión termina la sesión y redirige al login"
- Decisiones: proxy.ts vive en src/proxy.ts (junto a src/app, no en la raíz del repo); envuelve auth((req) => ...) y usa resolverRedireccion con req.auth (comprobación optimista de cookie)
- Discrepancias: ninguna
