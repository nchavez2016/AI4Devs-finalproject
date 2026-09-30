import { FormularioRegistro } from './FormularioRegistro'

export default function RegistroPage() {
  return (
    <main className="flex flex-col gap-seccion px-pagina py-seccion max-w-formulario mx-auto">
      <h1 className="font-titulo text-titulo-pagina text-foreground">Crear cuenta</h1>
      <FormularioRegistro />
    </main>
  )
}
