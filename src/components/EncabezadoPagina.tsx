interface EncabezadoPaginaProps {
  titulo: string
  proposito: string
}

export function EncabezadoPagina({ titulo, proposito }: EncabezadoPaginaProps) {
  return (
    <header className="flex flex-col gap-entre-campos">
      <h1 className="font-titulo text-titulo-pagina text-foreground">{titulo}</h1>
      <p className="text-cuerpo text-muted-foreground">{proposito}</p>
    </header>
  )
}
