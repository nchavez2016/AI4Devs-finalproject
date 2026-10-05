import { beforeEach, describe, expect, it, vi } from 'vitest'

const authSimulado = vi.fn()
const redirectSimulado = vi.fn()
const crearCuentaSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectSimulado(url),
}))

vi.mock('./cuentas', () => ({
  crearCuenta: (...args: unknown[]) => crearCuentaSimulado(...args),
}))

describe('crearCuentaAccion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('La cuenta se crea siempre para el usuario de la sesión', async () => {
    authSimulado.mockResolvedValue({
      user: { id: 'usuario-a' },
    })
    crearCuentaSimulado.mockResolvedValue({
      ok: true,
      cuenta: {
        id: 'c1',
        nombre: 'Banco Pichincha',
        tipo: 'BANCO',
        saldo: '500.00',
        creadoEn: new Date(),
      },
    })

    const { crearCuentaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('usuarioId', 'usuario-b')
    formData.set('nombre', 'Banco Pichincha')
    formData.set('tipo', 'BANCO')
    formData.set('saldoInicial', '500.00')

    await crearCuentaAccion(undefined, formData)

    expect(crearCuentaSimulado).toHaveBeenCalledWith('usuario-a', {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })
  })

  it('Crear una cuenta sin sesión redirige al login', async () => {
    authSimulado.mockResolvedValue(null)
    redirectSimulado.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    const { crearCuentaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('nombre', 'Banco Pichincha')
    formData.set('tipo', 'BANCO')
    formData.set('saldoInicial', '500.00')

    await expect(crearCuentaAccion(undefined, formData)).rejects.toThrow('NEXT_REDIRECT')

    expect(redirectSimulado).toHaveBeenCalledWith('/login')
    expect(crearCuentaSimulado).not.toHaveBeenCalled()
  })
})
