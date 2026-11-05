import { useId, type InputHTMLAttributes } from 'react'

export interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string
  ayuda?: string
  error?: string
  opcional?: boolean
  monto?: boolean
}

export function Campo({
  etiqueta,
  ayuda,
  error,
  opcional,
  monto = false,
  id: idProp,
  className: classNameProp,
  inputMode: inputModeProp,
  ...restoProps
}: CampoProps) {
  const generatedId = useId()
  const id = idProp || generatedId
  const ayudaId = ayuda ? `${id}-ayuda` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [ayudaId, errorId].filter(Boolean).join(' ') || undefined

  const textoEtiqueta = opcional ? `${etiqueta} (opcional)` : etiqueta
  const claseBorde = error ? 'border-destructive' : 'border-input'
  const claseTexto = monto ? 'text-importe-campo font-control' : 'text-cuerpo'
  const inputMode = monto ? 'decimal' : inputModeProp

  const inputElement = (
    <input
      id={id}
      aria-describedby={describedBy}
      aria-invalid={error ? 'true' : undefined}
      inputMode={inputMode}
      className={[
        monto
          ? 'h-alto-campo w-full min-w-ninguno bg-transparent text-foreground'
          : `bg-card border ${claseBorde} rounded-control h-alto-campo px-campo-x text-foreground`,
        claseTexto,
        classNameProp,
      ]
        .filter(Boolean)
        .join(' ')}
      {...restoProps}
    />
  )

  return (
    <div className="flex flex-col gap-etiqueta">
      <label htmlFor={id} className="text-etiqueta font-control text-foreground">
        {textoEtiqueta}
      </label>
      {monto ? (
        <div
          data-campo-monto=""
          className={`flex items-center gap-campo-x rounded-control border ${claseBorde} bg-card px-campo-x`}
        >
          <span
            className="text-importe-campo font-control text-muted-foreground select-none"
            aria-hidden="true"
          >
            $
          </span>
          {inputElement}
        </div>
      ) : (
        inputElement
      )}
      {ayuda && (
        <span id={ayudaId} className="text-detalle text-muted-foreground mt-mensaje">
          {ayuda}
        </span>
      )}
      {error && (
        <span
          id={errorId}
          className="flex items-center gap-icono-texto text-detalle text-destructive mt-mensaje"
        >
          <svg
            className="size-icono-detalle shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1a7 7 0 1 0 7 7A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4.5zm0 7a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
          </svg>
          <span>{error}</span>
        </span>
      )}
    </div>
  )
}
