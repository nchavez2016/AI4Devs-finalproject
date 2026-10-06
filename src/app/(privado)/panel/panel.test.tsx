import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const authSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: authSimulado,
}))

vi.mock('@/server/auth/acciones', () => ({
  cerrarSesion: vi.fn(),
}))

describe('panel', () => {
  it('El panel muestra el negocio del usuario autenticado', async () => {
    authSimulado.mockResolvedValue({
      user: {
        id: 'usr_a',
        nombre: 'Ana',
        nombreNegocio: 'Tienda Ana',
        email: 'ana@tienda.ec',
      },
    })

    const { cargarPanel } = await import('@/server/panel')
    const { ContenidoPanel } = await import('./ContenidoPanel')

    const datos = await cargarPanel()
    render(<ContenidoPanel {...datos} />)

    expect(screen.getByText('Tienda Ana')).toBeTruthy()
    expect(screen.queryByText('Taller Beto')).toBeNull()
  })

  it('El panel enlaza a cuentas y categorías', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel nombreNegocio="Tienda Ana" />)

    expect(screen.getByRole('link', { name: 'Cuentas' }).getAttribute('href')).toBe('/cuentas')
    expect(screen.getByRole('link', { name: 'Categorías' }).getAttribute('href')).toBe(
      '/categorias'
    )
  })

  it('El panel muestra por dónde empezar', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel nombreNegocio="Tienda Ana" />)

    const lista = screen.getByRole('list', { name: 'Por dónde empezar' })
    const elementos = within(lista).getAllByRole('listitem')
    expect(elementos).toHaveLength(2)

    const enlaceCuentas = within(elementos[0]).getByRole('link', {
      name: 'Crea tu primera cuenta',
    })
    expect(enlaceCuentas.getAttribute('href')).toBe('/cuentas')

    const enlaceCategorias = within(elementos[1]).getByRole('link', {
      name: 'Revisa tus categorías',
    })
    expect(enlaceCategorias.getAttribute('href')).toBe('/categorias')
  })

  it('El panel usa el encabezado de página', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel nombreNegocio="Tienda Ana" />)

    const h1 = screen.getByRole('heading', { level: 1, name: 'Tienda Ana' })
    expect(h1).toBeTruthy()
    expect(h1.nextElementSibling?.textContent).toBe(
      'Desde aquí llegas a tus cuentas y a tus categorías.'
    )
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
  })
})
