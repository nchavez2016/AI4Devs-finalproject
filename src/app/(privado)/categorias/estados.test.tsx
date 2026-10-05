import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

describe('estados de categorías', () => {
  it('Pantalla de categorías en carga muestra un esqueleto ocupado', async () => {
    const { default: Carga } = await import('./loading')

    render(<Carga />)

    const esqueleto = screen.getByLabelText('Cargando categorías')
    expect(esqueleto.getAttribute('aria-busy')).toBe('true')

    const filas = esqueleto.querySelectorAll('.animate-esqueleto')
    expect(filas.length).toBeGreaterThan(0)
    filas.forEach((fila) => {
      expect(fila.className).toContain('h-alto-fila')
      expect(fila.className).toContain('bg-muted')
    })
  })

  it('Error al cargar las categorías ofrece reintentar', async () => {
    const { default: ErrorCategorias } = await import('./error')
    const retry = vi.fn()

    render(<ErrorCategorias error={new Error('falló la base')} retry={retry} />)

    expect(screen.getByText('No pudimos cargar tus categorías.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
