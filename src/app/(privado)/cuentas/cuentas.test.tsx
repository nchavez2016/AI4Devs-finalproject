import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const authSimulado = vi.fn()
const listarCuentasSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('@/server/cuentas/cuentas', () => ({
  listarCuentas: (...args: unknown[]) => listarCuentasSimulado(...args),
}))

describe('cuentas', () => {
  it('Pantalla de cuentas muestra cada cuenta con su tipo y saldo', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([
      {
        id: 'c1',
        nombre: 'Banco Pichincha',
        tipo: 'BANCO',
        saldo: '500.00',
        creadoEn: new Date(),
      },
      {
        id: 'c2',
        nombre: 'Caja chica',
        tipo: 'EFECTIVO',
        saldo: '20.00',
        creadoEn: new Date(),
      },
    ])

    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')
    const { formatearImporte } = await import('@/components/ui/Importe')

    const datos = await cargarCuentas()
    render(<ContenidoCuentas {...datos} />)

    const lista = within(screen.getByRole('list', { name: 'Cuentas' }))
    expect(lista.getByText('Banco Pichincha')).toBeTruthy()
    expect(lista.getByText('Banco')).toBeTruthy()
    expect(lista.getByText(formatearImporte('500.00', 'saldo'))).toBeTruthy()
    expect(lista.getByText('Caja chica')).toBeTruthy()
    expect(lista.getByText('Efectivo')).toBeTruthy()
    expect(lista.getByText(formatearImporte('20.00', 'saldo'))).toBeTruthy()
  })

  it('Pantalla de cuentas sin cuentas muestra el estado vacío', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([])

    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')

    const datos = await cargarCuentas()
    render(<ContenidoCuentas {...datos} />)

    expect(screen.getByText('Aún no tienes cuentas')).toBeTruthy()

    const boton = screen.getByRole('button', { name: 'Crear mi primera cuenta' })
    boton.click()

    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Nombre' })
    )
  })

  it('Formulario de cuenta muestra el error junto a cada campo', async () => {
    const { createRef } = await import('react')
    const { FormularioCuenta } = await import('./FormularioCuenta')

    render(
      <FormularioCuenta
        formularioRef={createRef<HTMLFormElement>()}
        accion={() => {}}
        pendiente={false}
        estado={{
          errores: {
            nombre: ['El nombre es obligatorio'],
            tipo: ['Elige un tipo de cuenta'],
            saldoInicial: ['Escribe un saldo con hasta 2 decimales, por ejemplo 500.00'],
          },
        }}
      />
    )

    const nombre = screen.getByRole('textbox', { name: 'Nombre' })
    expect(nombre.getAttribute('aria-invalid')).toBe('true')
    const idErrorNombre = screen.getByText('El nombre es obligatorio').closest('[id]')?.id
    expect(idErrorNombre).toBeTruthy()
    expect(nombre.getAttribute('aria-describedby')).toContain(idErrorNombre!)

    const tipo = screen.getByRole('combobox', { name: 'Tipo' })
    expect(tipo.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Elige un tipo de cuenta')).toBeTruthy()

    const saldo = screen.getByRole('textbox', { name: /Saldo inicial/ })
    expect(saldo.getAttribute('aria-invalid')).toBe('true')
    expect(
      screen.getByText('Escribe un saldo con hasta 2 decimales, por ejemplo 500.00')
    ).toBeTruthy()
  })
})
