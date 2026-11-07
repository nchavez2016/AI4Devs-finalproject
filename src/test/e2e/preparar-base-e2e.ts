import { exigirBaseDePrueba } from '../bd/guardia'
import { aplicarMigraciones, crearBaseSiNoExiste } from '../bd/global-setup'

/**
 * Prepara la base de datos de la suite E2E: comprueba que su nombre termine en "_test"
 * antes de conectar a nada y, solo entonces, la crea si no existe y aplica las migraciones.
 */
export async function prepararBaseE2E(url: string): Promise<string> {
  const nombreBase = exigirBaseDePrueba(url)

  await crearBaseSiNoExiste(url)
  await aplicarMigraciones(url)

  return nombreBase
}
