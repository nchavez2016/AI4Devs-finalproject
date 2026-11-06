'use client'

import Link from 'next/link'
import { useActionState, useRef } from 'react'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { ListaMovimientos } from '@/components/ListaMovimientos'
import { clasesBoton } from '@/components/ui/Button'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { registrarTransaccionAccion } from '@/server/transacciones/acciones'
import type { DatosTransacciones } from '@/server/transacciones/pantalla'
import { FormularioTransaccion } from './FormularioTransaccion'

export function ContenidoTransacciones({
  transacciones,
  cuentas,
  categorias,
}: DatosTransacciones) {
  const [estado, accion, pendiente] = useActionState(registrarTransaccionAccion, {})
  const formularioRef = useRef<HTMLFormElement>(null)

  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion animate-entrada">
        <EncabezadoPagina
          titulo="Transacciones"
          proposito="Registra lo que entra y sale de tu negocio y revisa tus movimientos."
        />

        {cuentas.length === 0 ? (
          <div className="flex flex-col items-start gap-entre-campos">
            <p className="text-cuerpo text-muted-foreground">
              Todavía no tienes cuentas. Crea una para empezar a registrar movimientos.
            </p>
            <Link href="/cuentas" className={clasesBoton('primario')}>
              Crear cuenta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-(--columnas-lista-formulario) items-start gap-seccion">
            <section aria-label="Movimientos" className="flex flex-col gap-entre-campos">
              {transacciones.length > 0 && (
                <ListaMovimientos transacciones={transacciones} idResaltado={estado.idCreado} />
              )}
            </section>

            <div className="w-full max-w-formulario">
              <Tarjeta className="flex flex-col gap-entre-campos">
                <h2 className="font-titulo text-titulo-seccion text-foreground">
                  Nueva transacción
                </h2>
                <FormularioTransaccion
                  key={JSON.stringify(estado)}
                  formularioRef={formularioRef}
                  estado={estado}
                  accion={accion}
                  pendiente={pendiente}
                  categorias={categorias}
                />
              </Tarjeta>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
