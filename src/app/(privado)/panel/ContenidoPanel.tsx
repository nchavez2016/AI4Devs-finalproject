import Link from 'next/link'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { clasesBoton } from '@/components/ui/Button'
import { Importe } from '@/components/ui/Importe'
import { Tarjeta } from '@/components/ui/Tarjeta'
import type { DatosDashboard } from '@/server/dashboard/pantalla'
import { CategoriasGasto } from './CategoriasGasto'
import { SaldosCuentas } from './SaldosCuentas'
import { SelectorPeriodo } from './SelectorPeriodo'

export interface ContenidoPanelProps extends Omit<DatosDashboard, 'rangoPeriodo'> {
  rangoPeriodo?: string
}

export function ContenidoPanel({
  nombreNegocio,
  periodo,
  rangoPeriodo = '',
  hayTransacciones,
  resumen,
}: ContenidoPanelProps) {
  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion animate-entrada">
        <EncabezadoPagina
          titulo={nombreNegocio}
          proposito="Resumen de lo que entra y sale de tu negocio."
          accion={
            hayTransacciones ? (
              <Link href="/transacciones" className={clasesBoton('primario')}>
                Registrar movimiento
              </Link>
            ) : undefined
          }
        />

        <div className="flex flex-col gap-fila-y">
          <SelectorPeriodo periodo={periodo} />
          <p className="text-detalle text-muted-foreground">{rangoPeriodo}</p>
        </div>

        <section aria-label="Totales del período">
          <Tarjeta>
            <dl className="flex flex-col gap-entre-campos">
              <div className="flex items-baseline justify-between gap-seccion">
                <dt className="text-cuerpo text-muted-foreground">Ingresos</dt>
                <dd>
                  <Importe valor={resumen.totalIngresos} tipo="saldo" tamano="importe-resumen" />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-seccion">
                <dt className="text-cuerpo text-muted-foreground">Gastos</dt>
                <dd>
                  <Importe valor={resumen.totalGastos} tipo="saldo" tamano="importe-resumen" />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-seccion">
                <dt className="text-cuerpo text-foreground font-control">Balance</dt>
                <dd className="flex flex-col items-end">
                  <Importe valor={resumen.balance} tipo="saldo" tamano="importe-principal" />
                  {resumen.balance.startsWith('-') && (
                    <span className="text-detalle text-negativo">Saldo negativo</span>
                  )}
                </dd>
              </div>
            </dl>
          </Tarjeta>
        </section>

        <div className="grid items-start gap-seccion escritorio:grid-cols-2">
          <SaldosCuentas saldos={resumen.saldosPorCuenta} />
          <CategoriasGasto categorias={resumen.topCategoriasGasto} />
        </div>

        {hayTransacciones && resumen.totalIngresos === '0.00' && resumen.totalGastos === '0.00' && (
          <p className="text-cuerpo text-muted-foreground">No hay movimientos en este período.</p>
        )}

        {!hayTransacciones && (
          <div className="flex flex-col items-start gap-entre-campos">
            <p className="text-cuerpo text-muted-foreground">
              Todavía no has registrado movimientos. Registra el primero para ver tu resumen.
            </p>
            <Link href="/transacciones" className={clasesBoton('primario')}>
              Registrar movimiento
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
