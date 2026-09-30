import { useId, type InputHTMLAttributes } from 'react'

export interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string
  ayuda?: string
  error?: string
  opcional?: boolean
}

export function Campo({
  etiqueta,
  ayuda,
  error,
  opcional,
  id: idProp,
  className: classNameProp,
  ...restoProps
}: CampoProps) {
  const generatedId = useId()
  const id = idProp || generatedId
  const ayudaId = ayuda ? `${id}-ayuda` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [ayudaId, errorId].filter(Boolean).join(' ') || undefined

  const textoEtiqueta = opcional ? `${etiqueta} (opcional)` : etiqueta

  return (
    <div className="flex flex-col gap-etiqueta">
      <label htmlFor={id} className="text-etiqueta font-control text-foreground">
        {textoEtiqueta}
      </label>
      <input
        id={id}
        aria-describedby={describedBy}
        className={[
          'bg-card border border-input rounded-control h-alto-campo px-campo-x text-cuerpo text-foreground',
          classNameProp,
        ]
          .filter(Boolean)
          .join(' ')}
        {...restoProps}
      />
      {ayuda && (
        <span id={ayudaId} className="text-detalle text-muted-foreground mt-mensaje">
          {ayuda}
        </span>
      )}
    </div>
  )
}
