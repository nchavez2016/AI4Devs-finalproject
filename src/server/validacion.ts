import { z } from 'zod'

export const esquemaNombre = z
  .string()
  .trim()
  .min(1, 'El nombre es obligatorio')
  .max(150, 'El nombre puede tener como máximo 150 caracteres')

export function agruparErroresPorCampo(error: {
  issues: { path: PropertyKey[]; message: string }[]
}): Record<string, string[]> {
  const errores: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const campo = issue.path.join('.')
    errores[campo] ??= []
    errores[campo].push(issue.message)
  }

  return errores
}
