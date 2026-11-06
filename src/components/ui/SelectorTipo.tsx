import { Minus, Plus } from 'lucide-react'

export type TipoMovimientoSeleccionado = 'GASTO' | 'INGRESO'

interface SelectorTipoProps {
  valor: TipoMovimientoSeleccionado
  onCambio: (tipo: TipoMovimientoSeleccionado) => void
  error?: string
}

const opciones = [
  { valor: 'GASTO', texto: 'Gasto', Icono: Minus, claseSeleccion: 'peer-checked:bg-card' },
  {
    valor: 'INGRESO',
    texto: 'Ingreso',
    Icono: Plus,
    claseSeleccion: 'peer-checked:bg-ingreso-fondo',
  },
] as const

// Control segmentado de dos radios (componentes.md, 7.2). Gasto va primero. El tipo se
// distingue por icono, texto y peso, no solo por color.
export function SelectorTipo({ valor, onCambio, error }: SelectorTipoProps) {
  return (
    <fieldset className="flex flex-col gap-etiqueta">
      <legend className="mb-etiqueta text-etiqueta font-control text-foreground">Tipo</legend>
      <div className="grid grid-cols-2 gap-etiqueta">
        {opciones.map(({ valor: valorOpcion, texto, Icono, claseSeleccion }) => (
          <label key={valorOpcion} className="relative flex">
            <input
              type="radio"
              name="tipo"
              value={valorOpcion}
              checked={valor === valorOpcion}
              onChange={() => onCambio(valorOpcion)}
              aria-invalid={error ? 'true' : undefined}
              className="peer sr-only"
            />
            <span
              className={[
                'flex h-alto-control w-full items-center justify-center gap-icono-texto rounded-control border border-input bg-muted text-cuerpo font-lectura text-foreground',
                'peer-checked:border-input peer-checked:font-enfasis peer-focus-visible:outline-2',
                claseSeleccion,
              ].join(' ')}
            >
              <Icono aria-hidden="true" className="size-icono" />
              {texto}
            </span>
          </label>
        ))}
      </div>
      {error && <span className="text-detalle text-destructive mt-mensaje">{error}</span>}
    </fieldset>
  )
}
