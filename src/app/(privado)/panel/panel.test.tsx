import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import type { DatosDashboard } from '@/server/dashboard/pantalla'

const authSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: authSimulado,
}))

vi.mock('@/server/auth/acciones', () => ({
  cerrarSesion: vi.fn(),
}))

// cargarDashboard consulta la base de datos: estos tests solo comprueban la pantalla.
vi.mock('@/server/dashboard/dashboard', () => ({
  calcularResumen: () =>
    Promise.resolve({
      totalIngresos: '0.00',
      totalGastos: '0.00',
      balance: '0.00',
      saldosPorCuenta: [],
      topCategoriasGasto: [],
    }),
}))

vi.mock('@/server/repositories/transaccionRepository', () => ({
  transaccionRepository: { existeAlguna: () => Promise.resolve(false) },
}))

const resumenVacio: DatosDashboard['resumen'] = {
  totalIngresos: '0.00',
  totalGastos: '0.00',
  balance: '0.00',
  saldosPorCuenta: [],
  topCategoriasGasto: [],
}

function datos(parcial: Partial<DatosDashboard> = {}): DatosDashboard {
  return {
    nombreNegocio: 'Tienda Ana',
    periodo: 'mes',
    hayTransacciones: false,
    resumen: resumenVacio,
    ...parcial,
  }
}

describe('panel', () => {
  it('El panel muestra el negocio del usuario autenticado', async () => {
    authSimulado.mockResolvedValue({
      user: {
        id: 'usr_a',
        nombre: 'Ana',
        nombreNegocio: 'Tienda Ana',
        email: 'ana@tienda.ec',
      },
    })

    const { cargarDashboard } = await import('@/server/dashboard/pantalla')
    const { ContenidoPanel } = await import('./ContenidoPanel')

    const datosPanel = await cargarDashboard({})
    render(<ContenidoPanel {...datosPanel} />)

    expect(screen.getByText('Tienda Ana')).toBeTruthy()
    expect(screen.queryByText('Taller Beto')).toBeNull()
  })

  it('El panel usa el encabezado de página', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel {...datos()} />)

    const h1 = screen.getByRole('heading', { level: 1, name: 'Tienda Ana' })
    expect(h1).toBeTruthy()
    expect(h1.nextElementSibling?.textContent).toBe(
      'Resumen de lo que entra y sale de tu negocio.'
    )
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
  })

  it('Dashboard sin datos', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel {...datos()} />)

    const totales = screen.getByRole('region', { name: 'Totales del período' })
    expect(within(totales).getAllByText('$0,00')).toHaveLength(3)
    expect(
      screen.getByText('Todavía no has registrado movimientos. Registra el primero para ver tu resumen.')
    ).toBeTruthy()
    const registrar = screen.getByRole('link', { name: 'Registrar movimiento' })
    expect(registrar.getAttribute('href')).toBe('/transacciones')
  })

  it('El dashboard tiene una sola acción primaria', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(
      <ContenidoPanel
        {...datos({
          hayTransacciones: true,
          resumen: { ...resumenVacio, totalIngresos: '100.00', balance: '100.00' },
        })}
      />
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Tienda Ana' })).toBeTruthy()
    const registrar = screen.getAllByRole('link', { name: 'Registrar movimiento' })
    expect(registrar).toHaveLength(1)
    expect(registrar[0].getAttribute('href')).toBe('/transacciones')
    const primarios = [...screen.queryAllByRole('link'), ...screen.queryAllByRole('button')].filter(
      (elemento) => elemento.className.includes('bg-primary')
    )
    expect(primarios).toEqual(registrar)
  })

  it('El balance negativo se muestra con su signo', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(
      <ContenidoPanel
        {...datos({
          hayTransacciones: true,
          resumen: {
            ...resumenVacio,
            totalIngresos: '50.00',
            totalGastos: '80.25',
            balance: '-30.25',
          },
        })}
      />
    )

    const totales = screen.getByRole('region', { name: 'Totales del período' })
    const balance = within(totales).getByText('−$30,25')
    expect(balance).toBeTruthy()
    expect(within(totales).getByText('Saldo negativo')).toBeTruthy()
  })

  it('Usuario sin cuentas ve cómo crear una', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel {...datos({ hayTransacciones: true })} />)

    const saldos = screen.getByRole('region', { name: 'Saldos por cuenta' })
    expect(within(saldos).getByText('Todavía no tienes cuentas.')).toBeTruthy()
    const crear = within(saldos).getByRole('link', { name: 'Crear cuenta' })
    expect(crear.getAttribute('href')).toBe('/cuentas')
    expect(crear.className).not.toContain('bg-primary')
  })

  it('El panel muestra el saldo de cada cuenta', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(
      <ContenidoPanel
        {...datos({
          hayTransacciones: true,
          resumen: {
            ...resumenVacio,
            saldosPorCuenta: [
              { cuentaId: 'cta_1', nombre: 'Banco', saldo: '650.00' },
              { cuentaId: 'cta_2', nombre: 'Caja', saldo: '-12.75' },
            ],
          },
        })}
      />
    )

    const saldos = screen.getByRole('region', { name: 'Saldos por cuenta' })
    const filas = within(saldos).getAllByRole('listitem')
    expect(filas).toHaveLength(2)
    expect(within(filas[0]).getByText('Banco')).toBeTruthy()
    expect(within(filas[0]).getByText('$650,00')).toBeTruthy()
    expect(within(filas[1]).getByText('Caja')).toBeTruthy()
    expect(within(filas[1]).getByText('−$12,75')).toBeTruthy()
    expect(within(filas[1]).getByText('Saldo negativo')).toBeTruthy()
    expect(within(saldos).queryByText('Todavía no tienes cuentas.')).toBeNull()
  })

  it('El panel muestra las categorías de gasto del período', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(
      <ContenidoPanel
        {...datos({
          hayTransacciones: true,
          resumen: {
            ...resumenVacio,
            totalGastos: '495.25',
            topCategoriasGasto: [
              { categoria: 'Arriendo', total: '400.00' },
              { categoria: 'Insumos', total: '95.25' },
            ],
          },
        })}
      />
    )

    const seccion = screen.getByRole('region', { name: 'Categorías de gasto' })
    expect(within(seccion).getByRole('table')).toBeTruthy()
    expect(within(seccion).getByText('Arriendo')).toBeTruthy()
    expect(within(seccion).getByText('$95,25')).toBeTruthy()
  })

  it('Período sin movimientos muestra el aviso del período', async () => {
    const { ContenidoPanel } = await import('./ContenidoPanel')

    render(<ContenidoPanel {...datos({ hayTransacciones: true })} />)

    const totales = screen.getByRole('region', { name: 'Totales del período' })
    expect(within(totales).getAllByText('$0,00')).toHaveLength(3)
    expect(screen.getByText('No hay movimientos en este período.')).toBeTruthy()
    expect(screen.queryByText(/Todavía no has registrado movimientos/)).toBeNull()
  })
})
