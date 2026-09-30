import { esquemaCredenciales } from './esquemas'
import { verificar } from './password'
import { usuarioRepository } from '@/server/repositories/usuarioRepository'

// Mismo mensaje ante cualquier fallo: no revela si el email existe (spec: "Inicio de
// sesión con credenciales").
const MENSAJE_CREDENCIALES_INCORRECTAS = 'Email o contraseña incorrectos'

// Hash con el formato válido de password.ts, usado cuando el email no existe: ejecutar
// scrypt igualmente evita que el tiempo de respuesta revele si el email está registrado.
const HASH_FICTICIO = `scrypt$16384$8$1$${Buffer.alloc(16).toString('base64')}$${Buffer.alloc(64).toString('base64')}`

export type ResultadoCredenciales =
  | {
      ok: true
      usuario: { id: string; nombre: string; nombreNegocio: string; email: string }
    }
  | { ok: false; mensaje: string }

export async function verificarCredenciales(
  datosSinValidar: unknown
): Promise<ResultadoCredenciales> {
  const validacion = esquemaCredenciales.safeParse(datosSinValidar)

  if (!validacion.success) {
    return { ok: false, mensaje: MENSAJE_CREDENCIALES_INCORRECTAS }
  }

  const { email, password } = validacion.data
  const usuario = await usuarioRepository.buscarPorEmail(email)

  if (!usuario) {
    await verificar(password, HASH_FICTICIO)
    return { ok: false, mensaje: MENSAJE_CREDENCIALES_INCORRECTAS }
  }

  const coincide = await verificar(password, usuario.passwordHash)

  if (!coincide) {
    return { ok: false, mensaje: MENSAJE_CREDENCIALES_INCORRECTAS }
  }

  return {
    ok: true,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      nombreNegocio: usuario.nombreNegocio,
      email: usuario.email,
    },
  }
}
