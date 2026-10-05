import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'

const authSimulado = vi.fn()
const listarCategoriasSimulado = vi.fn()
const crearCategoriaAccionSimulada = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('@/server/categorias/categorias', () => ({
  listarCategorias: (...args: unknown[]) => listarCategoriasSimulado(...args),
}))

vi.mock('@/server/categorias/acciones', () => ({
  crearCategoriaAccion: (...args: unknown[]) => crearCategoriaAccionSimulada(...args),
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

  it('Categoría creada se anuncia y se resalta en la lista', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCategoriasSimulado.mockResolvedValue({
      ingreso: [],
      gasto: [
        { id: 'k1', nombre: 'Arriendo', tipo: 'GASTO', categoriaPadreId: null, creadoEn: new Date() },
        { id: 'k2', nombre: 'Publicidad', tipo: 'GASTO', categoriaPadreId: null, creadoEn: new Date() },
      ],
    })
    crearCategoriaAccionSimulada.mockResolvedValue({ exito: true, idCreado: 'k2' })

    const { cargarCategorias } = await import('@/server/categorias/pantalla')
    const { ContenidoCategorias } = await import('./ContenidoCategorias')

    const datos = await cargarCategorias()
    render(<ContenidoCategorias {...datos} />)

    const formulario = screen.getByRole('button', { name: 'Crear categoría' }).closest('form')!
    await act(async () => {
      fireEvent.submit(formulario)
    })

    expect(screen.getByText('Categoría creada').closest('[aria-live]')).toBeTruthy()

    const filaNueva = screen.getByText('Publicidad').closest('li')!
    expect(filaNueva.className).toContain('animate-resaltado')

    const filaAnterior = screen.getByText('Arriendo').closest('li')!
    expect(filaAnterior.className).not.toContain('animate-resaltado')
  })

  it('Error al guardar la categoría conserva los datos escritos', async () => {
    const { FormularioCategoria } = await import('./FormularioCategoria')

    render(
      <FormularioCategoria
        accion={() => {}}
        pendiente={false}
        estado={{
          mensaje: 'No pudimos guardar la categoría. Inténtalo de nuevo.',
          valores: { nombre: 'Publicidad', tipo: 'INGRESO' },
        }}
      />
    )

    expect(screen.getByRole('alert').textContent).toContain(
      'No pudimos guardar la categoría. Inténtalo de nuevo.'
    )
    expect((screen.getByRole('textbox', { name: 'Nombre' }) as HTMLInputElement).value).toBe(
      'Publicidad'
    )
    expect((screen.getByRole('combobox', { name: 'Tipo' }) as HTMLSelectElement).value).toBe(
      'INGRESO'
    )
  })

  it('Pantalla de categorías explica para qué sirve', async () => {
    const { ContenidoCategorias } = await import('./ContenidoCategorias')

    render(<ContenidoCategorias ingreso={[]} gasto={[]} />)

    expect(
      screen.getByRole('heading', { level: 1 }).nextElementSibling?.textContent
    ).toBe('Aquí defines cómo clasificas tus ingresos y tus gastos.')
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
