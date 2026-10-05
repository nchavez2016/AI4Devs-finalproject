const FILAS_ESQUELETO = [0, 1, 2]

export default function CargaCategorias() {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Categorías</h1>

      <div aria-busy="true" aria-label="Cargando categorías" className="flex flex-col gap-fila-y">
        {FILAS_ESQUELETO.map((fila) => (
          <div key={fila} className="h-alto-fila bg-muted rounded-control animate-esqueleto" />
        ))}
      </div>
    </main>
  )
}
