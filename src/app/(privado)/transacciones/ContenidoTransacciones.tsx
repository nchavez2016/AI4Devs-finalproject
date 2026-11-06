'use client'

import Link from 'next/link'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { clasesBoton } from '@/components/ui/Button'
import type { DatosTransacciones } from '@/server/transacciones/pantalla'

export function ContenidoTransacciones({ cuentas }: DatosTransacciones) {
  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion">
        <EncabezadoPagina
          titulo="Transacciones"
          proposito="Registra lo que entra y sale de tu negocio y revisa tus movimientos."
        />

        {cuentas.length === 0 && (
          <div className="flex flex-col items-start gap-entre-campos">
            <p className="text-cuerpo text-muted-foreground">
              Todavía no tienes cuentas. Crea una para empezar a registrar movimientos.
            </p>
            <Link href="/cuentas" className={clasesBoton('primario')}>
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
