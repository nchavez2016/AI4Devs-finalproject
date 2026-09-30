import { describe, expect, it, vi } from 'vitest'

const signOutSimulado = vi.fn()

vi.mock('@/auth', () => ({
  signOut: signOutSimulado,
}))

describe('cerrarSesion', () => {
  it('Cierre de sesión termina la sesión y redirige al login', async () => {
    const { cerrarSesion } = await import('./acciones')

    await cerrarSesion()

    expect(signOutSimulado).toHaveBeenCalledWith({ redirectTo: '/login' })
  })
})
