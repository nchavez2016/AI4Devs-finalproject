import type { ReactNode } from 'react'
import { MarcaCuadre } from '@/components/MarcaCuadre'
import { Tarjeta } from '@/components/ui/Tarjeta'

// Composición de las pantallas sin sesión: tarjeta centrada con la marca, el título y el formulario.
export function PaginaAcceso({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-pagina py-seccion">
      <Tarjeta className="flex w-full max-w-formulario flex-col gap-seccion animate-entrada">
        <MarcaCuadre />
        <h1 className="font-titulo text-titulo-pagina text-foreground">{titulo}</h1>
        {children}
      </Tarjeta>
    </main>
  )
}
