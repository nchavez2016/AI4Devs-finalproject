import { Button } from '@/components/ui/Button'
import { Campo } from '@/components/ui/Campo'

export interface FormularioCuentaProps {
  accion: (payload: FormData) => void
  pendiente: boolean
}

export function FormularioCuenta({ accion, pendiente }: FormularioCuentaProps) {
  return (
    <form action={accion} className="flex flex-col gap-entre-campos">
      <Campo etiqueta="Nombre" name="nombre" />

      <div className="flex flex-col gap-etiqueta">
        <label htmlFor="tipo" className="text-etiqueta font-control text-foreground">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          defaultValue="BANCO"
          className="bg-card border border-input rounded-control h-alto-campo px-campo-x text-cuerpo text-foreground"
        >
          <option value="BANCO">Banco</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="DIGITAL">Billetera digital</option>
        </select>
      </div>

      <Campo etiqueta="Saldo inicial" name="saldoInicial" monto opcional />

      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Crear cuenta
      </Button>
    </form>
  )
}
