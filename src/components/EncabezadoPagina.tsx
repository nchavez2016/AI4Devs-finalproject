import type { ReactNode } from 'react'

interface EncabezadoPaginaProps {
  titulo: string
  proposito: string
  accion?: ReactNode
}

export function EncabezadoPagina({ titulo, proposito, accion }: EncabezadoPaginaProps) {
  return (
    <header className="flex flex-col gap-entre-campos">
      <div className="flex flex-wrap items-start justify-between gap-entre-campos">
        <div className="flex flex-col gap-entre-campos">
          <h1 className="font-titulo text-titulo-pagina text-foreground">{titulo}</h1>
          <p className="text-cuerpo text-muted-foreground">{proposito}</p>
        </div>
        {accion && <div className="shrink-0 whitespace-nowrap">{accion}</div>}
      </div>
    </header>
  )
}
