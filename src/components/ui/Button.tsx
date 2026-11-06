import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type VarianteBoton = 'primario' | 'secundario' | 'terciario' | 'destructivo'

const clasesVariante: Record<VarianteBoton, string> = {
  primario: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secundario: 'bg-secondary border border-input text-secondary-foreground hover:bg-muted',
  terciario: 'text-primary hover:bg-muted',
  destructivo: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
}

const clasesBase =
  'relative inline-flex items-center justify-center h-alto-control px-control-x text-cuerpo font-control rounded-control transition-colors'

// Para un enlace que debe verse como botón (por ejemplo, "Crear cuenta" que lleva a otra pantalla).
export function clasesBoton(variante: VarianteBoton = 'primario'): string {
  return [clasesBase, clasesVariante[variante]].join(' ')
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton
  cargando?: boolean
  textoCarga?: string
  children?: ReactNode
}

export function Button({
  variante = 'primario',
  cargando = false,
  textoCarga = 'Guardando…',
  disabled,
  children,
  className: classNameProp,
  ...restoProps
}: ButtonProps) {
  const estaDeshabilitado = Boolean(disabled || cargando)
  const claseVariante =
    !cargando && disabled
      ? 'bg-muted text-muted-foreground'
      : clasesVariante[variante]

  const className = [clasesBase, claseVariante, classNameProp]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={className}
      disabled={estaDeshabilitado}
      aria-busy={cargando ? 'true' : undefined}
      {...restoProps}
    >
      <span
        className={
          cargando
            ? 'invisible inline-flex items-center gap-icono-texto'
            : 'inline-flex items-center gap-icono-texto'
        }
      >
        {children}
      </span>
      {cargando && (
        <span className="absolute inset-ninguno flex items-center justify-center">
          <svg
            className="animate-giro size-icono"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1.5a6.5 6.5 0 1 0 6.5 6.5h-2A4.5 4.5 0 1 1 8 3.5v-2z" />
          </svg>
          <span className="sr-only">{textoCarga}</span>
        </span>
      )}
    </button>
  )
}
