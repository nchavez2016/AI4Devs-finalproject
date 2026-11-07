'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatearImporte, Importe } from '@/components/ui/Importe'
import { Tarjeta } from '@/components/ui/Tarjeta'
import type { CategoriaGasto } from '@/server/dashboard/dashboard'
import { GraficoCategorias } from './GraficoCategorias'

function resumenDelGrafico(categorias: CategoriaGasto[]): string {
  const mayor = formatearImporte(categorias[0].total, 'saldo')
  const menor = formatearImporte(categorias[categorias.length - 1].total, 'saldo')
  return `Categorías de gasto de mayor a menor, de ${mayor} a ${menor}`
}

export function CategoriasGasto({ categorias }: { categorias: CategoriaGasto[] }) {
  const [tablaVisible, setTablaVisible] = useState(false)
  const idTabla = useId()

  return (
    <section aria-label="Categorías de gasto">
      <Tarjeta className="flex flex-col gap-entre-campos">
        <h2 className="font-titulo text-titulo-seccion text-foreground">Categorías de gasto</h2>
        {categorias.length === 0 ? (
          <p className="text-cuerpo text-muted-foreground">
            No hay gastos registrados en este período.
          </p>
        ) : (
          <>
            <div role="img" aria-label={resumenDelGrafico(categorias)}>
              <GraficoCategorias categorias={categorias} />
            </div>
            <div>
              <Button
                type="button"
                variante="terciario"
                aria-expanded={tablaVisible}
                aria-controls={idTabla}
                onClick={() => setTablaVisible((visible) => !visible)}
              >
                Ver como tabla
              </Button>
            </div>
            <table id={idTabla} className={tablaVisible ? 'w-full' : 'sr-only'}>
              <caption className="sr-only">Categorías de gasto del período</caption>
              <thead>
                <tr>
                  <th scope="col" className="py-fila-y text-left text-etiqueta text-muted-foreground">
                    Categoría
                  </th>
                  <th scope="col" className="py-fila-y text-right text-etiqueta text-muted-foreground">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.categoria} className="border-t border-border">
                    <td className="py-fila-y text-cuerpo text-foreground">{c.categoria}</td>
                    <td className="py-fila-y text-right">
                      <Importe valor={c.total} tipo="saldo" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Tarjeta>
    </section>
  )
}
