import Link from 'next/link'
import { MarcaCuadre } from '@/components/MarcaCuadre'
import { Button } from '@/components/ui/Button'
import { cerrarSesion } from '@/server/auth/acciones'
import { MenuMovil } from './MenuMovil'
import { NavegacionPrincipal } from './NavegacionPrincipal'

export function CabeceraPrivada() {
  return (
    <header className="border-b border-border bg-card px-pagina">
      <div className="mx-auto flex h-alto-cabecera w-full max-w-contenido items-center justify-between gap-seccion">
        <Link href="/panel" className="rounded-control">
          <MarcaCuadre />
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
