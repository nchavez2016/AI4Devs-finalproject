'use server'

import { CredentialsSignin } from 'next-auth'
import { signIn, signOut } from '@/auth'
import { registrarUsuario } from './registro'

// Mismo mensaje que credenciales.ts: no revela si el email existe.
const MENSAJE_CREDENCIALES_INCORRECTAS = 'Email o contraseña incorrectos'
const MENSAJE_ERROR_INESPERADO = 'No pudimos iniciar tu sesión. Inténtalo de nuevo.'

function esErrorDeRedireccion(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}

export interface EstadoFormularioRegistro {
  errores: Record<string, string[]>
}

export async function registrar(
  _estadoPrevio: EstadoFormularioRegistro | undefined,
  formData: FormData
): Promise<EstadoFormularioRegistro> {
  const datos = {
    nombre: formData.get('nombre'),
    nombreNegocio: formData.get('nombreNegocio'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const resultado = await registrarUsuario(datos)

  if (!resultado.ok) {
    return { errores: resultado.errores }
  }

  await signIn('credentials', {
    email: datos.email,
    password: datos.password,
    redirectTo: '/panel',
  })

  return { errores: {} }
}

export interface EstadoFormularioLogin {
  mensaje?: string
}

export async function iniciarSesion(
  _estadoPrevio: EstadoFormularioLogin | undefined,
  formData: FormData
): Promise<EstadoFormularioLogin> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/panel',
    })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { mensaje: MENSAJE_CREDENCIALES_INCORRECTAS }
    }

    // signIn() con redirectTo lanza esta misma excepción cuando SÍ tiene éxito,
    // para ejecutar la redirección; no es un error y no debe atraparse.
    if (esErrorDeRedireccion(error)) {
      throw error
    }

    return { mensaje: MENSAJE_ERROR_INESPERADO }
  }

  return {}
}

export async function cerrarSesion() {
  await signOut({ redirectTo: '/login' })
}
