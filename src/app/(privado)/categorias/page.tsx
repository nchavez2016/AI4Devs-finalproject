import { cargarCategorias } from '@/server/categorias/pantalla'
import { ContenidoCategorias } from './ContenidoCategorias'

export default async function CategoriasPage() {
  const datos = await cargarCategorias()

  return <ContenidoCategorias {...datos} />
}
