import { beforeEach, describe, expect, it, vi } from 'vitest'

const authSimulado = vi.fn()
const redirectSimulado = vi.fn()
const crearCategoriaSimulado = vi.fn()
const revalidatePathSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectSimulado(url),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathSimulado(...args),
}))

vi.mock('./categorias', () => ({
  crearCategoria: (...args: unknown[]) => crearCategoriaSimulado(...args),
}))

describe('crearCategoriaAccion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('La categoría se crea siempre para el usuario de la sesión', async () => {
    authSimulado.mockResolvedValue({
      user: { id: 'usuario-a' },
    })
    crearCategoriaSimulado.mockResolvedValue({
      ok: true,
      categoria: {
        id: 'k1',
        nombre: 'Publicidad',
        tipo: 'GASTO',
        categoriaPadreId: null,
        creadoEn: new Date(),
      },
    })

    const { crearCategoriaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('usuarioId', 'usuario-b')
    formData.set('nombre', 'Publicidad')
    formData.set('tipo', 'GASTO')

    await crearCategoriaAccion(undefined, formData)

    expect(crearCategoriaSimulado).toHaveBeenCalledWith('usuario-a', {
      nombre: 'Publicidad',
      tipo: 'GASTO',
    })
  })

  it('crearCategoriaAccion devuelve los errores por campo del caso de uso', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    crearCategoriaSimulado.mockResolvedValue({
      ok: false,
      errores: { nombre: ['El nombre es obligatorio'] },
    })

    const { crearCategoriaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('nombre', '   ')
    formData.set('tipo', 'GASTO')

    const estado = await crearCategoriaAccion(undefined, formData)

    expect(estado).toEqual({ errores: { nombre: ['El nombre es obligatorio'] } })
  })

  it('crearCategoriaAccion convierte un error inesperado en el aviso y conserva los valores', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    crearCategoriaSimulado.mockRejectedValue(new Error('conexión perdida'))

    const { crearCategoriaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('nombre', 'Publicidad')
    formData.set('tipo', 'INGRESO')

    const estado = await crearCategoriaAccion(undefined, formData)

    expect(estado).toEqual({
      mensaje: 'No pudimos guardar la categoría. Inténtalo de nuevo.',
      valores: { nombre: 'Publicidad', tipo: 'INGRESO' },
    })
  })

  it('crearCategoriaAccion revalida /categorias y devuelve el id creado', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    crearCategoriaSimulado.mockResolvedValue({
      ok: true,
      categoria: {
        id: 'k1',
        nombre: 'Publicidad',
        tipo: 'GASTO',
        categoriaPadreId: null,
        creadoEn: new Date(),
      },
    })

    const { crearCategoriaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('nombre', 'Publicidad')
    formData.set('tipo', 'GASTO')

    const estado = await crearCategoriaAccion(undefined, formData)

    expect(revalidatePathSimulado).toHaveBeenCalledWith('/categorias')
    expect(estado).toEqual({ exito: true, idCreado: 'k1' })
  })

  it('Crear una categoría sin sesión redirige al login', async () => {
    authSimulado.mockResolvedValue(null)
    redirectSimulado.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    const { crearCategoriaAccion } = await import('./acciones')

    const formData = new FormData()
    formData.set('nombre', 'Publicidad')
    formData.set('tipo', 'GASTO')

    await expect(crearCategoriaAccion(undefined, formData)).rejects.toThrow('NEXT_REDIRECT')

    expect(redirectSimulado).toHaveBeenCalledWith('/login')
    expect(crearCategoriaSimulado).not.toHaveBeenCalled()
  })
})
