import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { promisify } from 'node:util'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { exigirBaseDePrueba } from './guardia'
import { urlBaseDePrueba } from './url'

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)

/** URL al mismo servidor, pero a la base "postgres" (siempre existe), para poder
 * crear la base de prueba si todavía no existe. */
function urlDeAdministracion(url: string): string {
  const administracion = new URL(url)
  administracion.pathname = '/postgres'
  return administracion.toString()
}

export async function crearBaseSiNoExiste(url: string): Promise<void> {
  const nombreBase = exigirBaseDePrueba(url)

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(nombreBase)) {
    throw new Error(`Nombre de base de datos de prueba inválido: "${nombreBase}"`)
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: urlDeAdministracion(url) }),
  })

  try {
    const existentes = await prisma.$queryRawUnsafe<Array<{ existe: number }>>(
      'SELECT 1 AS existe FROM pg_database WHERE datname = $1',
      nombreBase
    )

    if (existentes.length === 0) {
      await prisma.$executeRawUnsafe(`CREATE DATABASE "${nombreBase}"`)
    }
  } catch (error) {
    throw new Error(
      `No se pudo preparar la base de datos de prueba "${nombreBase}". ` +
        `¿Está el contenedor de Docker levantado ("docker compose up -d")? ${String(error)}`
    )
  } finally {
    await prisma.$disconnect()
  }
}

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

export default async function setup(): Promise<void> {
  const url = urlBaseDePrueba()

  await crearBaseSiNoExiste(url)
  await aplicarMigraciones(url)
}
