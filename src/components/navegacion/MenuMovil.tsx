'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cerrarSesion } from '@/server/auth/acciones'
import { NavegacionPrincipal } from './NavegacionPrincipal'

export function MenuMovil() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className="inline-flex size-objetivo-tactil items-center justify-center rounded-control text-foreground transition-colors hover:bg-muted escritorio:hidden"
        >
          <Menu aria-hidden="true" className="size-icono" />
        </button>
      </SheetTrigger>
      <SheetContent etiquetaCerrar="Cerrar menú">
        <SheetTitle>Menú</SheetTitle>
        <SheetDescription className="sr-only">
          Secciones de Cuadre y cierre de sesión.
        </SheetDescription>
        <NavegacionPrincipal vertical />
        <form action={cerrarSesion}>
          <Button type="submit" variante="terciario">
            Cerrar sesión
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
