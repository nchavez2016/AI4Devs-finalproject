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
  // Tras un error del servidor se conserva lo escrito, incluido el tipo (design e).
  const [tipo, setTipo] = useState<TipoMovimientoSeleccionado>(
    estado.valores?.tipo === 'INGRESO' ? 'INGRESO' : 'GASTO'
  )
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

      <Campo
        etiqueta="Monto"
        name="monto"
        monto
        defaultValue={estado.valores?.monto}
        error={estado.errores?.monto?.[0]}
      />

      <Selector
        etiqueta="Categoría"
        name="categoriaId"
        key={tipo}
        defaultValue={estado.valores?.categoriaId}
        error={estado.errores?.categoriaId?.[0]}
      >
        {categoriasDelTipo.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </Selector>

      <Selector
        etiqueta="Cuenta"
        name="cuentaId"
        defaultValue={estado.valores?.cuentaId}
        error={estado.errores?.cuentaId?.[0]}
      >
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
        defaultValue={estado.valores?.fecha || hoy}
        error={estado.errores?.fecha?.[0]}
      />

      <Campo
        etiqueta="Descripción"
        name="descripcion"
        opcional
        defaultValue={estado.valores?.descripcion}
        error={estado.errores?.descripcion?.[0]}
      />

      {estado.mensaje && (
        <p
          role="alert"
          className="bg-negativo-fondo text-destructive rounded-control px-campo-x py-mensaje text-detalle"
        >
          {estado.mensaje}
        </p>
      )}

      <div className="fixed inset-x-ninguno bottom-ninguno z-10 flex flex-col bg-card border-t border-border p-pagina pb-relleno-barra-inferior escritorio:static escritorio:z-auto escritorio:bg-transparent escritorio:border-t-transparent escritorio:p-ninguno">
        <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
          Guardar transacción
        </Button>
      </div>
    </form>
  )
}
