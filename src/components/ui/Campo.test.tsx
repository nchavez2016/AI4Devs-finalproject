import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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

  it('El campo de monto muestra el prefijo dentro del control', () => {
    render(<Campo etiqueta="Saldo inicial" name="saldoInicial" monto opcional />)

    const input = screen.getByLabelText('Saldo inicial (opcional)') as HTMLInputElement
    const contenedor = input.parentElement!
    expect(contenedor.textContent).toContain('$')
    expect(contenedor.className).toMatch(/(^|\s)border(\s|$)/)
    expect(input.className).not.toMatch(/(^|\s)border/)

    fireEvent.change(input, { target: { value: '500.00' } })
    expect(input.value).toBe('500.00')
  })

  it('El campo de monto con error marca el control completo', () => {
    const { rerender } = render(
      <Campo etiqueta="Saldo inicial" monto error="Escribe un saldo con hasta 2 decimales" />
    )

    const input = screen.getByLabelText('Saldo inicial')
    const contenedor = input.parentElement!
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(contenedor.className).toContain('border-destructive')
    expect(contenedor.className).not.toContain('border-input')

    rerender(<Campo etiqueta="Saldo inicial" monto />)
    expect(contenedor.className).toContain('border-input')
    expect(contenedor.className).not.toContain('border-destructive')
  })
})
