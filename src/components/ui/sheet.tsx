'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

// Sheet de shadcn/ui adaptado a los tokens (tokens.md, 3.2): panel lateral que se abre
// desde la derecha. Base del menú móvil.

function Sheet(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

function SheetTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />
}

function SheetClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />
}

function SheetContent({
  className,
  children,
  etiquetaCerrar = 'Cerrar',
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { etiquetaCerrar?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-ninguno z-50 bg-velo',
          'data-[state=open]:animate-velo-entrada data-[state=closed]:animate-velo-salida'
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-ninguno right-ninguno z-50 flex h-full w-full max-w-dialogo flex-col',
          'gap-entre-campos border-l border-border bg-popover p-tarjeta text-popover-foreground',
          'shadow-flotante',
          'data-[state=open]:animate-panel-entrada data-[state=closed]:animate-panel-salida',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={etiquetaCerrar}
          className="absolute top-pagina right-pagina inline-flex size-objetivo-tactil items-center justify-center rounded-control text-foreground transition-colors hover:bg-muted"
        >
          <X aria-hidden="true" className="size-icono" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function SheetTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-titulo text-titulo-seccion text-foreground', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-detalle text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription }
