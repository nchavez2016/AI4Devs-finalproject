import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { promisify } from 'node:util'
import { exigirBaseDePrueba } from './guardia'

const execFileAsync = promisify(execFile)
// Desde la raíz del proyecto (no import.meta.url): este módulo también lo carga Playwright
// como CommonJS, donde import.meta no existe.
const require = createRequire(`${process.cwd()}/package.json`)

/**
 * Aplica las migraciones (`prisma migrate deploy`) a una base de prueba. Prisma crea la
 * base si todavía no existe. Se niega a actuar si el nombre no termina en "_test".
 */
export async function aplicarMigraciones(url: string): Promise<void> {
  exigirBaseDePrueba(url)

  const cliPrisma = require.resolve('prisma/build/index.js')

  try {
    await execFileAsync(process.execPath, [cliPrisma, 'migrate', 'deploy'], {
      env: { ...process.env, DATABASE_URL: url },
    })
  } catch (error) {
    throw new Error(
      `No se pudieron aplicar las migraciones en la base de prueba. ${String(error)}`
    )
  }
}
