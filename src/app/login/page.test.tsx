import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from './page'

vi.mock('@/server/auth/acciones', () => ({
  iniciarSesion: vi.fn(),
}))

describe('página de inicio de sesión', () => {
  it('La página de inicio de sesión muestra su título y su formulario', () => {
    render(<LoginPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Crear una cuenta' }).getAttribute('href')).toBe(
      '/registro'
    )
  })

  it('El inicio de sesión se muestra en una tarjeta con la marca', () => {
    const { container } = render(<LoginPage />)

    const tarjeta = container.querySelector('[class*="shadow-tarjeta"]')!
    expect(tarjeta).toBeTruthy()
    expect(tarjeta.textContent).toContain('Cuadre')
    expect(tarjeta.contains(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' }))).toBe(
      true
    )
    expect(tarjeta.contains(screen.getByRole('button', { name: 'Entrar' }))).toBe(true)
    expect(
      tarjeta.contains(screen.getByRole('link', { name: 'Crear una cuenta' }))
    ).toBe(true)
  })
})
