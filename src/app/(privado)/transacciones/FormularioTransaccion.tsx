import { useState, type RefObject } from 'react'
import { Button } from '@/components/ui/Button'
import { SelectorTipo, type TipoMovimientoSeleccionado } from '@/components/ui/SelectorTipo'
import type { ListadoCategorias } from '@/server/categorias/categorias'
import type { EstadoFormularioTransaccion } from '@/server/transacciones/acciones'

export interface FormularioTransaccionProps {
  formularioRef: RefObject<HTMLFormElement | null>
  estado: EstadoFormularioTransaccion
  accion: (payload: FormData) => void
  pendiente: boolean
  categorias: ListadoCategorias
}

export function FormularioTransaccion({
  formularioRef,
  accion,
  pendiente,
  categorias,
}: FormularioTransaccionProps) {
  const [tipo, setTipo] = useState<TipoMovimientoSeleccionado>('GASTO')
  const categoriasDelTipo = tipo === 'GASTO' ? categorias.gasto : categorias.ingreso

  return (
    <form ref={formularioRef} action={accion} className="flex flex-col gap-entre-campos">
      <SelectorTipo valor={tipo} onCambio={setTipo} />

      <div className="flex flex-col gap-etiqueta">
        <label htmlFor="categoriaId" className="text-etiqueta font-control text-foreground">
          Categoría
        </label>
        <select
          id="categoriaId"
          name="categoriaId"
          key={tipo}
          className="bg-card border border-input rounded-control h-alto-campo px-campo-x text-cuerpo text-foreground"
        >
          {categoriasDelTipo.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Guardar transacción
      </Button>
    </form>
  )
}
