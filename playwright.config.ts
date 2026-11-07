import { defineConfig, devices } from '@playwright/test'
import { urlBaseDePrueba } from './src/test/bd/url'
import { comprobarBaseE2E } from './src/test/e2e/preparar-base-e2e'

// Igual que vitest.config.mts y prisma.config.ts: Node carga .env al ejecutar; sin .env
// (CI) se usan las variables del entorno o los valores por defecto locales.
try {
  process.loadEnvFile()
} catch {}

const PUERTO = 3100
const BASE_E2E = 'cuadre_e2e_test'

// Mismo servidor y credenciales que la base de integración, pero base propia para E2E.
const urlE2E = new URL(urlBaseDePrueba())
urlE2E.pathname = `/${BASE_E2E}`
const DATABASE_URL = urlE2E.toString()

// La guarda se aplica al cargar la configuración, es decir, antes de que Playwright
// arranque la app (el webServer arranca antes que el globalSetup).
comprobarBaseE2E(DATABASE_URL)

// El globalSetup (que crea y migra la base) corre en este mismo proceso.
process.env.E2E_DATABASE_URL = DATABASE_URL

export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/global-setup.ts',
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'movil-360',
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 800 } },
    },
  ],
  webServer: {
    // Build de producción + start. Tarda: el primer arranque compila la app.
    command: `npm run build && npx next start -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}/login`,
    reuseExistingServer: false,
    timeout: 300_000,
    env: {
      DATABASE_URL,
      // Valor ficticio de prueba (mínimo 32 caracteres); no es un secreto real.
      AUTH_SECRET: 'secreto-de-prueba-e2e-00000000000000000000',
      AUTH_URL: `http://localhost:${PUERTO}`,
      AUTH_TRUST_HOST: 'true',
    },
  },
})
