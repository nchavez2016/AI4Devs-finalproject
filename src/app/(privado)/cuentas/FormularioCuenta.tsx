import type { RefObject } from 'react'
import { Button } from '@/components/ui/Button'
import { useFocoPrimerError } from '@/components/formularios/useFocoPrimerError'
import { Campo } from '@/components/ui/Campo'
import type { EstadoFormularioCuenta } from '@/server/cuentas/acciones'

export interface FormularioCuentaProps {
  formularioRef: RefObject<HTMLFormElement | null>
  estado: EstadoFormularioCuenta
  accion: (payload: FormData) => void
  pendiente: boolean
}

export function FormularioCuenta({
  formularioRef,
  estado,
  accion,
  pendiente,
}: FormularioCuentaProps) {
  const errorTipo = estado.errores?.tipo?.[0]
  useFocoPrimerError(formularioRef, estado)

  return (
    <form
      ref={formularioRef}
      action={accion}
      data-testid="formulario-cuenta"
      noValidate
      className="flex flex-col gap-entre-campos"
    >
      {estado.mensaje && (
        <p
          role="alert"
          className="bg-negativo-fondo text-destructive rounded-control px-campo-x py-mensaje text-detalle"
        >
          {estado.mensaje}
        </p>
      )}

      <Campo
        etiqueta="Nombre"
        name="nombre"
        defaultValue={estado.valores?.nombre}
        error={estado.errores?.nombre?.[0]}
      />

      <div className="flex flex-col gap-etiqueta">
        <label htmlFor="tipo" className="text-etiqueta font-control text-foreground">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          defaultValue={estado.valores?.tipo || 'BANCO'}
          aria-invalid={errorTipo ? 'true' : undefined}
          aria-describedby={errorTipo ? 'tipo-error' : undefined}
          className={[
            'bg-card border rounded-control h-alto-campo px-campo-x text-cuerpo text-foreground',
            errorTipo ? 'border-destructive' : 'border-input',
          ].join(' ')}
        >
          <option value="BANCO">Banco</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="DIGITAL">Billetera digital</option>
        </select>
        {errorTipo && (
          <span id="tipo-error" className="text-detalle text-destructive mt-mensaje">
            {errorTipo}
          </span>
        )}
      </div>

      <Campo
        etiqueta="Saldo inicial"
        name="saldoInicial"
        monto
        opcional
        defaultValue={estado.valores?.saldoInicial}
        error={estado.errores?.saldoInicial?.[0]}
      />

      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Crear cuenta
      </Button>
    </form>
  )
}
