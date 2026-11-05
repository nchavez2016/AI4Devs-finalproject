'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { SECCIONES, seccionActiva } from './secciones'

interface NavegacionPrincipalProps {
  vertical?: boolean
  alSeleccionar?: () => void
}

export function NavegacionPrincipal({ vertical = false, alSeleccionar }: NavegacionPrincipalProps) {
  const activa = seccionActiva(usePathname())

  return (
    <nav
      aria-label="Principal"
      className={vertical ? 'flex flex-col' : 'flex items-center gap-acciones'}
    >
      {SECCIONES.map((seccion) => {
        const esActiva = seccion.href === activa
        return (
          <Link
            key={seccion.href}
            href={seccion.href}
            aria-current={esActiva ? 'page' : undefined}
            onClick={alSeleccionar}
            className={cn(
              'inline-flex h-alto-control items-center border-b px-control-x text-cuerpo transition-colors',
              esActiva
                ? 'border-primary font-enfasis text-foreground'
                : 'border-transparent font-control text-muted-foreground hover:text-foreground'
            )}
          >
            {seccion.etiqueta}
          </Link>
        )
      })}
    </nav>
  )
}
