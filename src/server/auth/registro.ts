import { esquemaRegistro } from './esquemas'
import { usuarioRepository } from '@/server/repositories/usuarioRepository'

export type ResultadoRegistro =
  | {
      ok: true
      usuario: { id: string; nombre: string; nombreNegocio: string; email: string }
    }
  | { ok: false; errores: Record<string, string[]> }

function agruparErroresPorCampo(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const errores: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const campo = issue.path.join('.')
    errores[campo] ??= []
    errores[campo].push(issue.message)
  }

  return errores
}

export async function registrarUsuario(datosSinValidar: unknown): Promise<ResultadoRegistro> {
  const validacion = esquemaRegistro.safeParse(datosSinValidar)

  if (!validacion.success) {
    return { ok: false, errores: agruparErroresPorCampo(validacion.error) }
  }

  const datos = validacion.data

  const usuario = await usuarioRepository.crear({
    nombre: datos.nombre,
    nombreNegocio: datos.nombreNegocio,
    email: datos.email,
    passwordHash: datos.password,
  })

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
