'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useRef } from 'react'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { FiltrosMovimientos } from '@/components/FiltrosMovimientos'
import { ListaMovimientos } from '@/components/ListaMovimientos'
import { Button, clasesBoton } from '@/components/ui/Button'
import { formatearImporte } from '@/components/ui/Importe'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { registrarTransaccionAccion } from '@/server/transacciones/acciones'
import type { DatosTransacciones } from '@/server/transacciones/pantalla'
import { FormularioTransaccion } from './FormularioTransaccion'
import { hayFiltrosActivos, mensajeSinResultados } from './filtros'

export function ContenidoTransacciones({
  transacciones,
  cuentas,
  categorias,
  filtros,
  hoy,
}: DatosTransacciones) {
  const [estado, accion, pendiente] = useActionState(registrarTransaccionAccion, {})
  const formularioRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  // "Gasto de $25,50 registrado en Efectivo." (estados.md, 9.4)
  const mensajeExito =
    estado.exito && estado.creado
      ? `${estado.creado.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto'} de ${formatearImporte(estado.creado.monto, 'saldo')} registrado en ${estado.creado.cuentaNombre}.`
      : ''

  function quitarFiltros() {
    router.replace('/transacciones')
  }

  function enfocarMonto() {
    const campo = formularioRef.current?.elements.namedItem('monto')
    if (campo instanceof HTMLInputElement) {
      campo.focus()
    }
  }

  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion animate-entrada">
        <EncabezadoPagina
          titulo="Transacciones"
          proposito="Registra lo que entra y sale de tu negocio y revisa tus movimientos."
        />

        <div aria-live="polite" className="text-detalle text-muted-foreground">
          {mensajeExito}
        </div>

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
            <section
              aria-labelledby="titulo-movimientos"
              className="flex min-w-ninguno flex-col gap-entre-campos"
            >
              <h2
                id="titulo-movimientos"
                className="font-titulo text-titulo-seccion text-foreground"
              >
                Movimientos
              </h2>
              <FiltrosMovimientos
                filtros={filtros}
                cuentas={cuentas}
                mostrarQuitar={hayFiltrosActivos(filtros) && transacciones.length > 0}
              />
              {transacciones.length > 0 ? (
                <ListaMovimientos transacciones={transacciones} idResaltado={estado.idCreado} />
              ) : hayFiltrosActivos(filtros) ? (
                <div className="flex flex-col items-start gap-entre-campos">
                  <p className="text-cuerpo text-muted-foreground">
                    {mensajeSinResultados(filtros)}
                  </p>
                  <Button type="button" variante="terciario" onClick={quitarFiltros}>
                    Quitar filtros
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-entre-campos">
                  <p className="text-cuerpo text-muted-foreground">
                    Todavía no tienes movimientos. Registra el primero con el formulario.
                  </p>
                  <Button type="button" variante="secundario" onClick={enfocarMonto}>
                    Registrar movimiento
                  </Button>
                </div>
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
                  cuentas={cuentas}
                  hoy={hoy}
                />
              </Tarjeta>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
