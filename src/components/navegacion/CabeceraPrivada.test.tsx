import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CabeceraPrivada } from './CabeceraPrivada'

describe('CabeceraPrivada', () => {
  it('La cabecera muestra la marca y la navegación principal', () => {
    render(<CabeceraPrivada />)

    const banner = screen.getByRole('banner')
    const marca = within(banner).getByRole('link', { name: 'Cuadre' })
    expect(marca.getAttribute('href')).toBe('/panel')

    const navegacion = within(banner).getByRole('navigation', { name: 'Principal' })
    const enlaces = within(navegacion).getAllByRole('link')
    expect(enlaces.map((enlace) => enlace.textContent)).toEqual(['Panel', 'Cuentas', 'Categorías'])
    expect(enlaces.map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/panel',
      '/cuentas',
      '/categorias',
    ])
  })
})
