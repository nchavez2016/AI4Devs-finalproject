'use client'

import { useActionState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { Importe } from '@/components/ui/Importe'
import { Tarjeta } from '@/components/ui/Tarjeta'
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
  const nombreCreado = cuentas.find((cuenta) => cuenta.id === estado.idCreado)?.nombre
  const mensajeExito = nombreCreado ? `Cuenta ${nombreCreado} creada.` : 'Cuenta creada.'

  function enfocarNombre() {
    const campo = formularioRef.current?.elements.namedItem('nombre')
    if (campo instanceof HTMLInputElement) {
      campo.focus()
    }
  }

  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion animate-entrada">
        <EncabezadoPagina
          titulo="Cuentas"
          proposito="Aquí registras dónde tienes tu dinero: bancos, efectivo y billeteras digitales."
        />

        <div aria-live="polite" className="text-detalle text-muted-foreground">
          {estado.exito && mensajeExito}
        </div>

        <div className="grid grid-cols-(--columnas-lista-formulario) items-start gap-seccion">
          {cuentas.length === 0 ? (
            <div className="flex flex-col items-start gap-entre-campos">
              <p className="text-cuerpo text-muted-foreground">
                Todavía no tienes cuentas. Crea una para empezar a registrar movimientos.
              </p>
              <Button type="button" variante="secundario" onClick={enfocarNombre}>
                Crear cuenta
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
                    <span className="text-cuerpo font-control text-foreground">
                      {cuenta.nombre}
                    </span>
                    <span className="text-detalle text-muted-foreground">
                      {etiquetasTipo[cuenta.tipo]}
                    </span>
                  </div>
                  <Importe valor={cuenta.saldo} tipo="saldo" tamano="importe-resumen" />
                </li>
              ))}
            </ul>
          )}

          <div className="w-full max-w-formulario">
            <Tarjeta className="flex flex-col gap-entre-campos">
              <h2 className="font-titulo text-titulo-seccion text-foreground">Nueva cuenta</h2>
              <FormularioCuenta
                key={JSON.stringify(estado)}
                formularioRef={formularioRef}
                estado={estado}
                accion={accion}
                pendiente={pendiente}
              />
            </Tarjeta>
          </div>
        </div>
      </div>
    </main>
  )
}
