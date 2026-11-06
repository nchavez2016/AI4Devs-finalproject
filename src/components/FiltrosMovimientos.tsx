'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Campo } from '@/components/ui/Campo'
import { Selector } from '@/components/ui/Selector'
import type { FiltrosTransacciones } from '@/server/transacciones/transacciones'

type ClaveFiltro = keyof FiltrosTransacciones

interface FiltrosMovimientosProps {
  filtros: FiltrosTransacciones
  cuentas: { id: string; nombre: string }[]
  /** El botón "Quitar filtros" solo se ofrece con un filtro activo y resultados en pantalla. */
  mostrarQuitar: boolean
}

// Filtros básicos del listado: viven en la URL (desde, hasta, tipo, cuentaId). Los avanzados
// quedan fuera del MVP (componentes.md, 7.4).
export function FiltrosMovimientos({
  filtros,
  cuentas,
  mostrarQuitar,
}: FiltrosMovimientosProps) {
  const router = useRouter()
  const [pendiente, iniciarTransicion] = useTransition()

  // La transición mantiene los movimientos anteriores en pantalla mientras llegan los nuevos.
  function navegar(url: string) {
    iniciarTransicion(async () => {
      await router.replace(url)
    })
  }

  function cambiar(clave: ClaveFiltro, valor: string) {
    const parametros = new URLSearchParams()
    for (const [claveActual, valorActual] of Object.entries(filtros)) {
      if (claveActual !== clave && valorActual) parametros.set(claveActual, valorActual)
    }
    if (valor) parametros.set(clave, valor)

    const consulta = parametros.toString()
    navegar(consulta ? `/transacciones?${consulta}` : '/transacciones')
  }

  return (
    <div role="group" aria-label="Filtros" className="flex flex-col gap-entre-campos">
      <div className="grid gap-entre-campos escritorio:grid-cols-2">
        <Campo
          etiqueta="Desde"
          type="date"
          defaultValue={filtros.desde}
          onChange={(evento) => cambiar('desde', evento.target.value)}
        />
        <Campo
          etiqueta="Hasta"
          type="date"
          defaultValue={filtros.hasta}
          onChange={(evento) => cambiar('hasta', evento.target.value)}
        />
        <Selector
          etiqueta="Filtrar por tipo"
          defaultValue={filtros.tipo ?? ''}
          onChange={(evento) => cambiar('tipo', evento.target.value)}
        >
          <option value="">Todos</option>
          <option value="GASTO">Gasto</option>
          <option value="INGRESO">Ingreso</option>
        </Selector>
        <Selector
          etiqueta="Filtrar por cuenta"
          defaultValue={filtros.cuentaId ?? ''}
          onChange={(evento) => cambiar('cuentaId', evento.target.value)}
        >
          <option value="">Todas</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre}
            </option>
          ))}
        </Selector>
      </div>

      <div className="flex items-center justify-between gap-entre-campos">
        <p aria-live="polite" className="text-detalle text-muted-foreground">
          {pendiente && 'Actualizando…'}
        </p>
        {mostrarQuitar && (
          <Button type="button" variante="terciario" onClick={() => navegar('/transacciones')}>
            Quitar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
