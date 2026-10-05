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
})
