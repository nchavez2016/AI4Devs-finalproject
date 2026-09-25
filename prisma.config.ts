import { defineConfig, env } from "prisma/config";

// Prisma 7 no carga .env automáticamente. Usamos el cargador nativo de Node;
// si no existe .env (CI, Vercel), se usan las variables del entorno.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
