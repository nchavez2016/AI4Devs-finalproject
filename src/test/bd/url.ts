const URL_POR_DEFECTO =
  'postgresql://cuadre:cuadre@localhost:5432/cuadre_test?schema=public'

/**
 * URL de la base de datos de prueba. Lee `TEST_DATABASE_URL` del entorno real
 * (variable de entorno o `.env`); si no está definida, usa la base local de
 * `docker-compose.yml` con nombre "cuadre_test".
 */
export function urlBaseDePrueba(): string {
  return process.env.TEST_DATABASE_URL ?? URL_POR_DEFECTO
}
