import { beforeEach, describe, expect, it } from 'vitest'
import { registrarUsuario } from './registro'
import { prisma } from '@/server/repositories/prisma'
import { limpiarBD } from '@/test/bd/limpiar'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

describe('registrarUsuario', () => {
  it('Registro válido crea el usuario', async () => {
    const resultado = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })

    expect(resultado.ok).toBe(true)

    const usuario = await prisma.usuario.findUnique({ where: { email: 'ana@tienda.ec' } })
    expect(usuario?.nombre).toBe('Ana')
    expect(usuario?.nombreNegocio).toBe('Tienda Ana')
  })
})
