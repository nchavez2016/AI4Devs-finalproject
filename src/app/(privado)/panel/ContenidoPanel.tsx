import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cerrarSesion } from '@/server/auth/acciones'
import type { DatosPanel } from '@/server/panel'

export function ContenidoPanel({ nombreNegocio }: DatosPanel) {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <header className="flex items-center justify-between gap-seccion">
        <h1 className="font-titulo text-titulo-pagina text-foreground">{nombreNegocio}</h1>
        <form action={cerrarSesion}>
          <Button type="submit" variante="secundario">
            Cerrar sesión
          </Button>
        </form>
      </header>
      <nav aria-label="Secciones" className="flex gap-fila-x">
        <Link href="/cuentas" className="text-cuerpo font-control text-primary">
          Cuentas
        </Link>
        <Link href="/categorias" className="text-cuerpo font-control text-primary">
          Categorías
        </Link>
      </nav>
      <section className="flex flex-col gap-entre-campos">
        <h2 id="por-donde-empezar" className="font-titulo text-titulo-seccion text-foreground">
          Por dónde empezar
        </h2>
        <ol aria-labelledby="por-donde-empezar" className="flex flex-col gap-entre-campos">
          <li>
            <Link href="/cuentas" className="text-cuerpo font-control text-primary">
              Crea tu primera cuenta
            </Link>
          </li>
          <li>
            <Link href="/categorias" className="text-cuerpo font-control text-primary">
              Revisa tus categorías
            </Link>
          </li>
        </ol>
      </section>
    </main>
  )
}
