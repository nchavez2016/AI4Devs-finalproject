'use client'

import { useActionState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
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
  const [estado, accion, pendiente] = useActionState(crearCuentaAccion, {})
  const formularioRef = useRef<HTMLFormElement>(null)

  function enfocarNombre() {
    const campo = formularioRef.current?.elements.namedItem('nombre')
    if (campo instanceof HTMLInputElement) {
      campo.focus()
    }
  }

  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Cuentas</h1>
      <p className="text-cuerpo text-muted-foreground">
        Aquí registras dónde tienes tu dinero: bancos, efectivo y billeteras digitales.
      </p>

      <div aria-live="polite" className="text-detalle text-muted-foreground">
        {estado.exito && 'Cuenta creada'}
      </div>

      {cuentas.length === 0 ? (
        <div className="flex flex-col items-start gap-entre-campos">
          <p className="text-cuerpo text-muted-foreground">Aún no tienes cuentas</p>
          <Button type="button" onClick={enfocarNombre}>
            Crear mi primera cuenta
          </Button>
        </div>
      ) : (
        <ul aria-label="Cuentas" className="flex flex-col">
          {cuentas.map((cuenta) => (
            <li
              key={cuenta.id}
              className={[
                'flex items-center justify-between gap-seccion px-fila-x py-fila-y border-b border-border',
                cuenta.id === estado.idCreado && 'animate-resaltado',
              ]
                .filter(Boolean)
                .join(' ')}
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
      )}

      <FormularioCuenta
        key={JSON.stringify(estado)}
        formularioRef={formularioRef}
        estado={estado}
        accion={accion}
        pendiente={pendiente}
      />
    </main>
  )
}
