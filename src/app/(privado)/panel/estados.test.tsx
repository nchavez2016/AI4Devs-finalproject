import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

describe('estados del panel', () => {
  it('Dashboard en carga muestra un esqueleto ocupado', async () => {
    const { default: Carga } = await import('./loading')

    render(<Carga />)

    const esqueleto = screen.getByLabelText('Cargando resumen')
    expect(esqueleto.getAttribute('aria-busy')).toBe('true')

    // Forma de los totales, los saldos y las categorías: tres bloques con filas.
    expect(esqueleto.children).toHaveLength(3)
    const filas = esqueleto.querySelectorAll('.animate-esqueleto')
    expect(filas.length).toBeGreaterThanOrEqual(3)
    filas.forEach((fila) => {
      expect(fila.className).toContain('bg-muted')
    })
  })

  it('Error al cargar el dashboard ofrece reintentar', async () => {
    const { default: ErrorPanel } = await import('./error')
    const retry = vi.fn()

    render(<ErrorPanel error={new Error('falló la base')} retry={retry} />)

    expect(screen.getByText('No pudimos cargar tu resumen.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
