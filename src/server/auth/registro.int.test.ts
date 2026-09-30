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

  it('La contraseña se guarda con hash y nunca en texto plano', async () => {
    await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    await registrarUsuario({
      nombre: 'Beto',
      nombreNegocio: 'Taller Beto',
      email: 'beto@taller.ec',
      password: 'clave-segura-1',
    })

    const ana = await prisma.usuario.findUnique({ where: { email: 'ana@tienda.ec' } })
    const beto = await prisma.usuario.findUnique({ where: { email: 'beto@taller.ec' } })

    expect(ana?.passwordHash).not.toContain('clave-segura-1')
    expect(beto?.passwordHash).not.toContain('clave-segura-1')
    expect(ana?.passwordHash).not.toBe(beto?.passwordHash)
  })

  it('Registro rechazado por email duplicado', async () => {
    await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })

    const resultado = await registrarUsuario({
      nombre: 'Otra Ana',
      nombreNegocio: 'Otro negocio',
      email: ' ANA@Tienda.ec ',
      password: 'otra-clave-99',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.email).toEqual(['Ese email ya está registrado'])
    }

    const usuarios = await prisma.usuario.findMany({ where: { email: 'ana@tienda.ec' } })
    expect(usuarios).toHaveLength(1)

    const categorias = await prisma.categoria.count()
    expect(categorias).toBe(0)
  })

  it('Registro rechazado por datos inválidos', async () => {
    const resultado = await registrarUsuario({
      nombre: '',
      nombreNegocio: '   ',
      email: 'no-es-un-email',
      password: '1234567',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toBeDefined()
      expect(resultado.errores.nombreNegocio).toBeDefined()
      expect(resultado.errores.email).toBeDefined()
      expect(resultado.errores.password).toBeDefined()
    }

    const usuarios = await prisma.usuario.findMany()
    expect(usuarios).toHaveLength(0)
  })
})
