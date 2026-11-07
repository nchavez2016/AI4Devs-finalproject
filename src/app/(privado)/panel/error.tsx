'use client'

import { Button } from '@/components/ui/Button'

export default function ErrorPanel({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Panel</h1>

      <div role="alert" className="flex flex-col items-start gap-entre-campos">
        <p className="text-cuerpo text-destructive">No pudimos cargar tu resumen.</p>
        <Button type="button" variante="secundario" onClick={() => retry()}>
          Reintentar
        </Button>
      </div>
    </main>
  )
}
