import Link from 'next/link'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import type { DatosPanel } from '@/server/panel'

export function ContenidoPanel({ nombreNegocio }: DatosPanel) {
  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion">
        <EncabezadoPagina
          titulo={nombreNegocio}
          proposito="Desde aquí llegas a tus cuentas y a tus categorías."
        />
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
      </div>
    </main>
  )
}
