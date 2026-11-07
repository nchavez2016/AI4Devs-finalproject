/**
 * Exige que la confirmación sea exactamente el nombre de la base a la que apunta la URL.
 * No conecta a la base de datos: solo analiza la URL. Devuelve el nombre de la base aceptada.
 */
export function comprobarDestinoSemilla(url: string, confirmacion: string | undefined): string {
  const nombreBase = new URL(url).pathname.replace(/^\//, '')

  if (!confirmacion) {
    throw new Error(
      `El seed apunta a la base "${nombreBase}" y no está confirmada. ` +
        `Define SEED_CONFIRMAR_BASE=${nombreBase} para continuar.`
    )
  }

  if (confirmacion !== nombreBase) {
    throw new Error(
      `El seed apunta a la base "${nombreBase}" pero SEED_CONFIRMAR_BASE es "${confirmacion}". ` +
        'No se modifica nada.'
    )
  }

  return nombreBase
}
