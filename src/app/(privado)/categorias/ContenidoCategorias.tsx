'use client'

import { useActionState } from 'react'
import { crearCategoriaAccion } from '@/server/categorias/acciones'
import type { DatosCategorias } from '@/server/categorias/pantalla'
import { FormularioCategoria } from './FormularioCategoria'

export function ContenidoCategorias({ ingreso, gasto }: DatosCategorias) {
  const [estado, accion, pendiente] = useActionState(crearCategoriaAccion, {})

  function claseFila(id: string): string {
    return [
      'px-fila-x py-fila-y border-b border-border text-cuerpo font-control text-foreground',
      id === estado.idCreado && 'animate-resaltado',
    ]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Categorías</h1>
      <p className="text-cuerpo text-muted-foreground">
        Aquí defines cómo clasificas tus ingresos y tus gastos.
      </p>

      <div aria-live="polite" className="text-detalle text-muted-foreground">
        {estado.exito && 'Categoría creada'}
      </div>

      <section className="flex flex-col gap-entre-campos">
        <h2 className="font-titulo text-titulo-seccion text-foreground">Ingreso</h2>
        <ul aria-label="Categorías de ingreso" className="flex flex-col">
          {ingreso.map((categoria) => (
            <li key={categoria.id} className={claseFila(categoria.id)}>
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-entre-campos">
        <h2 className="font-titulo text-titulo-seccion text-foreground">Gasto</h2>
        <ul aria-label="Categorías de gasto" className="flex flex-col">
          {gasto.map((categoria) => (
            <li key={categoria.id} className={claseFila(categoria.id)}>
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </section>

      <FormularioCategoria
        key={JSON.stringify(estado)}
        estado={estado}
        accion={accion}
        pendiente={pendiente}
      />
    </main>
  )
}
