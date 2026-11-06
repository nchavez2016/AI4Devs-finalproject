'use server'

import { revalidatePath } from 'next/cache'
import { exigirUsuarioId } from '@/server/auth/sesion'
import { registrarTransaccion } from './transacciones'

export interface EstadoFormularioTransaccion {
  errores?: Record<string, string[]>
  mensaje?: string
  valores?: {
    tipo?: string
    monto?: string
    fecha?: string
    cuentaId?: string
    categoriaId?: string
    descripcion?: string
  }
  exito?: boolean
  idCreado?: string
  creado?: { tipo: string; monto: string; cuentaNombre: string }
}

export async function registrarTransaccionAccion(
  estadoPrevioOFormData: unknown,
  formDataOpcional?: FormData
): Promise<EstadoFormularioTransaccion> {
  const usuarioId = await exigirUsuarioId()

  const formData =
    formDataOpcional instanceof FormData
      ? formDataOpcional
      : estadoPrevioOFormData instanceof FormData
        ? estadoPrevioOFormData
        : new FormData()

  // Solo se leen las claves esperadas: el dueño sale de la sesión, nunca del formulario.
  const datos = {
    tipo: formData.get('tipo'),
    monto: formData.get('monto'),
    fecha: formData.get('fecha'),
    cuentaId: formData.get('cuentaId'),
    categoriaId: formData.get('categoriaId'),
    descripcion: formData.get('descripcion'),
  }

  let resultado
  try {
    resultado = await registrarTransaccion(usuarioId, datos)
  } catch {
    return {
      mensaje: 'No pudimos guardar la transacción. Inténtalo de nuevo.',
      valores: {
        tipo: String(datos.tipo ?? ''),
        monto: String(datos.monto ?? ''),
        fecha: String(datos.fecha ?? ''),
        cuentaId: String(datos.cuentaId ?? ''),
        categoriaId: String(datos.categoriaId ?? ''),
        descripcion: String(datos.descripcion ?? ''),
      },
    }
  }

  if (!resultado.ok) {
    return { errores: resultado.errores }
  }

  revalidatePath('/transacciones')
  const { transaccion } = resultado
  return {
    exito: true,
    idCreado: transaccion.id,
    creado: {
      tipo: transaccion.tipo,
      monto: transaccion.monto,
      cuentaNombre: transaccion.cuenta.nombre,
    },
  }
}
