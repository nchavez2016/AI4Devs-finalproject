'use client'

import { useActionState } from 'react'
import { Importe } from '@/components/ui/Importe'
import { crearCuentaAccion } from '@/server/cuentas/acciones'
import type { DatosCuentas } from '@/server/cuentas/pantalla'
import { FormularioCuenta } from './FormularioCuenta'

const etiquetasTipo = {
  BANCO: 'Banco',
  EFECTIVO: 'Efectivo',
  DIGITAL: 'Billetera digital',
} as const

export function ContenidoCuentas({ cuentas }: DatosCuentas) {
  const [, accion, pendiente] = useActionState(crearCuentaAccion, {})

  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Cuentas</h1>

      <ul aria-label="Cuentas" className="flex flex-col">
        {cuentas.map((cuenta) => (
          <li
            key={cuenta.id}
            className="flex items-center justify-between gap-seccion px-fila-x py-fila-y border-b border-border"
          >
            <div className="flex flex-col">
              <span className="text-cuerpo font-control text-foreground">{cuenta.nombre}</span>
              <span className="text-detalle text-muted-foreground">
                {etiquetasTipo[cuenta.tipo]}
              </span>
            </div>
            <Importe valor={cuenta.saldo} tipo="saldo" tamano="importe-resumen" />
          </li>
        ))}
      </ul>

      <FormularioCuenta accion={accion} pendiente={pendiente} />
    </main>
  )
}
