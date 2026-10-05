'use server'

import { exigirUsuarioId } from '@/server/auth/sesion'
import { crearCategoria } from './categorias'

export interface EstadoFormularioCategoria {
  errores?: Record<string, string[]>
  mensaje?: string
  valores?: {
    nombre?: string
    tipo?: string
  }
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

  let resultado
  try {
    resultado = await crearCategoria(usuarioId, datos)
  } catch {
    return {
      mensaje: 'No pudimos guardar la categoría. Inténtalo de nuevo.',
      valores: {
        nombre: String(datos.nombre ?? ''),
        tipo: String(datos.tipo ?? ''),
      },
    }
  }

  if (!resultado.ok) {
    return { errores: resultado.errores }
  }

  return { exito: true, idCreado: resultado.categoria.id }
}
