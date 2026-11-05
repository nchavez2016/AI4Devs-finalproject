import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const registrarSimulado = vi.fn()

vi.mock('@/server/auth/acciones', () => ({
  registrar: registrarSimulado,
}))

describe('FormularioRegistro', () => {
  it('muestra junto a cada campo el error devuelto por el servidor', async () => {
    registrarSimulado.mockResolvedValue({
      errores: {
        nombre: ['El nombre es obligatorio'],
        nombreNegocio: ['El nombre del negocio es obligatorio'],
        email: ['El email no tiene un formato válido'],
        password: ['La contraseña debe tener al menos 8 caracteres'],
      },
    })

    const { FormularioRegistro } = await import('./FormularioRegistro')
    render(<FormularioRegistro />)

    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))

    await waitFor(() => {
      expect(screen.getByText('El nombre es obligatorio')).toBeTruthy()
    })
    expect(screen.getByText('El nombre del negocio es obligatorio')).toBeTruthy()
    expect(screen.getByText('El email no tiene un formato válido')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeTruthy()
  })

  it('El formulario de registro enfoca el primer campo con error', async () => {
    registrarSimulado.mockResolvedValue({
      errores: {
        email: ['El email no tiene un formato válido'],
        password: ['La contraseña debe tener al menos 8 caracteres'],
      },
    })

    const { FormularioRegistro } = await import('./FormularioRegistro')
    render(<FormularioRegistro />)

    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Email' }))
    })
  })
})
