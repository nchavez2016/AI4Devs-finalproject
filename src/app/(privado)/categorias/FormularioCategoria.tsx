import { Button } from '@/components/ui/Button'
import { Campo } from '@/components/ui/Campo'
import type { EstadoFormularioCategoria } from '@/server/categorias/acciones'

export interface FormularioCategoriaProps {
  estado: EstadoFormularioCategoria
  accion: (payload: FormData) => void
  pendiente: boolean
}

export function FormularioCategoria({ estado, accion, pendiente }: FormularioCategoriaProps) {
  const errorTipo = estado.errores?.tipo?.[0]

  return (
    <form action={accion} className="flex flex-col gap-entre-campos">
      <Campo etiqueta="Nombre" name="nombre" error={estado.errores?.nombre?.[0]} />

      <div className="flex flex-col gap-etiqueta">
        <label htmlFor="tipo-categoria" className="text-etiqueta font-control text-foreground">
          Tipo
        </label>
        <select
          id="tipo-categoria"
          name="tipo"
          defaultValue="GASTO"
          aria-invalid={errorTipo ? 'true' : undefined}
          aria-describedby={errorTipo ? 'tipo-categoria-error' : undefined}
          className={[
            'bg-card border rounded-control h-alto-campo px-campo-x text-cuerpo text-foreground',
            errorTipo ? 'border-destructive' : 'border-input',
          ].join(' ')}
        >
          <option value="INGRESO">Ingreso</option>
          <option value="GASTO">Gasto</option>
        </select>
        {errorTipo && (
          <span id="tipo-categoria-error" className="text-detalle text-destructive mt-mensaje">
            {errorTipo}
          </span>
        )}
      </div>

      <Button type="submit" cargando={pendiente} textoCarga="Guardando…">
        Crear categoría
      </Button>
    </form>
  )
}
