'use server'

import { revalidatePath } from 'next/cache'
import { exigirUsuarioId } from '@/server/auth/sesion'
import { crearCuenta } from './cuentas'

export interface EstadoFormularioCuenta {
  errores?: Record<string, string[]>
  mensaje?: string
  valores?: {
    nombre?: string
    tipo?: string
    saldoInicial?: string
  }
  exito?: boolean
  idCreado?: string
}

export async function crearCuentaAccion(
  estadoPrevioOFormData: unknown,
  formDataOpcional?: FormData
): Promise<EstadoFormularioCuenta> {
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
    saldoInicial: formData.get('saldoInicial'),
  }

  let resultado
  try {
    resultado = await crearCuenta(usuarioId, datos)
  } catch {
    return {
      mensaje: 'No pudimos guardar la cuenta. Inténtalo de nuevo.',
      valores: {
        nombre: String(datos.nombre ?? ''),
        tipo: String(datos.tipo ?? ''),
        saldoInicial: String(datos.saldoInicial ?? ''),
      },
    }
  }

  if (!resultado.ok) {
    return { errores: resultado.errores }
  }

  revalidatePath('/cuentas')
  return { exito: true, idCreado: resultado.cuenta.id }
}
