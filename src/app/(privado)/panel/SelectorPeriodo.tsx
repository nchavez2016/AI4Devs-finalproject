'use client'

import Link, { useLinkStatus } from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import type { Periodo } from '@/server/dashboard/periodo'

const OPCIONES: { periodo: Periodo; etiqueta: string }[] = [
  { periodo: 'dia', etiqueta: 'Hoy' },
  { periodo: 'semana', etiqueta: 'Esta semana' },
  { periodo: 'mes', etiqueta: 'Este mes' },
]

const clasesEnlace =
  'inline-flex items-center justify-center h-alto-control px-control-x text-cuerpo rounded-control border'

const clasesInactivo = 'border-border bg-secondary text-secondary-foreground hover:bg-muted'
const clasesActivo = 'border-input bg-muted text-foreground font-enfasis'

// useLinkStatus solo vale dentro de un Link: cada enlace avisa a su padre de si está pendiente.
function AvisoPendiente({
  periodo,
  alCambiar,
}: {
  periodo: Periodo
  alCambiar: (periodo: Periodo, pendiente: boolean) => void
}) {
  const { pending } = useLinkStatus()

  useEffect(() => {
    alCambiar(periodo, pending)
  }, [alCambiar, periodo, pending])

  return null
}

export function SelectorPeriodo({ periodo }: { periodo: Periodo }) {
  const [pendientes, setPendientes] = useState<Partial<Record<Periodo, boolean>>>({})
  const alCambiar = useCallback((clave: Periodo, pendiente: boolean) => {
    setPendientes((anteriores) =>
      anteriores[clave] === pendiente ? anteriores : { ...anteriores, [clave]: pendiente }
    )
  }, [])
  const actualizando = Object.values(pendientes).some(Boolean)

  return (
    <nav aria-label="Período" className="flex flex-wrap items-center gap-acciones">
      {OPCIONES.map((opcion) => {
        const activo = opcion.periodo === periodo
        return (
          <Link
            key={opcion.periodo}
            href={`/panel?periodo=${opcion.periodo}`}
            aria-current={activo ? 'page' : undefined}
            className={[clasesEnlace, activo ? clasesActivo : clasesInactivo].join(' ')}
          >
            {opcion.etiqueta}
            <AvisoPendiente periodo={opcion.periodo} alCambiar={alCambiar} />
          </Link>
        )
      })}
      <span role="status" className="text-detalle text-muted-foreground">
        {actualizando ? 'Actualizando…' : ''}
      </span>
    </nav>
  )
}
