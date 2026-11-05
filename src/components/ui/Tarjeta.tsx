import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const clasesTarjeta =
  'rounded-superficie border border-border bg-card p-tarjeta text-card-foreground shadow-tarjeta'

export function Tarjeta({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn(clasesTarjeta, className)} {...props} />
}

export function ContenedorIcono({ icono: Icono }: { icono: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-contenedor-icono items-center justify-center rounded-contenedor-icono bg-icono-fondo text-icono"
    >
      <Icono className="size-icono" />
    </span>
  )
}

interface TarjetaAccesoProps {
  href: string
  titulo: string
  descripcion: string
  icono: LucideIcon
}

// Tarjeta clicable (componentes.md, 7.3): el enlace del título se extiende a toda la
// superficie y es el único interactivo.
export function TarjetaAcceso({ href, titulo, descripcion, icono }: TarjetaAccesoProps) {
  return (
    <li
      data-tarjeta-enlace=""
      className={cn(
        clasesTarjeta,
        'relative flex flex-col gap-entre-campos transition-shadow hover:border-input hover:bg-muted hover:shadow-tarjeta-hover'
      )}
    >
      <ContenedorIcono icono={icono} />
      <h2 className="font-titulo text-titulo-seccion text-foreground">
        <Link href={href} className="after:absolute after:inset-ninguno">
          {titulo}
        </Link>
      </h2>
      <p className="text-cuerpo text-muted-foreground">{descripcion}</p>
    </li>
  )
}
