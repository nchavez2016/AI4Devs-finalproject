import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormularioCategoria } from './FormularioCategoria'

describe('FormularioCategoria', () => {
  it('El formulario de categoría enfoca el nombre con error', () => {
    render(
      <FormularioCategoria
        accion={() => {}}
        pendiente={false}
        estado={{ errores: { nombre: ['Ya tienes una categoría de gasto con ese nombre'] } }}
      />
    )

    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Nombre' }))
  })
})
