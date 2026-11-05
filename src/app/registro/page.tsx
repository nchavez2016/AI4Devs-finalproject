import { PaginaAcceso } from '@/components/PaginaAcceso'
import { FormularioRegistro } from './FormularioRegistro'

export default function RegistroPage() {
  return (
    <PaginaAcceso titulo="Crear cuenta">
      <FormularioRegistro />
    </PaginaAcceso>
  )
}
