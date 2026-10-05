'use server'

import { exigirUsuarioId } from '@/server/auth/sesion'
import { crearCategoria } from './categorias'

export interface EstadoFormularioCategoria {
  errores?: Record<string, string[]>
  exito?: boolean
  idCreado?: string
}

export async function crearCategoriaAccion(
  estadoPrevioOFormData: unknown,
  formDataOpcional?: FormData
): Promise<EstadoFormularioCategoria> {
  const usuarioId = await exigirUsuarioId()

  const formData =
    formDataOpcional instanceof FormData
      ? formDataOpcional
      : estadoPrevioOFormData instanceof FormData
        ? estadoPrevioOFormData
        : new FormData()

  const datos = {
    nombre: formData.get('nombre'),
    tipo: formData.get('tipo'),
  }

  const resultado = await crearCategoria(usuarioId, datos)

  if (!resultado.ok) {
    return { errores: resultado.errores }
  }

  return { exito: true, idCreado: resultado.categoria.id }
}
