import { prepararBaseE2E } from '../src/test/e2e/preparar-base-e2e'

/** Crea (si hace falta) y migra la base E2E. La URL la fija playwright.config.ts. */
export default async function globalSetup(): Promise<void> {
  const url = process.env.E2E_DATABASE_URL

  if (!url) {
    throw new Error('Falta E2E_DATABASE_URL: ejecuta la suite con "npm run test:e2e".')
  }

  await prepararBaseE2E(url)
}
