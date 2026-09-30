import { describe, expect, it, vi } from 'vitest'

const signOutSimulado = vi.fn()
const signInSimulado = vi.fn()
const registrarUsuarioSimulado = vi.fn()

vi.mock('@/auth', () => ({
  signOut: signOutSimulado,
  signIn: signInSimulado,
}))

vi.mock('./registro', () => ({
  registrarUsuario: registrarUsuarioSimulado,
}))

describe('cerrarSesion', () => {
  it('Cierre de sesión termina la sesión y redirige al login', async () => {
    const { cerrarSesion } = await import('./acciones')

    await cerrarSesion()

    expect(signOutSimulado).toHaveBeenCalledWith({ redirectTo: '/login' })
  })
})

describe('registrar', () => {
  it('registrar devuelve los errores por campo del caso de uso', async () => {
    registrarUsuarioSimulado.mockResolvedValue({
      ok: false,
      errores: { email: ['Ese email ya está registrado'] },
    })

    const { registrar } = await import('./acciones')

    const formData = new FormData()
    formData.set('nombre', 'Ana')
    formData.set('nombreNegocio', 'Tienda Ana')
    formData.set('email', 'ana@tienda.ec')
    formData.set('password', 'clave-segura-1')

    const estado = await registrar(undefined, formData)

    expect(estado.errores).toEqual({ email: ['Ese email ya está registrado'] })
    expect(signInSimulado).not.toHaveBeenCalled()
  })
})
