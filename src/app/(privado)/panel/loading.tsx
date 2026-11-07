const FILAS_TOTALES = [0, 1, 2]
const FILAS_SALDOS = [0, 1]
// Anchos distintos para que las categorías no parezcan una tabla.
const BARRAS_CATEGORIAS = ['mr-ninguno', 'mr-pagina', 'mr-seccion max-w-formulario']

export default function CargaPanel() {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Panel</h1>

      <div aria-busy="true" aria-label="Cargando resumen" className="flex flex-col gap-seccion">
        <div className="flex flex-col gap-fila-y">
          {FILAS_TOTALES.map((fila) => (
            <div key={fila} className="h-alto-fila bg-muted rounded-control animate-esqueleto" />
          ))}
        </div>
        <div className="flex flex-col gap-fila-y">
          {FILAS_SALDOS.map((fila) => (
            <div key={fila} className="h-alto-fila bg-muted rounded-control animate-esqueleto" />
          ))}
        </div>
        <div className="flex flex-col gap-fila-y">
          {BARRAS_CATEGORIAS.map((ancho) => (
            <div
              key={ancho}
              className={`h-alto-fila-tabla bg-muted rounded-control animate-esqueleto ${ancho}`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
