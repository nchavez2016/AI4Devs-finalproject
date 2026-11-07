import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

describe('CategoriasGasto', () => {
  it('Período sin gastos muestra el aviso de la sección', async () => {
    const { CategoriasGasto } = await import('./CategoriasGasto')

    render(<CategoriasGasto categorias={[]} />)

    const seccion = screen.getByRole('region', { name: 'Categorías de gasto' })
    expect(within(seccion).getByText('No hay gastos registrados en este período.')).toBeTruthy()
    expect(within(seccion).queryByRole('img')).toBeNull()
    expect(within(seccion).queryByRole('table')).toBeNull()
  })

  it('El gráfico de categorías tiene una alternativa en tabla', async () => {
    const { CategoriasGasto } = await import('./CategoriasGasto')

    render(
      <CategoriasGasto
        categorias={[
          { categoria: 'Arriendo', total: '400.00' },
          { categoria: 'Insumos', total: '95.25' },
        ]}
      />
    )

    const grafico = screen.getByRole('img', {
      name: 'Categorías de gasto de mayor a menor, de $400,00 a $95,25',
    })
    expect(grafico).toBeTruthy()

    const tabla = screen.getByRole('table')
    expect(within(tabla).getByRole('columnheader', { name: 'Categoría' })).toBeTruthy()
    expect(within(tabla).getByRole('columnheader', { name: 'Importe' })).toBeTruthy()
    const filas = within(tabla).getAllByRole('row').slice(1)
    expect(filas.map((fila) => fila.textContent)).toEqual(['Arriendo$400,00', 'Insumos$95,25'])
  })

  it('Ver como tabla muestra la tabla a cualquier persona', async () => {
    const { CategoriasGasto } = await import('./CategoriasGasto')

    render(
      <CategoriasGasto
        categorias={[
          { categoria: 'Arriendo', total: '400.00' },
          { categoria: 'Insumos', total: '95.25' },
        ]}
      />
    )

    const boton = screen.getByRole('button', { name: 'Ver como tabla' })
    expect(boton.getAttribute('aria-expanded')).toBe('false')
    expect(screen.getByRole('table').className).toContain('sr-only')

    fireEvent.click(boton)

    expect(boton.getAttribute('aria-expanded')).toBe('true')
    expect(boton.getAttribute('aria-controls')).toBe(screen.getByRole('table').id)
    expect(screen.getByRole('table').className).not.toContain('sr-only')
  })
})
