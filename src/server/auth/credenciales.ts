import { esquemaCredenciales } from './esquemas'
import { verificar } from './password'
import { usuarioRepository } from '@/server/repositories/usuarioRepository'

export type ResultadoCredenciales =
  | {
      ok: true
      usuario: { id: string; nombre: string; nombreNegocio: string; email: string }
    }
  | { ok: false }

export async function verificarCredenciales(
  datosSinValidar: unknown
): Promise<ResultadoCredenciales> {
  const validacion = esquemaCredenciales.safeParse(datosSinValidar)

  if (!validacion.success) {
    return { ok: false }
  }

  const { email, password } = validacion.data
  const usuario = await usuarioRepository.buscarPorEmail(email)

  if (!usuario) {
    return { ok: false }
  }

  const coincide = await verificar(password, usuario.passwordHash)

  if (!coincide) {
    return { ok: false }
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
