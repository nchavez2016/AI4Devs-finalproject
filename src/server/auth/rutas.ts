/** Rutas accesibles sin sesión activa. */
const RUTAS_PUBLICAS = ['/login', '/registro']

/**
 * Decide a dónde redirigir una petición, según si hay sesión activa. Función pura,
 * sin acceso a la red ni a cookies: proxy.ts le pasa el resultado de una comprobación
 * optimista de la cookie de sesión (design.md, decisión c).
 */
export function resolverRedireccion(pathname: string, haySesion: boolean): string | null {
  if (RUTAS_PUBLICAS.includes(pathname)) {
    return null
  }

  if (!haySesion) {
    return '/login'
  }

  return null
}
