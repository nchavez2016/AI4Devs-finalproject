import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EncabezadoPagina } from './EncabezadoPagina'

describe('EncabezadoPagina', () => {
  it('EncabezadoPagina muestra el título y la frase de propósito', () => {
    render(
      <EncabezadoPagina
        titulo="Cuentas"
        proposito="Aquí registras dónde tienes tu dinero: bancos, efectivo y billeteras digitales."
      />
    )

    const encabezado = screen.getByRole('heading', { level: 1, name: 'Cuentas' })
    expect(encabezado).toBeTruthy()
    expect(encabezado.nextElementSibling?.textContent).toBe(
      'Aquí registras dónde tienes tu dinero: bancos, efectivo y billeteras digitales.'
    )
  })

  it('EncabezadoPagina muestra el enlace al panel solo si se pide', () => {
    const { unmount } = render(
      <EncabezadoPagina
        titulo="Cuentas"
        proposito="Propósito"
        volverAlPanel
      />
    )

    const enlace = screen.getByRole('link', { name: 'Volver al panel' })
    expect(enlace.getAttribute('href')).toBe('/panel')

    const heading = screen.getByRole('heading', { level: 1, name: 'Cuentas' })
    expect(enlace.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    unmount()

    render(
      <EncabezadoPagina
        titulo="Cuentas"
        proposito="Propósito"
      />
    )

    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
  })
})
