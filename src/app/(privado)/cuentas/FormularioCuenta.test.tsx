import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import type { EstadoFormularioCuenta } from '@/server/cuentas/acciones'
import { FormularioCuenta } from './FormularioCuenta'

function montar(estado: EstadoFormularioCuenta = {}) {
  return render(
    <FormularioCuenta
      formularioRef={createRef<HTMLFormElement>()}
      estado={estado}
      accion={() => {}}
      pendiente={false}
    />
  )
}

describe('FormularioCuenta', () => {
  it('Escribir en un formulario no muestra errores antes de enviarlo', () => {
    const { container } = montar()

    const nombre = screen.getByRole('textbox', { name: 'Nombre' })
    fireEvent.change(nombre, { target: { value: 'Banco' } })
    fireEvent.change(nombre, { target: { value: '' } })
    fireEvent.blur(nombre)

    expect(screen.queryByRole('alert')).toBeNull()
    expect(container.querySelectorAll('[aria-invalid="true"]')).toHaveLength(0)
  })

  it('Un envío con errores lleva el foco al primer campo inválido', () => {
    montar({
      errores: {
        nombre: ['El nombre es obligatorio'],
        saldoInicial: ['Escribe un saldo con hasta 2 decimales, por ejemplo 500.00'],
      },
    })

    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Nombre' }))
  })

  it('Si solo falla un campo posterior, el foco va a ese campo', () => {
    montar({
      errores: {
        saldoInicial: ['Escribe un saldo con hasta 2 decimales, por ejemplo 500.00'],
      },
    })

    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Saldo inicial (opcional)' })
    )
  })

  it('Un error general sin errores de campo no mueve el foco', () => {
    const { container } = montar({ mensaje: 'No pudimos guardar la cuenta. Inténtalo de nuevo.' })

    expect(screen.getByRole('alert').textContent).toBe(
      'No pudimos guardar la cuenta. Inténtalo de nuevo.'
    )
    expect(container.contains(document.activeElement)).toBe(false)
    expect(document.activeElement).toBe(document.body)
  })
})
