# Progreso: esquema-y-autenticacion

- Siguiente: 2.4 RED — "La contraseña se guarda con hash y nunca en texto plano"
- Decisiones: registrarUsuario devuelve { ok, usuario } o { ok:false, errores } (Zod safeParse); passwordHash aún guarda el texto plano, lo corrige 2.5
- Discrepancias: ninguna
