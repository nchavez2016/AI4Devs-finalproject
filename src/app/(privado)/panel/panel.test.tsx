import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

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
})
