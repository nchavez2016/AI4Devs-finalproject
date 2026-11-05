import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cerrarSesion } from '@/server/auth/acciones'
import { MenuMovil } from './MenuMovil'
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
        <div className="hidden items-center gap-seccion escritorio:flex">
          <NavegacionPrincipal />
          <form action={cerrarSesion}>
            <Button type="submit" variante="terciario">
              Cerrar sesión
            </Button>
          </form>
        </div>
        <MenuMovil />
      </div>
    </header>
  )
}
