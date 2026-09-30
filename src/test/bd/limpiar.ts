import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { exigirBaseDePrueba } from './guardia'

const TABLAS = ['transacciones', 'categorias', 'cuentas', 'usuarios']

/**
 * Vacía todas las tablas de la base de datos de prueba. Se niega a actuar si la URL
 * no apunta a una base cuyo nombre termina en "_test", sin intentar conectar.
 */
export async function limpiarBD(url: string): Promise<void> {
  exigirBaseDePrueba(url)

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${TABLAS.map((tabla) => `"${tabla}"`).join(', ')} RESTART IDENTITY CASCADE`
    )
  } finally {
    await prisma.$disconnect()
  }
}
