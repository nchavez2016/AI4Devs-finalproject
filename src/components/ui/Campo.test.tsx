import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Campo } from './Campo'

describe('Campo', () => {
  it('Campo enlaza la etiqueta y la ayuda con el control', () => {
    const { rerender } = render(
      <Campo etiqueta="Descripción" ayuda="Breve nota del movimiento" />
    )

    const input = screen.getByLabelText('Descripción')
    expect(input.tagName).toBe('INPUT')

    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    const ayudaElement = document.getElementById(describedBy!)
    expect(ayudaElement?.textContent).toBe('Breve nota del movimiento')

    rerender(
      <Campo etiqueta="Descripción" ayuda="Breve nota del movimiento" opcional />
    )
    const inputOpcional = screen.getByLabelText('Descripción (opcional)')
    expect(inputOpcional).toBe(input)
  })

  it('Campo con error tiene aria-invalid y el mensaje enlazado con aria-describedby', () => {
    const { rerender } = render(
      <Campo
        etiqueta="Monto"
        ayuda="En dólares"
        error="El monto debe ser mayor que 0"
      />
    )

    const input = screen.getByLabelText('Monto')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.className).toContain('border-destructive')

    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    const ids = describedBy!.split(' ')
    expect(ids.length).toBe(2)

    const ayudaElement = document.getElementById(ids[0])
    expect(ayudaElement?.textContent).toBe('En dólares')

    const errorElement = document.getElementById(ids[1])
    expect(errorElement?.textContent).toContain('El monto debe ser mayor que 0')

    rerender(<Campo etiqueta="Monto" ayuda="En dólares" />)
    expect(input.getAttribute('aria-invalid')).toBeNull()
    expect(input.className).not.toContain('border-destructive')
  })

  it('Campo de monto muestra el prefijo $ y usa inputmode decimal', () => {
    const { container } = render(<Campo etiqueta="Monto" monto />)
    const input = screen.getByLabelText('Monto') as HTMLInputElement
    expect(input.getAttribute('inputmode')).toBe('decimal')
    expect(input.className).toContain('text-importe-campo')
    expect(input.value).toBe('')
    expect(container.textContent).toContain('$')
  })
})
