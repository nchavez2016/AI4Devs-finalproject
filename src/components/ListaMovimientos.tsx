import { Importe } from '@/components/ui/Importe'
import type { TransaccionItem } from '@/server/transacciones/transacciones'

const formatoFechaCorta = new Intl.DateTimeFormat('es-EC', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const formatoDia = new Intl.DateTimeFormat('es-EC', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

// La fecha llega como AAAA-MM-DD y se formatea en UTC para que el día no se corra.
function aFecha(fecha: string): Date {
  return new Date(`${fecha}T00:00:00Z`)
}

function agruparPorDia(transacciones: TransaccionItem[]) {
  const grupos: { fecha: string; transacciones: TransaccionItem[] }[] = []
  for (const transaccion of transacciones) {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.fecha === transaccion.fecha) {
      ultimo.transacciones.push(transaccion)
    } else {
      grupos.push({ fecha: transaccion.fecha, transacciones: [transaccion] })
    }
  }
  return grupos
}

function tipoImporte(tipo: TransaccionItem['tipo']) {
  return tipo === 'INGRESO' ? 'ingreso' : 'gasto'
}

interface ListaMovimientosProps {
  transacciones: TransaccionItem[]
  /** Id de la transacción recién registrada, que se resalta. */
  idResaltado?: string
}

// Móvil: lista agrupada por día. Escritorio: tabla (componentes.md, 7.4).
export function ListaMovimientos({ transacciones, idResaltado }: ListaMovimientosProps) {
  const claseResaltado = (id: string) => (id === idResaltado ? 'animate-resaltado' : '')

  return (
    <>
      <div className="flex flex-col escritorio:hidden">
        {agruparPorDia(transacciones).map((grupo) => (
          <div key={grupo.fecha}>
            <h3 className="sticky top-ninguno bg-background py-fila-y text-grupo text-muted-foreground">
              {formatoDia.format(aFecha(grupo.fecha))}
            </h3>
            <ul className="flex flex-col">
              {grupo.transacciones.map((t) => (
                <li
                  key={t.id}
                  className={[
                    'flex min-h-alto-fila items-center justify-between gap-seccion border-b border-border px-fila-x py-fila-y',
                    claseResaltado(t.id),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="flex min-w-ninguno flex-col">
                    <span className="text-cuerpo font-control text-foreground">
                      {t.categoria.nombre}
                    </span>
                    <span className="truncate text-detalle text-muted-foreground">
                      {t.descripcion ? `${t.cuenta.nombre} · ${t.descripcion}` : t.cuenta.nombre}
                    </span>
                  </div>
                  <Importe valor={t.monto} tipo={tipoImporte(t.tipo)} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <table className="hidden w-full text-cuerpo escritorio:table">
        <thead>
          <tr className="text-left text-etiqueta text-muted-foreground">
            <th scope="col" className="px-fila-x py-fila-y font-control">
              Fecha
            </th>
            <th scope="col" className="px-fila-x py-fila-y font-control">
              Descripción
            </th>
            <th scope="col" className="px-fila-x py-fila-y font-control">
              Categoría
            </th>
            <th scope="col" className="px-fila-x py-fila-y font-control">
              Cuenta
            </th>
            <th scope="col" className="px-fila-x py-fila-y text-right font-control">
              Importe
            </th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map((t) => (
            <tr
              key={t.id}
              className={[
                'h-alto-fila-tabla border-b border-border hover:bg-muted',
                claseResaltado(t.id),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <td className="whitespace-nowrap px-fila-x text-foreground">
                {formatoFechaCorta.format(aFecha(t.fecha))}
              </td>
              <td className="w-full max-w-ninguno truncate px-fila-x text-foreground">
                {t.descripcion}
              </td>
              <td className="px-fila-x text-foreground">{t.categoria.nombre}</td>
              <td className="px-fila-x text-foreground">{t.cuenta.nombre}</td>
              <td className="px-fila-x text-right">
                <Importe valor={t.monto} tipo={tipoImporte(t.tipo)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
