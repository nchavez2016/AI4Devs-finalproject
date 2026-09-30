import { prisma } from './prisma'

interface DatosCrearUsuario {
  nombre: string
  nombreNegocio: string
  email: string
  passwordHash: string
}

export const usuarioRepository = {
  async crear(datos: DatosCrearUsuario) {
    return prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        nombreNegocio: datos.nombreNegocio,
        email: datos.email,
        passwordHash: datos.passwordHash,
      },
    })
  },
}
