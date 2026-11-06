import type { RefObject } from 'react'
import { Button } from '@/components/ui/Button'
import type { EstadoFormularioTransaccion } from '@/server/transacciones/acciones'

export interface FormularioTransaccionProps {
  formularioRef: RefObject<HTMLFormElement | null>
  estado: EstadoFormularioTransaccion
  accion: (payload: FormData) => void
  pendiente: boolean
}

export function FormularioTransaccion({
  formularioRef,
  accion,
  pendiente,
}: FormularioTransaccionProps) {
  return (
    <form ref={formularioRef} action={accion} className="flex flex-col gap-entre-campos">
      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Guardar transacción
      </Button>
    </form>
  )
}
