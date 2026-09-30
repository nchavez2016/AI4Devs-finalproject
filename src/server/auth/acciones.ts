'use server'

import { CredentialsSignin } from 'next-auth'
import { signIn, signOut } from '@/auth'
import { registrarUsuario } from './registro'

// Mismo mensaje que credenciales.ts: no revela si el email existe.
const MENSAJE_CREDENCIALES_INCORRECTAS = 'Email o contraseña incorrectos'

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

    throw error
  }

  return {}
}

export async function cerrarSesion() {
  await signOut({ redirectTo: '/login' })
}
