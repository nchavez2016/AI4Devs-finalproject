import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Carga from './loading'
import ErrorTransacciones from './error'

describe('estados de transacciones', () => {
  it('Pantalla de transacciones en carga muestra un esqueleto ocupado', () => {
    render(<Carga />)

    const esqueleto = screen.getByLabelText('Cargando transacciones')
    expect(esqueleto.getAttribute('aria-busy')).toBe('true')

    const filas = esqueleto.querySelectorAll('.animate-esqueleto')
    expect(filas.length).toBeGreaterThan(0)
    filas.forEach((fila) => {
      expect(fila.className).toContain('h-alto-fila')
      expect(fila.className).toContain('bg-muted')
    })
  })

  it('Error al cargar las transacciones ofrece reintentar', () => {
    const retry = vi.fn()

    render(<ErrorTransacciones error={new Error('falló la base')} retry={retry} />)

    expect(screen.getByText('No pudimos cargar tus movimientos.')).toBeTruthy()

    const boton = screen.getByRole('button', { name: 'Reintentar' })
    expect(boton.className).toContain('bg-secondary')

    fireEvent.click(boton)

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
