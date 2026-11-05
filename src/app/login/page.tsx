import { MarcaCuadre } from '@/components/MarcaCuadre'
import { Tarjeta } from '@/components/ui/Tarjeta'
import { FormularioLogin } from './FormularioLogin'

export default function LoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center px-pagina py-seccion">
      <Tarjeta className="flex w-full max-w-formulario flex-col gap-seccion animate-entrada">
        <MarcaCuadre />
        <h1 className="font-titulo text-titulo-pagina text-foreground">Iniciar sesión</h1>
        <FormularioLogin />
      </Tarjeta>
    </main>
  )
}
