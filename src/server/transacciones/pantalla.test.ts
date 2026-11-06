import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cargarTransacciones } from './pantalla'

vi.mock('@/auth', () => ({
  auth: () => Promise.resolve({ user: { id: 'usr_a' } }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('./transacciones', () => ({
  listarTransacciones: () => Promise.resolve([]),
}))

vi.mock('@/server/cuentas/cuentas', () => ({
  listarCuentas: () => Promise.resolve([]),
}))

vi.mock('@/server/categorias/categorias', () => ({
  listarCategorias: () => Promise.resolve({ ingreso: [], gasto: [] }),
}))

describe('cargarTransacciones', () => {
  beforeEach(() => {
    // Solo se simula Date: las promesas y los temporizadores siguen reales.
    vi.useFakeTimers({ toFake: ['Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Fecha del formulario empieza en el día de hoy', async () => {
    // 04:30 UTC del 29 de septiembre son las 23:30 del 28 en Ecuador (UTC-5).
    vi.setSystemTime(new Date('2026-09-29T04:30:00Z'))

    const datos = await cargarTransacciones({})

    expect(datos.hoy).toBe('2026-09-28')
  })
})
