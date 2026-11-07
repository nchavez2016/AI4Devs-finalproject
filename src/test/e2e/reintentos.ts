/** Reintentos de la suite E2E: 2 en integración continua (CI definida), 0 en local. */
export function reintentosE2E(entorno: Record<string, string | undefined>): number {
  return entorno.CI ? 2 : 0
}
