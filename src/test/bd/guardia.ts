/**
 * Se niega a devolver el nombre de la base si la URL no apunta a una base de prueba.
 * No conecta a la base de datos: solo analiza la URL.
 */
export function exigirBaseDePrueba(url: string): string {
  const nombreBase = new URL(url).pathname.replace(/^\//, '')

  if (!nombreBase.endsWith('_test')) {
    throw new Error(
      `Se niega a actuar sobre "${nombreBase}": el nombre de la base debe terminar en "_test".`
    )
  }

  return nombreBase
}
