import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const authSimulado = vi.fn()
const listarCategoriasSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('@/server/categorias/categorias', () => ({
  listarCategorias: (...args: unknown[]) => listarCategoriasSimulado(...args),
}))

describe('categorias', () => {
  it('Pantalla de categorías muestra las de ingreso y las de gasto por separado', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCategoriasSimulado.mockResolvedValue({
      ingreso: [
        {
          id: 'k1',
          nombre: 'Ventas',
          tipo: 'INGRESO',
          categoriaPadreId: null,
          creadoEn: new Date(),
        },
      ],
      gasto: [
        {
          id: 'k2',
          nombre: 'Arriendo',
          tipo: 'GASTO',
          categoriaPadreId: null,
          creadoEn: new Date(),
        },
      ],
    })

    const { cargarCategorias } = await import('@/server/categorias/pantalla')
    const { ContenidoCategorias } = await import('./ContenidoCategorias')

    const datos = await cargarCategorias()
    render(<ContenidoCategorias {...datos} />)

    const ingreso = within(screen.getByRole('list', { name: 'Categorías de ingreso' }))
    expect(ingreso.getByText('Ventas')).toBeTruthy()
    expect(ingreso.queryByText('Arriendo')).toBeNull()

    const gasto = within(screen.getByRole('list', { name: 'Categorías de gasto' }))
    expect(gasto.getByText('Arriendo')).toBeTruthy()
    expect(gasto.queryByText('Ventas')).toBeNull()
  })

  it('Formulario de categoría muestra el error junto al nombre', async () => {
    const { FormularioCategoria } = await import('./FormularioCategoria')

    render(
      <FormularioCategoria
        accion={() => {}}
        pendiente={false}
        estado={{ errores: { nombre: ['El nombre es obligatorio'] } }}
      />
    )

    const nombre = screen.getByRole('textbox', { name: 'Nombre' })
    expect(nombre.getAttribute('aria-invalid')).toBe('true')
    const idError = screen.getByText('El nombre es obligatorio').closest('[id]')?.id
    expect(idError).toBeTruthy()
    expect(nombre.getAttribute('aria-describedby')).toContain(idError!)
  })
})
