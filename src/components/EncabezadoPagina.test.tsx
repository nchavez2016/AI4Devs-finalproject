import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Button } from '@/components/ui/Button'
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

  it('EncabezadoPagina muestra la acción primaria solo si se pasa', () => {
    const { unmount } = render(
      <EncabezadoPagina
        titulo="Cuentas"
        proposito="Propósito"
        accion={<Button>Nueva cuenta</Button>}
      />
    )

    const header = screen.getByRole('banner')
    const boton = within(header).getByRole('button', { name: 'Nueva cuenta' })
    expect(boton).toBeTruthy()

    unmount()

    render(
      <EncabezadoPagina
        titulo="Cuentas"
        proposito="Propósito"
      />
    )

    expect(within(screen.getByRole('banner')).queryByRole('button')).toBeNull()
  })
})
