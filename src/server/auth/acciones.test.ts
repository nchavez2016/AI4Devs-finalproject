import { describe, expect, it, vi } from 'vitest'
import { CredentialsSignin } from 'next-auth'

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

describe('iniciarSesion', () => {
  it('mapea el CredentialsSignin al mensaje genérico', async () => {
    signInSimulado.mockRejectedValue(new CredentialsSignin())

    const { iniciarSesion } = await import('./acciones')

    const formData = new FormData()
    formData.set('email', 'ana@tienda.ec')
    formData.set('password', 'otra-clave-99')

    const estado = await iniciarSesion(undefined, formData)

    expect(estado.mensaje).toBe('Email o contraseña incorrectos')
  })

  it('iniciarSesion convierte un error inesperado en un mensaje genérico', async () => {
    signInSimulado.mockRejectedValue(new Error('la base de datos no responde'))

    const { iniciarSesion } = await import('./acciones')

    const formData = new FormData()
    formData.set('email', 'ana@tienda.ec')
    formData.set('password', 'otra-clave-99')

    const estado = await iniciarSesion(undefined, formData)

    expect(estado.mensaje).toBe('No pudimos iniciar tu sesión. Inténtalo de nuevo.')
  })

  it('iniciarSesion deja pasar la redirección de un inicio de sesión exitoso', async () => {
    const errorDeRedireccion = Object.assign(new Error('NEXT_REDIRECT'), {
      digest: 'NEXT_REDIRECT;push;/panel;307;',
    })
    signInSimulado.mockRejectedValue(errorDeRedireccion)

    const { iniciarSesion } = await import('./acciones')

    const formData = new FormData()
    formData.set('email', 'ana@tienda.ec')
    formData.set('password', 'otra-clave-99')

    await expect(iniciarSesion(undefined, formData)).rejects.toBe(errorDeRedireccion)
  })
})
