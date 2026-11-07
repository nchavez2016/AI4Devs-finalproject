import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { prisma } from '@/server/repositories/prisma'
import { calcularResumen } from '@/server/dashboard/dashboard'
import { listarCuentas } from '@/server/cuentas/cuentas'
import { verificar } from '@/server/auth/password'
import { crearCuentaDePrueba, registrar, registrarUsuarioDePrueba } from '@/test/bd/datos'
import { sembrar } from './sembrar'

const HOY = '2026-11-07'
const EMAIL_REVISOR = 'revisor@cuadre.test'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

describe('sembrar', () => {
  it('El seed crea al revisor con cuentas y movimientos del mes', async () => {
    await sembrar(HOY)

    const revisor = await prisma.usuario.findUniqueOrThrow({ where: { email: EMAIL_REVISOR } })
    expect(revisor.nombreNegocio).toBe('Negocio de prueba')

    const cuentas = await listarCuentas(revisor.id)
    expect(cuentas).toHaveLength(2)
    expect(await prisma.transaccion.count({ where: { usuarioId: revisor.id } })).toBe(5)

    const resumen = await calcularResumen(revisor.id, 'mes', HOY)
    expect(resumen.totalIngresos).toBe('1200.00')
    expect(resumen.totalGastos).toBe('571.00')

    const saldos = Object.fromEntries(cuentas.map((c) => [c.nombre, c.saldo]))
    expect(saldos['Banco Pichincha']).toBe('2100.00')
    expect(saldos['Caja chica']).toBe('129.00')
  })

  it('El revisor sembrado inicia sesión con la contraseña documentada', async () => {
    await sembrar(HOY)

    const revisor = await prisma.usuario.findUniqueOrThrow({ where: { email: EMAIL_REVISOR } })

    expect(await verificar('Revisor2026!', revisor.passwordHash)).toBe(true)
    expect(revisor.passwordHash).not.toContain('Revisor2026!')
  })

  it('Ejecutar el seed dos veces no duplica datos', async () => {
    await sembrar(HOY)
    await sembrar(HOY)

    expect(await prisma.usuario.count({ where: { email: EMAIL_REVISOR } })).toBe(1)
    const revisor = await prisma.usuario.findUniqueOrThrow({ where: { email: EMAIL_REVISOR } })
    expect(await prisma.cuenta.count({ where: { usuarioId: revisor.id } })).toBe(2)
    expect(await prisma.categoria.count({ where: { usuarioId: revisor.id } })).toBe(7)
    expect(await prisma.transaccion.count({ where: { usuarioId: revisor.id } })).toBe(5)
  })

  it('El seed restablece los datos que el revisor cambió', async () => {
    const revisorId = await sembrar(HOY)
    const caja = await prisma.cuenta.findFirstOrThrow({
      where: { usuarioId: revisorId, nombre: 'Caja chica' },
    })
    const categoria = await prisma.categoria.findFirstOrThrow({
      where: { usuarioId: revisorId, nombre: 'Insumos' },
    })
    await prisma.transaccion.create({
      data: {
        usuarioId: revisorId,
        cuentaId: caja.id,
        categoriaId: categoria.id,
        tipo: 'GASTO',
        monto: '99.99',
        fecha: new Date('2026-11-05T00:00:00Z'),
      },
    })

    await sembrar(HOY)

    expect(await prisma.transaccion.count({ where: { usuarioId: revisorId } })).toBe(5)
    expect(
      await prisma.transaccion.count({ where: { usuarioId: revisorId, monto: '99.99' } })
    ).toBe(0)
    const cuentas = await listarCuentas(revisorId)
    expect(cuentas.find((c) => c.nombre === 'Caja chica')?.saldo).toBe('129.00')
  })

  it('El seed no modifica los datos de otro usuario', async () => {
    const otroId = await registrarUsuarioDePrueba('Beto', 'beto@taller.ec')
    const cuentaId = await crearCuentaDePrueba(otroId, 'Banco Beto', '0.00')
    await registrar(otroId, {
      tipo: 'GASTO',
      monto: '500.00',
      fecha: '2026-11-03',
      cuentaId,
      categoria: 'Arriendo',
    })

    await sembrar(HOY)
    await sembrar(HOY)

    expect(await prisma.cuenta.count({ where: { usuarioId: otroId } })).toBe(1)
    expect(await prisma.categoria.count({ where: { usuarioId: otroId } })).toBe(7)
    const gastos = await prisma.transaccion.findMany({ where: { usuarioId: otroId } })
    expect(gastos).toHaveLength(1)
    expect(gastos[0].monto.toFixed(2)).toBe('500.00')

    const revisor = await prisma.usuario.findUniqueOrThrow({ where: { email: EMAIL_REVISOR } })
    expect(await prisma.cuenta.count({ where: { usuarioId: revisor.id, nombre: 'Banco Beto' } })).toBe(0)
    expect(await prisma.transaccion.count({ where: { usuarioId: revisor.id } })).toBe(5)
  })
})
