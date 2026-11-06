import { useState, type RefObject } from 'react'
import { Button } from '@/components/ui/Button'
import { Campo } from '@/components/ui/Campo'
import { Selector } from '@/components/ui/Selector'
import { SelectorTipo, type TipoMovimientoSeleccionado } from '@/components/ui/SelectorTipo'
import type { ListadoCategorias } from '@/server/categorias/categorias'
import type { CuentaItem } from '@/server/cuentas/cuentas'
import type { EstadoFormularioTransaccion } from '@/server/transacciones/acciones'

export interface FormularioTransaccionProps {
  formularioRef: RefObject<HTMLFormElement | null>
  estado: EstadoFormularioTransaccion
  accion: (payload: FormData) => void
  pendiente: boolean
  categorias: ListadoCategorias
  cuentas: CuentaItem[]
}

export function FormularioTransaccion({
  formularioRef,
  accion,
  pendiente,
  categorias,
  cuentas,
}: FormularioTransaccionProps) {
  const [tipo, setTipo] = useState<TipoMovimientoSeleccionado>('GASTO')
  const categoriasDelTipo = tipo === 'GASTO' ? categorias.gasto : categorias.ingreso

  return (
    <form
      ref={formularioRef}
      action={accion}
      noValidate
      className="flex flex-col gap-entre-campos"
    >
      <SelectorTipo valor={tipo} onCambio={setTipo} />

      <Campo etiqueta="Monto" name="monto" monto />

      <Selector etiqueta="Categoría" name="categoriaId" key={tipo}>
        {categoriasDelTipo.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </Selector>

      <Selector etiqueta="Cuenta" name="cuentaId">
        {cuentas.map((cuenta) => (
          <option key={cuenta.id} value={cuenta.id}>
            {cuenta.nombre}
          </option>
        ))}
      </Selector>

      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Guardar transacción
      </Button>
    </form>
  )
}
