import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CabeceraPrivada } from './CabeceraPrivada'

vi.mock('@/server/auth/acciones', () => ({
  cerrarSesion: vi.fn(),
}))

describe('CabeceraPrivada', () => {
  it('La cabecera muestra la marca y la navegación principal', () => {
    render(<CabeceraPrivada />)

    const banner = screen.getByRole('banner')
    const marca = within(banner).getByRole('link', { name: 'Cuadre' })
    expect(marca.getAttribute('href')).toBe('/panel')

    const navegacion = within(banner).getByRole('navigation', { name: 'Principal' })
    const enlaces = within(navegacion).getAllByRole('link')
    expect(enlaces.map((enlace) => enlace.textContent)).toEqual([
      'Panel',
      'Transacciones',
      'Cuentas',
      'Categorías',
    ])
    expect(enlaces.map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/panel',
      '/transacciones',
      '/cuentas',
      '/categorias',
    ])
    expect(within(banner).getByRole('button', { name: 'Abrir menú' })).toBeTruthy()
  })

  it('La cabecera ofrece cerrar sesión en cada pantalla privada', async () => {
    const { unmount } = render(<CabeceraPrivada />)

    const banner = screen.getByRole('banner')
    const boton = within(banner).getByRole('button', { name: 'Cerrar sesión' })
    expect(boton.className).not.toContain('bg-primary')
    unmount()

    const { ContenidoPanel } = await import('@/app/(privado)/panel/ContenidoPanel')
    render(<ContenidoPanel nombreNegocio="Tienda Ana" />)

    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull()
  })
})
