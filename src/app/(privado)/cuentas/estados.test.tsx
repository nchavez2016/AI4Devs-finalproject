import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

describe('estados de cuentas', () => {
  it('Error al cargar las cuentas ofrece reintentar', async () => {
    const { default: ErrorCuentas } = await import('./error')
    const retry = vi.fn()

    render(<ErrorCuentas error={new Error('falló la base')} retry={retry} />)

    expect(screen.getByText('No pudimos cargar tus cuentas.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })

  it('Pantalla de cuentas en carga muestra un esqueleto ocupado', async () => {
    const { default: Carga } = await import('./loading')

    render(<Carga />)

    const esqueleto = screen.getByLabelText('Cargando cuentas')
    expect(esqueleto.getAttribute('aria-busy')).toBe('true')

    const filas = esqueleto.querySelectorAll('.animate-esqueleto')
    expect(filas.length).toBeGreaterThan(0)
    filas.forEach((fila) => {
      expect(fila.className).toContain('h-alto-fila')
      expect(fila.className).toContain('bg-muted')
    })
  })
})
