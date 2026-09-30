import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/server/repositories/prisma'
import { limpiarBD } from './limpiar'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

describe('base de integración', () => {
  it('la base de integración es la de prueba y está vacía', async () => {
    expect(process.env.DATABASE_URL).toContain('_test')

    const usuarios = await prisma.usuario.findMany()

    expect(usuarios).toHaveLength(0)
  })
})
