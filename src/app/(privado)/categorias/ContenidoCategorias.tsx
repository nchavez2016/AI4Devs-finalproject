'use client'

import { useActionState } from 'react'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { crearCategoriaAccion } from '@/server/categorias/acciones'
import type { DatosCategorias } from '@/server/categorias/pantalla'
import { FormularioCategoria } from './FormularioCategoria'

export function ContenidoCategorias({ ingreso, gasto }: DatosCategorias) {
  const [estado, accion, pendiente] = useActionState(crearCategoriaAccion, {})

  const nombreCreado = [...ingreso, ...gasto].find(
    (categoria) => categoria.id === estado.idCreado
  )?.nombre
  const mensajeExito = nombreCreado ? `Categoría ${nombreCreado} creada.` : 'Categoría creada.'

  function claseFila(id: string): string {
    return [
      'px-fila-x py-fila-y border-b border-border text-cuerpo font-control text-foreground',
      id === estado.idCreado && 'animate-resaltado',
    ]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion animate-entrada">
        <EncabezadoPagina
          titulo="Categorías"
          proposito="Aquí defines cómo clasificas tus ingresos y tus gastos."
        />

        <div aria-live="polite" className="text-detalle text-muted-foreground">
          {estado.exito && mensajeExito}
        </div>

        <div className="grid grid-cols-(--columnas-lista-formulario) items-start gap-seccion">
          <div className="flex flex-col gap-seccion">
            <section className="flex flex-col gap-entre-campos">
              <h2 className="font-titulo text-titulo-seccion text-foreground">Ingresos</h2>
              <ul aria-label="Categorías de ingreso" className="flex flex-col">
                {ingreso.map((categoria) => (
                  <li key={categoria.id} className={claseFila(categoria.id)}>
                    {categoria.nombre}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-entre-campos">
              <h2 className="font-titulo text-titulo-seccion text-foreground">Gastos</h2>
              <ul aria-label="Categorías de gasto" className="flex flex-col">
                {gasto.map((categoria) => (
                  <li key={categoria.id} className={claseFila(categoria.id)}>
                    {categoria.nombre}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="w-full max-w-formulario">
            <Tarjeta className="flex flex-col gap-entre-campos">
              <h2 className="font-titulo text-titulo-seccion text-foreground">Nueva categoría</h2>
              <FormularioCategoria
                key={JSON.stringify(estado)}
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
