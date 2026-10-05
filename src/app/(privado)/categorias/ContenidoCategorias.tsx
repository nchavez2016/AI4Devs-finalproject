'use client'

import { useActionState } from 'react'
import { crearCategoriaAccion } from '@/server/categorias/acciones'
import type { DatosCategorias } from '@/server/categorias/pantalla'
import { FormularioCategoria } from './FormularioCategoria'

export function ContenidoCategorias({ ingreso, gasto }: DatosCategorias) {
  const [estado, accion, pendiente] = useActionState(crearCategoriaAccion, {})

  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Categorías</h1>

      <section className="flex flex-col gap-entre-campos">
        <h2 className="font-titulo text-titulo-seccion text-foreground">Ingreso</h2>
        <ul aria-label="Categorías de ingreso" className="flex flex-col">
          {ingreso.map((categoria) => (
            <li
              key={categoria.id}
              className="px-fila-x py-fila-y border-b border-border text-cuerpo font-control text-foreground"
            >
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-entre-campos">
        <h2 className="font-titulo text-titulo-seccion text-foreground">Gasto</h2>
        <ul aria-label="Categorías de gasto" className="flex flex-col">
          {gasto.map((categoria) => (
            <li
              key={categoria.id}
              className="px-fila-x py-fila-y border-b border-border text-cuerpo font-control text-foreground"
            >
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </section>

      <FormularioCategoria estado={estado} accion={accion} pendiente={pendiente} />
    </main>
  )
}
