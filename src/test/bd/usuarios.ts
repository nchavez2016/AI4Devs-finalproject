import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { exigirBaseDePrueba } from './guardia'

interface DatosUsuarioSinCategorias {
  nombre: string
  nombreNegocio: string
  email: string
}

/**
 * Crea un usuario sin las categorías por defecto, para que un test controle por
 * completo qué categorías existen. Solo actúa sobre la base de prueba.
 */
export async function crearUsuarioSinCategorias(
  url: string,
  datos: DatosUsuarioSinCategorias
): Promise<string> {
  exigirBaseDePrueba(url)

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        nombreNegocio: datos.nombreNegocio,
        email: datos.email,
        passwordHash: 'no-usar-en-login',
      },
    })
    return usuario.id
  } finally {
    await prisma.$disconnect()
  }
}
