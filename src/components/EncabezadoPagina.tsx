import type { ReactNode } from 'react'
import Link from 'next/link'

interface EncabezadoPaginaProps {
  titulo: string
  proposito: string
  volverAlPanel?: boolean
  accion?: ReactNode
}

export function EncabezadoPagina({
  titulo,
  proposito,
  volverAlPanel,
  accion,
}: EncabezadoPaginaProps) {
  return (
    <header className="flex flex-col gap-entre-campos">
      {volverAlPanel && (
        <Link
          href="/panel"
          className="self-start inline-flex items-center gap-icono-texto h-alto-control px-control-x rounded-control text-cuerpo font-control text-primary hover:bg-muted transition-colors"
        >
          <span aria-hidden="true">←</span>
          Volver al panel
        </Link>
      )}
      <div className="flex items-start justify-between gap-seccion">
        <div className="flex flex-col gap-entre-campos">
          <h1 className="font-titulo text-titulo-pagina text-foreground">{titulo}</h1>
          <p className="text-cuerpo text-muted-foreground">{proposito}</p>
        </div>
        {accion}
      </div>
    </header>
  )
}
