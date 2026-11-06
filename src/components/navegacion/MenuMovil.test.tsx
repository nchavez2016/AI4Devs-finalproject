import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MenuMovil } from './MenuMovil'

vi.mock('next/navigation', () => ({
  usePathname: () => '/cuentas',
}))

vi.mock('@/server/auth/acciones', () => ({
  cerrarSesion: vi.fn(),
}))

describe('MenuMovil', () => {
  it('El menú móvil muestra la navegación y el cierre de sesión', async () => {
    render(<MenuMovil />)

    const abrir = screen.getByRole('button', { name: 'Abrir menú' })
    expect(abrir.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(abrir)

    expect(abrir.getAttribute('aria-expanded')).toBe('true')
    const dialogo = await screen.findByRole('dialog')
    const enlaces = within(dialogo).getAllByRole('link')
    expect(enlaces.map((enlace) => enlace.textContent)).toEqual([
      'Panel',
      'Transacciones',
      'Cuentas',
      'Categorías',
    ])
    expect(within(dialogo).getByRole('button', { name: 'Cerrar sesión' })).toBeTruthy()
  })

  it('Escape cierra el menú móvil y devuelve el foco', async () => {
    render(<MenuMovil />)

    const abrir = screen.getByRole('button', { name: 'Abrir menú' })
    fireEvent.click(abrir)
    await screen.findByRole('dialog')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(abrir))
    expect(abrir.getAttribute('aria-expanded')).toBe('false')
  })

  it('Elegir una sección cierra el menú móvil', async () => {
    render(<MenuMovil />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
    const dialogo = await screen.findByRole('dialog')

    fireEvent.click(within(dialogo).getByRole('link', { name: 'Cuentas' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})
