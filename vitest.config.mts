process.env.TZ = 'America/Guayaquil'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Prisma 7 no carga .env automáticamente (ver prisma.config.ts). Si no existe .env
// (CI), se usan las variables ya presentes en el entorno.
try {
  process.loadEnvFile()
} catch {}

// Valor por defecto: la base local de docker-compose.yml, con nombre "cuadre_test".
// El globalSetup del proyecto "integracion" (tarea 1.15/1.16) la crea y migra.
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://cuadre:cuadre@localhost:5432/cuadre_test?schema=public'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unidad',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
          exclude: ['**/*.int.test.ts'],
          env: {
            // Valores ficticios: los módulos que validan su configuración al
            // importarse (src/config/env.ts) necesitan estas variables, pero los
            // tests unitarios no tocan una base de datos real.
            DATABASE_URL:
              'postgresql://cuadre:cuadre@localhost:5432/cuadre_test_unidad?schema=public',
            AUTH_SECRET: 'secreto-de-prueba-unidad-00000000000000',
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'integracion',
          environment: 'node',
          include: ['src/**/*.int.test.ts'],
          // Serie: comparten la misma base de datos de prueba, que se vacía entre tests.
          fileParallelism: false,
          env: {
            DATABASE_URL: TEST_DATABASE_URL,
            AUTH_SECRET: 'secreto-de-prueba-integracion-00000000000000',
          },
        },
      },
    ],
  },
})
