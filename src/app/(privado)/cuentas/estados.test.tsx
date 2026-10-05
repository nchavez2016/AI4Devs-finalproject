import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('estados de cuentas', () => {
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
