import { useId, type SelectHTMLAttributes } from 'react'

export interface SelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  etiqueta: string
  error?: string
}

// Lista desplegable nativa con las medidas y tokens del campo (componentes.md, 7.2).
export function Selector({
  etiqueta,
  error,
  id: idProp,
  className: classNameProp,
  children,
  ...restoProps
}: SelectorProps) {
  const generatedId = useId()
  const id = idProp || generatedId
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-etiqueta">
      <label htmlFor={id} className="text-etiqueta font-control text-foreground">
        {etiqueta}
      </label>
      <select
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        className={[
          'bg-card border rounded-control h-alto-campo px-campo-x text-cuerpo text-foreground',
          error ? 'border-destructive' : 'border-input',
          classNameProp,
        ]
          .filter(Boolean)
          .join(' ')}
        {...restoProps}
      >
        {children}
      </select>
      {error && (
        <span id={errorId} className="text-detalle text-destructive mt-mensaje">
          {error}
        </span>
      )}
    </div>
  )
}
