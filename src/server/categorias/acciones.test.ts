import { beforeEach, describe, expect, it, vi } from 'vitest'

const authSimulado = vi.fn()
const redirectSimulado = vi.fn()
const crearCategoriaSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectSimulado(url),
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
})
