import { FormularioLogin } from './FormularioLogin'

export default function LoginPage() {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion max-w-formulario mx-auto">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Iniciar sesión</h1>
      <FormularioLogin />
    </main>
  )
}
