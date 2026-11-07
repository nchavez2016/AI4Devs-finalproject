'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { contarFiltrosActivos } from '@/app/(privado)/transacciones/filtros'
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
  const [abierto, setAbierto] = useState(false)

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

  const totalActivos = contarFiltrosActivos(filtros)
  const textoBoton = totalActivos > 0 ? `Filtros (${totalActivos})` : 'Filtros'

  return (
    <div className="flex flex-col gap-entre-campos">
      <Button
        type="button"
        variante="secundario"
        className="escritorio:hidden self-start"
        aria-expanded={abierto}
        aria-controls="grupo-filtros"
        onClick={() => setAbierto((actual) => !actual)}
      >
        {textoBoton}
      </Button>

      <div
        id="grupo-filtros"
        role="group"
        aria-label="Filtros"
        className={[
          abierto ? 'grid' : 'hidden escritorio:grid',
          'gap-entre-campos escritorio:grid-cols-2',
        ].join(' ')}
      >
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
