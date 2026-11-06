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

const gastoHarina = {
  id: 't1',
  tipo: 'GASTO',
  monto: '25.50',
  fecha: '2026-09-28',
  descripcion: 'Harina',
  cuenta: { id: 'c1', nombre: 'Caja' },
  categoria: { id: 'g1', nombre: 'Insumos' },
  creadoEn: new Date(),
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

  it('Pantalla de transacciones muestra los movimientos y el formulario en dos columnas', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    expect(screen.getByRole('heading', { level: 1, name: 'Transacciones' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()

    const rejilla = container.querySelector('[class*="columnas-lista-formulario"]')!
    expect(rejilla).toBeTruthy()

    const movimientos = screen.getByRole('region', { name: 'Movimientos' })
    const titulo = screen.getByRole('heading', { level: 2, name: 'Nueva transacción' })
    const tarjeta = titulo.closest('[class*="shadow-tarjeta"]')!
    expect(tarjeta).toBeTruthy()
    expect(rejilla.contains(movimientos)).toBe(true)
    expect(rejilla.contains(tarjeta)).toBe(true)
    expect(
      movimientos.compareDocumentPosition(tarjeta) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    const formulario = screen.getByRole('button', { name: 'Guardar transacción' }).closest('form')
    expect(tarjeta.contains(formulario)).toBe(true)

    const primarios = screen
      .getAllByRole('button')
      .filter((boton) => boton.className.includes('bg-primary'))
    expect(primarios.map((boton) => boton.textContent)).toEqual(['Guardar transacción'])
  })

  it('La entrada de página se anima solo en el contenedor', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    const animados = container.querySelectorAll('.animate-entrada')
    expect(animados).toHaveLength(1)
    expect(animados[0].classList.contains('max-w-contenido')).toBe(true)
  })
})
