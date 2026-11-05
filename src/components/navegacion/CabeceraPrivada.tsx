import Link from 'next/link'
import { NavegacionPrincipal } from './NavegacionPrincipal'

export function CabeceraPrivada() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-alto-cabecera w-full max-w-contenido items-center justify-between gap-seccion px-pagina">
        <Link
          href="/panel"
          className="inline-flex items-center gap-icono-texto rounded-control font-titulo text-titulo-seccion text-foreground"
        >
          <span
            aria-hidden="true"
            className="inline-flex size-contenedor-icono items-center justify-center rounded-contenedor-icono bg-(image:--degradado-marca) text-cuerpo font-enfasis text-primary-foreground"
          >
            C
          </span>
          Cuadre
        </Link>
        <NavegacionPrincipal />
      </div>
    </header>
  )
}
