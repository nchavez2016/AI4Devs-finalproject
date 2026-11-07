import { exigirBaseDePrueba } from '../bd/guardia'
import { aplicarMigraciones } from '../bd/migraciones'

/** Comprueba, sin conectar, que la URL apunta a una base "_test" y devuelve su nombre. */
export function comprobarBaseE2E(url: string): string {
  return exigirBaseDePrueba(url)
}

/**
 * Prepara la base de datos de la suite E2E: comprueba que su nombre termine en "_test"
 * antes de conectar a nada y, solo entonces, aplica las migraciones. `migrate deploy`
 * crea la base si no existe; no se importa el cliente Prisma porque Playwright carga
 * este módulo como CommonJS y el cliente generado solo funciona como ESM.
 */
export async function prepararBaseE2E(url: string): Promise<string> {
  const nombreBase = comprobarBaseE2E(url)

  await aplicarMigraciones(url)

  return nombreBase
}
