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
})
