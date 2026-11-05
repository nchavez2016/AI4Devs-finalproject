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

  it('Las tarjetas de acceso del panel tienen un solo enlace', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel nombreNegocio="Tienda Ana" />)

    const lista = screen.getByRole('list', { name: 'Accesos' })
    const tarjetas = within(lista).getAllByRole('listitem')
    expect(tarjetas).toHaveLength(2)

    const titulos = ['Cuentas', 'Categorías']
    tarjetas.forEach((tarjeta, indice) => {
      const enlaces = within(tarjeta).getAllByRole('link')
      expect(enlaces).toHaveLength(1)
      expect(enlaces[0].textContent).toBe(titulos[indice])
      expect(within(tarjeta).queryAllByRole('button')).toHaveLength(0)
      expect((tarjeta.textContent ?? '').length).toBeGreaterThan(titulos[indice].length)
      expect(tarjeta.className).toContain('shadow-tarjeta')
      expect(tarjeta.querySelector('[aria-hidden="true"]')).toBeTruthy()
    })
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
