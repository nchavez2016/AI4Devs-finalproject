import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const iniciarSesionSimulado = vi.fn()

vi.mock('@/server/auth/acciones', () => ({
  iniciarSesion: iniciarSesionSimulado,
}))

describe('FormularioLogin', () => {
  it('muestra el mensaje genérico de credenciales incorrectas', async () => {
    iniciarSesionSimulado.mockResolvedValue({ mensaje: 'Email o contraseña incorrectos' })

    const { FormularioLogin } = await import('./FormularioLogin')
    render(<FormularioLogin />)

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByText('Email o contraseña incorrectos')).toBeTruthy()
    })
  })
})
