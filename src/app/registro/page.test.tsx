import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RegistroPage from './page'

vi.mock('@/server/auth/acciones', () => ({
  registrar: vi.fn(),
}))

describe('página de registro', () => {
  it('La página de registro muestra su título y su formulario', () => {
    render(<RegistroPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Crear cuenta' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Registrarme' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ya tengo una cuenta' }).getAttribute('href')).toBe(
      '/login'
    )
  })

  it('El registro se muestra en una tarjeta con la marca', () => {
    const { container } = render(<RegistroPage />)

    const tarjeta = container.querySelector('[class*="shadow-tarjeta"]')!
    expect(tarjeta).toBeTruthy()
    expect(tarjeta.textContent).toContain('Cuadre')
    expect(tarjeta.contains(screen.getByRole('heading', { level: 1, name: 'Crear cuenta' }))).toBe(
      true
    )
    expect(tarjeta.contains(screen.getByRole('button', { name: 'Registrarme' }))).toBe(true)
    expect(
      tarjeta.contains(screen.getByRole('link', { name: 'Ya tengo una cuenta' }))
    ).toBe(true)
  })
})
