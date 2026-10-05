import { esquemaRegistro } from './esquemas'
import { hashear } from './password'
import { EmailDuplicadoError, usuarioRepository } from '@/server/repositories/usuarioRepository'
import { agruparErroresPorCampo } from '@/server/validacion'

export type ResultadoRegistro =
  | {
      ok: true
      usuario: { id: string; nombre: string; nombreNegocio: string; email: string }
    }
  | { ok: false; errores: Record<string, string[]> }

export async function registrarUsuario(datosSinValidar: unknown): Promise<ResultadoRegistro> {
  const validacion = esquemaRegistro.safeParse(datosSinValidar)

  if (!validacion.success) {
    return { ok: false, errores: agruparErroresPorCampo(validacion.error) }
  }

  const datos = validacion.data
  const passwordHash = await hashear(datos.password)

  let usuario
  try {
    usuario = await usuarioRepository.crear({
      nombre: datos.nombre,
      nombreNegocio: datos.nombreNegocio,
      email: datos.email,
      passwordHash,
    })
  } catch (error) {
    if (error instanceof EmailDuplicadoError) {
      return { ok: false, errores: { email: ['Ese email ya está registrado'] } }
    }

    throw error
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
