export const SECCIONES = [
  { href: '/panel', etiqueta: 'Panel' },
  { href: '/cuentas', etiqueta: 'Cuentas' },
  { href: '/categorias', etiqueta: 'Categorías' },
] as const

export type HrefSeccion = (typeof SECCIONES)[number]['href']

export function seccionActiva(ruta: string | null): HrefSeccion | null {
  const seccion = SECCIONES.find(
    (candidata) => ruta === candidata.href || ruta?.startsWith(`${candidata.href}/`)
  )
  return seccion ? seccion.href : null
}
