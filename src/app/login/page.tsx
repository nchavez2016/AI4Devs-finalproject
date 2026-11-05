import { PaginaAcceso } from '@/components/PaginaAcceso'
import { FormularioLogin } from './FormularioLogin'

export default function LoginPage() {
  return (
    <PaginaAcceso titulo="Iniciar sesión">
      <FormularioLogin />
    </PaginaAcceso>
  )
}
