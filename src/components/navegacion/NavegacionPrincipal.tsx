import Link from 'next/link'

export const SECCIONES = [
  { href: '/panel', etiqueta: 'Panel' },
  { href: '/cuentas', etiqueta: 'Cuentas' },
  { href: '/categorias', etiqueta: 'Categorías' },
] as const

export function NavegacionPrincipal() {
  return (
    <nav aria-label="Principal" className="flex items-center gap-acciones">
      {SECCIONES.map((seccion) => (
        <Link
          key={seccion.href}
          href={seccion.href}
          className="inline-flex h-alto-control items-center rounded-control px-control-x text-cuerpo font-control text-muted-foreground transition-colors hover:text-foreground"
        >
          {seccion.etiqueta}
        </Link>
      ))}
    </nav>
  )
}
