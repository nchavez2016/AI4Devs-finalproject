import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type VarianteBoton = 'primario' | 'secundario' | 'terciario' | 'destructivo'

const clasesVariante: Record<VarianteBoton, string> = {
  primario: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secundario: 'bg-secondary border border-input text-secondary-foreground hover:bg-muted',
  terciario: 'text-primary hover:bg-muted',
  destructivo: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
}

const clasesBase =
  'inline-flex items-center justify-center h-alto-control px-control-x text-cuerpo font-control rounded-control transition-colors'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton
  cargando?: boolean
  textoCarga?: string
  children?: ReactNode
}

export function Button({
  variante = 'primario',
  children,
  className: classNameProp,
  ...restoProps
}: ButtonProps) {
  const className = [clasesBase, clasesVariante[variante], classNameProp]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={className} {...restoProps}>
      {children}
    </button>
  )
}
