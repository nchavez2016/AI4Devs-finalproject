import { ArrowLeftRight, Tags, Wallet } from 'lucide-react'
import { EncabezadoPagina } from '@/components/EncabezadoPagina'
import { TarjetaAcceso } from '@/components/ui/Tarjeta'
import type { DatosPanel } from '@/server/panel'

export function ContenidoPanel({ nombreNegocio }: DatosPanel) {
  return (
    <main className="px-pagina py-seccion bg-background text-foreground min-h-full">
      <div className="w-full max-w-contenido mx-auto flex flex-col gap-seccion">
        <EncabezadoPagina
          titulo={nombreNegocio}
          proposito="Desde aquí llegas a tus transacciones, cuentas y categorías."
        />
        <ul aria-label="Accesos" className="grid gap-entre-campos escritorio:grid-cols-2">
          <TarjetaAcceso
            href="/transacciones"
            titulo="Transacciones"
            descripcion="Lo que entra y sale de tu negocio: ingresos y gastos."
            icono={ArrowLeftRight}
          />
          <TarjetaAcceso
            href="/cuentas"
            titulo="Cuentas"
            descripcion="Dónde tienes tu dinero: bancos, efectivo y billeteras digitales."
            icono={Wallet}
          />
          <TarjetaAcceso
            href="/categorias"
            titulo="Categorías"
            descripcion="Cómo clasificas tus ingresos y tus gastos."
            icono={Tags}
          />
        </ul>
      </div>
    </main>
  )
}
