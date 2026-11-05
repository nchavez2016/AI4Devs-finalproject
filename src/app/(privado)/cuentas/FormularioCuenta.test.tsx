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
})
