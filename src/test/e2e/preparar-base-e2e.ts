import { exigirBaseDePrueba } from '../bd/guardia'
import { aplicarMigraciones, crearBaseSiNoExiste } from '../bd/global-setup'

/** Comprueba, sin conectar, que la URL apunta a una base "_test" y devuelve su nombre. */
export function comprobarBaseE2E(url: string): string {
  return exigirBaseDePrueba(url)
}

/**
 * Prepara la base de datos de la suite E2E: comprueba que su nombre termine en "_test"
 * antes de conectar a nada y, solo entonces, la crea si no existe y aplica las migraciones.
 */
export async function prepararBaseE2E(url: string): Promise<string> {
  const nombreBase = comprobarBaseE2E(url)

  await crearBaseSiNoExiste(url)
  await aplicarMigraciones(url)

  return nombreBase
}
