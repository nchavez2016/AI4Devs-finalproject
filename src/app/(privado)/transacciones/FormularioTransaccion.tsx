import { useState, type RefObject } from 'react'
import { useFocoPrimerError } from '@/components/formularios/useFocoPrimerError'
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
  hoy: string
}

export function FormularioTransaccion({
  formularioRef,
  estado,
  accion,
  pendiente,
  categorias,
  cuentas,
  hoy,
}: FormularioTransaccionProps) {
  const [tipo, setTipo] = useState<TipoMovimientoSeleccionado>('GASTO')
  const categoriasDelTipo = tipo === 'GASTO' ? categorias.gasto : categorias.ingreso
  useFocoPrimerError(formularioRef, estado)

  return (
    <form
      ref={formularioRef}
      action={accion}
      noValidate
      className="flex flex-col gap-entre-campos"
    >
      <SelectorTipo valor={tipo} onCambio={setTipo} error={estado.errores?.tipo?.[0]} />

      <Campo etiqueta="Monto" name="monto" monto error={estado.errores?.monto?.[0]} />

      <Selector
        etiqueta="Categoría"
        name="categoriaId"
        key={tipo}
        error={estado.errores?.categoriaId?.[0]}
      >
        {categoriasDelTipo.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </Selector>

      <Selector etiqueta="Cuenta" name="cuentaId" error={estado.errores?.cuentaId?.[0]}>
        {cuentas.map((cuenta) => (
          <option key={cuenta.id} value={cuenta.id}>
            {cuenta.nombre}
          </option>
        ))}
      </Selector>

      <Campo
        etiqueta="Fecha"
        name="fecha"
        type="date"
        defaultValue={hoy}
        error={estado.errores?.fecha?.[0]}
      />

      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Guardar transacción
      </Button>
    </form>
  )
}
