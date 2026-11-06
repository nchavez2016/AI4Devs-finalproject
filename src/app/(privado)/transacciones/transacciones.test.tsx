import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { cargarTransacciones } from '@/server/transacciones/pantalla'
import { createRef } from 'react'
import { ContenidoTransacciones } from './ContenidoTransacciones'
import { FormularioTransaccion } from './FormularioTransaccion'

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

  it('Listado muestra cada movimiento con su categoría, cuenta e importe con signo', async () => {
    const ingresoVentas = {
      id: 't2',
      tipo: 'INGRESO',
      monto: '100.00',
      fecha: '2026-09-27',
      descripcion: null,
      cuenta: { id: 'c1', nombre: 'Caja' },
      categoria: { id: 'i1', nombre: 'Ventas' },
      creadoEn: new Date(),
    }
    await mostrarPantalla({ transacciones: [gastoHarina, ingresoVentas] })

    const tabla = screen.getByRole('table')
    const cabeceras = within(tabla).getAllByRole('columnheader')
    expect(cabeceras.map((c) => c.textContent)).toEqual([
      'Fecha',
      'Descripción',
      'Categoría',
      'Cuenta',
      'Importe',
    ])

    const filas = within(tabla).getAllByRole('row').slice(1)
    const textos = filas.map((fila) =>
      within(fila)
        .getAllByRole('cell')
        .map((celda) => celda.textContent)
    )
    expect(textos).toEqual([
      ['28 sept 2026', 'Harina', 'Insumos', 'Caja', 'Gasto−$25,50'],
      ['27 sept 2026', '', 'Ventas', 'Caja', 'Ingreso+$100,00'],
    ])

    // Lista móvil: un grupo por día, con sus filas.
    const grupoDel28 = screen.getByRole('heading', { level: 3, name: 'lun, 28 sept' })
    const grupoDel27 = screen.getByRole('heading', { level: 3, name: 'dom, 27 sept' })
    expect(within(grupoDel28.parentElement!).getByText('Insumos')).toBeTruthy()
    expect(within(grupoDel28.parentElement!).getByText('Caja · Harina')).toBeTruthy()
    expect(within(grupoDel28.parentElement!).getByText('−$25,50')).toBeTruthy()
    expect(within(grupoDel27.parentElement!).getByText('Ventas')).toBeTruthy()
    expect(within(grupoDel27.parentElement!).getByText('+$100,00')).toBeTruthy()
  })

  it('Selector de tipo empieza en Gasto y filtra las categorías', async () => {
    await mostrarPantalla()

    const gasto = screen.getByRole('radio', { name: 'Gasto' }) as HTMLInputElement
    const ingreso = screen.getByRole('radio', { name: 'Ingreso' }) as HTMLInputElement
    expect(gasto.checked).toBe(true)
    expect(ingreso.checked).toBe(false)

    const opciones = () =>
      within(screen.getByRole('combobox', { name: 'Categoría' }))
        .getAllByRole('option')
        .map((opcion) => opcion.textContent)

    expect(opciones()).toEqual(['Arriendo', 'Insumos', 'Otros', 'Servicios básicos', 'Transporte'])

    fireEvent.click(ingreso)

    expect(ingreso.checked).toBe(true)
    expect(opciones()).toEqual(['Otros ingresos', 'Ventas'])
  })

  it('Formulario de transacción usa controles nativos y el monto con prefijo', async () => {
    const banco = { ...cuentaCaja, id: 'c2', nombre: 'Banco' }
    const { container } = await mostrarPantalla({ cuentas: [cuentaCaja, banco] })

    expect(container.querySelector('form')!.hasAttribute('novalidate')).toBe(true)

    const categoria = screen.getByRole('combobox', { name: 'Categoría' })
    const cuenta = screen.getByRole('combobox', { name: 'Cuenta' }) as HTMLSelectElement
    expect(categoria.tagName).toBe('SELECT')
    expect(cuenta.tagName).toBe('SELECT')
    expect(cuenta.selectedOptions[0].textContent).toBe('Caja')

    const monto = screen.getByRole('textbox', { name: 'Monto' }) as HTMLInputElement
    const contenedor = monto.closest('[data-campo-monto]')!
    expect(contenedor).toBeTruthy()
    expect(contenedor.textContent).toContain('$')
    expect(monto.getAttribute('inputmode')).toBe('decimal')
    expect(monto.name).toBe('monto')
  })

  it('El campo fecha del formulario muestra el día de hoy', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([cuentaCaja])
    listarCategoriasSimulado.mockResolvedValue(categoriasPorDefecto)
    listarTransaccionesSimulado.mockResolvedValue([])

    const datos = { ...(await cargarTransacciones({})), hoy: '2026-09-28' }
    render(<ContenidoTransacciones {...datos} />)

    expect((screen.getByLabelText('Fecha') as HTMLInputElement).value).toBe('2026-09-28')
    expect((screen.getByLabelText('Fecha') as HTMLInputElement).type).toBe('date')
  })

  it('Formulario de transacción muestra el error junto a cada campo', () => {
    render(
      <FormularioTransaccion
        formularioRef={createRef<HTMLFormElement>()}
        accion={() => {}}
        pendiente={false}
        categorias={categoriasPorDefecto as never}
        cuentas={[cuentaCaja] as never}
        hoy="2026-09-28"
        estado={{
          errores: {
            monto: ['El monto debe ser mayor que 0'],
            categoriaId: ['Elige una categoría'],
            cuentaId: ['Elige una de tus cuentas'],
            fecha: ['Indica la fecha'],
            tipo: ['Elige si es un gasto o un ingreso'],
          },
        }}
      />
    )

    const monto = screen.getByRole('textbox', { name: 'Monto' })
    expect(monto.getAttribute('aria-invalid')).toBe('true')
    const idErrorMonto = screen.getByText('El monto debe ser mayor que 0').closest('[id]')?.id
    expect(idErrorMonto).toBeTruthy()
    expect(monto.getAttribute('aria-describedby')).toContain(idErrorMonto!)

    const categoria = screen.getByRole('combobox', { name: 'Categoría' })
    expect(categoria.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Elige una categoría')).toBeTruthy()

    const cuenta = screen.getByRole('combobox', { name: 'Cuenta' })
    expect(cuenta.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Elige una de tus cuentas')).toBeTruthy()

    expect(screen.getByLabelText('Fecha').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Indica la fecha')).toBeTruthy()

    expect(screen.getByText('Elige si es un gasto o un ingreso')).toBeTruthy()

    // El foco va al primer campo inválido según el orden del formulario.
    expect(document.activeElement).toBe(monto)
  })

  it('La entrada de página se anima solo en el contenedor', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    const animados = container.querySelectorAll('.animate-entrada')
    expect(animados).toHaveLength(1)
    expect(animados[0].classList.contains('max-w-contenido')).toBe(true)
  })
})
