import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export interface DatosPanel {
  nombreNegocio: string
}

export async function cargarPanel(): Promise<DatosPanel> {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return { nombreNegocio: session.user.nombreNegocio }
}
