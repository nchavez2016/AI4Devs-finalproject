import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const authSimulado = vi.fn()
const listarTransaccionesSimulado = vi.fn()
const listarCuentasSimulado = vi.fn()
const listarCategoriasSimulado = vi.fn()
const registrarTransaccionAccionSimulada = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: () => '/transacciones',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/server/transacciones/transacciones', () => ({
  listarTransacciones: (...args: unknown[]) => listarTransaccionesSimulado(...args),
}))

vi.mock('@/server/cuentas/cuentas', () => ({
  listarCuentas: (...args: unknown[]) => listarCuentasSimulado(...args),
}))

vi.mock('@/server/categorias/categorias', () => ({
  listarCategorias: (...args: unknown[]) => listarCategoriasSimulado(...args),
}))

vi.mock('@/server/transacciones/acciones', () => ({
  registrarTransaccionAccion: (...args: unknown[]) => registrarTransaccionAccionSimulada(...args),
}))

const cuentaCaja = {
  id: 'c1',
  nombre: 'Caja',
  tipo: 'EFECTIVO',
  saldo: '100.00',
  creadoEn: new Date(),
}

const categoriasPorDefecto = {
  gasto: ['Arriendo', 'Insumos', 'Otros', 'Servicios básicos', 'Transporte'].map((nombre, i) => ({
    id: `g${i}`,
    nombre,
    tipo: 'GASTO',
    categoriaPadreId: null,
    creadoEn: new Date(),
  })),
  ingreso: ['Otros ingresos', 'Ventas'].map((nombre, i) => ({
    id: `i${i}`,
    nombre,
    tipo: 'INGRESO',
    categoriaPadreId: null,
    creadoEn: new Date(),
  })),
}

interface Escenario {
  cuentas?: unknown[]
  categorias?: unknown
  transacciones?: unknown[]
  filtros?: Record<string, string>
}

// Carga los datos como lo hace la página y pinta la pantalla.
async function mostrarPantalla({
  cuentas = [cuentaCaja],
  categorias = categoriasPorDefecto,
  transacciones = [],
  filtros = {},
}: Escenario = {}) {
  authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
  listarCuentasSimulado.mockResolvedValue(cuentas)
  listarCategoriasSimulado.mockResolvedValue(categorias)
  listarTransaccionesSimulado.mockResolvedValue(transacciones)

  const { cargarTransacciones } = await import('@/server/transacciones/pantalla')
  const { ContenidoTransacciones } = await import('./ContenidoTransacciones')

  const datos = await cargarTransacciones(filtros)
  return render(<ContenidoTransacciones {...datos} />)
}

describe('transacciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Pantalla de transacciones sin cuentas pide crear una cuenta primero', async () => {
    await mostrarPantalla({ cuentas: [] })

    expect(screen.getByRole('heading', { level: 1, name: 'Transacciones' })).toBeTruthy()
    expect(
      screen.getByText('Todavía no tienes cuentas. Crea una para empezar a registrar movimientos.')
    ).toBeTruthy()

    const enlace = screen.getByRole('link', { name: 'Crear cuenta' })
    expect(enlace.getAttribute('href')).toBe('/cuentas')
    expect(enlace.className).toContain('bg-primary')

    expect(screen.queryByRole('button', { name: 'Guardar transacción' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Nueva transacción' })).toBeNull()
  })
})
