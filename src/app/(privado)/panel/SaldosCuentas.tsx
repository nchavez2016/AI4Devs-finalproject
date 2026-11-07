import Link from 'next/link'
import { clasesBoton } from '@/components/ui/Button'
import { Importe } from '@/components/ui/Importe'
import { Tarjeta } from '@/components/ui/Tarjeta'
import type { SaldoCuenta } from '@/server/dashboard/dashboard'

export function SaldosCuentas({ saldos }: { saldos: SaldoCuenta[] }) {
  return (
    <section aria-label="Saldos por cuenta">
      <Tarjeta className="flex flex-col gap-entre-campos">
        <h2 className="font-titulo text-titulo-seccion text-foreground">Saldos por cuenta</h2>
        {saldos.length === 0 ? (
          <div className="flex flex-col items-start gap-entre-campos">
            <p className="text-cuerpo text-muted-foreground">Todavía no tienes cuentas.</p>
            <Link href="/cuentas" className={clasesBoton('terciario')}>
              Crear cuenta
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col">
            {saldos.map((cuenta) => (
              <li
                key={cuenta.cuentaId}
                className="flex items-center justify-between gap-seccion py-fila-y border-b border-border"
              >
                <span className="text-cuerpo font-control text-foreground">{cuenta.nombre}</span>
                <span className="flex flex-col items-end">
                  <Importe valor={cuenta.saldo} tipo="saldo" tamano="importe-resumen" />
                  {cuenta.saldo.startsWith('-') && (
                    <span className="text-detalle text-negativo">Saldo negativo</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </section>
  )
}
