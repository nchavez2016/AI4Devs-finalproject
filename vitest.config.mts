process.env.TZ = 'America/Guayaquil'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    env: {
      // Valores ficticios para que los módulos que validan su configuración al
      // importarse (src/config/env.ts) no fallen en los tests unitarios.
      // La tarea 1.14 los reorganiza por proyecto sin cambiar el valor.
      DATABASE_URL: 'postgresql://cuadre:cuadre@localhost:5432/cuadre_test_unidad?schema=public',
      AUTH_SECRET: 'secreto-de-prueba-unidad-00000000000000',
    },
  },
})
