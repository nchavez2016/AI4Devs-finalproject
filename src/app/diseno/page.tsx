import { Importe, type TamanoImporte, type TipoImporte } from '@/components/ui/Importe'
import { Button } from '@/components/ui/Button'
import { Campo } from '@/components/ui/Campo'

const tamanos: TamanoImporte[] = ['cuerpo', 'importe-resumen', 'importe-principal']
const casosImporte: { tipo: TipoImporte; valor: string; descripcion: string }[] = [
  { tipo: 'ingreso', valor: '25.50', descripcion: 'Ingreso' },
  { tipo: 'gasto', valor: '25.50', descripcion: 'Gasto' },
  { tipo: 'saldo', valor: '1234.50', descripcion: 'Saldo positivo' },
  { tipo: 'saldo', valor: '-120.00', descripcion: 'Saldo negativo' },
  { tipo: 'saldo', valor: '0.00', descripcion: 'Cero' },
]

export default function DisenoPage() {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion bg-background text-foreground min-h-full">
      <header className="flex flex-col gap-mensaje">
        <h1 className="font-titulo text-titulo-pagina text-foreground">
          Sistema de diseño — Cuadre
        </h1>
        <p className="text-cuerpo text-muted-foreground">
          Página de muestra y verificación de componentes base y tokens de diseño.
        </p>
      </header>

      {/* Medición de cifras tabulares */}
      <section className="flex flex-col gap-mensaje bg-card border border-border rounded-superficie p-tarjeta">
        <h2 className="font-titulo text-titulo-seccion text-foreground">
          Medición de cifras tabulares (tnum)
        </h2>
        <p className="text-detalle text-muted-foreground">
          Deben medir exactamente lo mismo en DevTools:
        </p>
        <div className="flex flex-col gap-mensaje">
          <div>
            <span id="medicion-111" className="inline-block font-control text-cuerpo text-foreground">
              111,11
            </span>
          </div>
          <div>
            <span id="medicion-888" className="inline-block font-control text-cuerpo text-foreground">
              888,88
            </span>
          </div>
        </div>
      </section>

      {/* Casos de Importe */}
      <section className="flex flex-col gap-entre-campos bg-card border border-border rounded-superficie p-tarjeta">
        <h2 className="font-titulo text-titulo-seccion text-foreground">
          Casos de Importe en tres tamaños
        </h2>
        {tamanos.map((tamano) => (
          <div key={tamano} className="flex flex-col gap-mensaje">
            <span className="text-etiqueta font-control text-muted-foreground">
              Tamaño: {tamano}
            </span>
            <div className="flex flex-col gap-fila-y">
              {casosImporte.map((caso) => (
                <div key={`${tamano}-${caso.descripcion}`} className="flex items-center justify-between">
                  <span className="text-detalle text-muted-foreground">{caso.descripcion}</span>
                  <Importe valor={caso.valor} tipo={caso.tipo} tamano={tamano} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Variantes de Button */}
      <section className="flex flex-col gap-entre-campos bg-card border border-border rounded-superficie p-tarjeta">
        <h2 className="font-titulo text-titulo-seccion text-foreground">
          Variantes de Button
        </h2>
        <div className="flex flex-wrap items-center gap-acciones">
          <Button variante="primario">Guardar gasto</Button>
          <Button variante="secundario">Cancelar</Button>
          <Button variante="terciario">Quitar filtros</Button>
          <Button variante="destructivo">Eliminar movimiento</Button>
          <Button variante="primario" disabled>
            Deshabilitado
          </Button>
          <Button variante="primario" cargando>
            Guardando
          </Button>
        </div>
      </section>

      {/* Variantes de Campo */}
      <section className="flex flex-col gap-entre-campos bg-card border border-border rounded-superficie p-tarjeta">
        <h2 className="font-titulo text-titulo-seccion text-foreground">
          Variantes de Campo
        </h2>
        <div className="flex flex-col gap-entre-campos">
          <Campo etiqueta="Descripción" defaultValue="Almuerzo de trabajo" />
          <Campo etiqueta="Nota adicional" opcional placeholder="Opcional…" />
          <Campo
            etiqueta="Cuenta"
            ayuda="Cuenta bancaria de la que se debitará el valor"
            defaultValue="Cuenta corriente"
          />
          <Campo
            etiqueta="Categoría"
            error="El monto debe ser mayor que 0"
            defaultValue=""
          />
          <Campo
            etiqueta="Monto"
            monto
            ayuda="En dólares estadounidenses"
            defaultValue="25.50"
          />
        </div>
      </section>
    </main>
  )
}
