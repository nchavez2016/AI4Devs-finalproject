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
