import { describe, expect, it, vi } from 'vitest'

const { authSimulado, redirectSimulado } = vi.hoisted(() => ({
  authSimulado: vi.fn(),
  redirectSimulado: vi.fn((ruta: string) => {
    throw new Error(`NEXT_REDIRECT:${ruta}`)
  }),
}))

vi.mock('@/auth', () => ({
  auth: authSimulado,
}))

vi.mock('next/navigation', () => ({
  redirect: redirectSimulado,
}))

describe('cargarPanel', () => {
  it('Caracterización: cargarPanel sin sesión redirige al login', async () => {
    authSimulado.mockResolvedValue(null)

    const { cargarPanel } = await import('./panel')

    await expect(cargarPanel()).rejects.toThrow('NEXT_REDIRECT:/login')
    expect(redirectSimulado).toHaveBeenCalledWith('/login')
  })
})
