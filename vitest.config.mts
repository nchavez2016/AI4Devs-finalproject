process.env.TZ = 'America/Guayaquil'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { urlBaseDePrueba } from './src/test/bd/url'

// Prisma 7 no carga .env automáticamente (ver prisma.config.ts). Si no existe .env
// (CI), se usan las variables ya presentes en el entorno.
try {
  process.loadEnvFile()
} catch {}

// El globalSetup del proyecto "integracion" (tarea 1.15/1.16) crea y migra esta base.
const TEST_DATABASE_URL = urlBaseDePrueba()

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    server: {
      // next-auth (@auth/core) importa "next/server" como especificador sin extensión,
      // válido en el bundler de Next pero no para el resolutor ESM nativo de Node que
      // usa Vitest cuando externaliza un paquete. Se fuerza a Vite a procesarlo.
      deps: { inline: [/next-auth/, /@auth\/core/] }
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unidad',
		  testTimeout: 15000,
          hookTimeout: 15000,
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
          globalSetup: ['./src/test/bd/global-setup.ts'],
          env: {
            DATABASE_URL: TEST_DATABASE_URL,
            AUTH_SECRET: 'secreto-de-prueba-integracion-00000000000000',
          },
        },
      },
    ],
  },
})
