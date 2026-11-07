import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { cargarTransacciones } from '@/server/transacciones/pantalla'
import { createRef } from 'react'
import { ContenidoTransacciones } from './ContenidoTransacciones'
import { FormularioTransaccion } from './FormularioTransaccion'

const authSimulado = vi.fn()
const listarTransaccionesSimulado = vi.fn()
const listarCuentasSimulado = vi.fn()
const listarCategoriasSimulado = vi.fn()
const registrarTransaccionAccionSimulada = vi.fn()
const replaceSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: () => '/transacciones',
  useRouter: () => ({ replace: (...args: unknown[]) => replaceSimulado(...args), push: vi.fn() }),
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
  hoy?: string
}

// Carga los datos como lo hace la página y pinta la pantalla.
async function mostrarPantalla({
  cuentas = [cuentaCaja],
  categorias = categoriasPorDefecto,
  transacciones = [],
  filtros = {},
  hoy,
}: Escenario = {}) {
  authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
  listarCuentasSimulado.mockResolvedValue(cuentas)
  listarCategoriasSimulado.mockResolvedValue(categorias)
  listarTransaccionesSimulado.mockResolvedValue(transacciones)

  const datos = await cargarTransacciones(filtros)
  return render(<ContenidoTransacciones {...datos} hoy={hoy ?? datos.hoy} />)
}

// La navegación de los filtros tarda hasta que el test la termina. Si la promesa no se
// resolviera, su transición asíncrona seguiría pendiente y React la entrelazaría con las
// acciones de los tests siguientes, que nunca llegarían a confirmarse.
const navegacionesPendientes: (() => void)[] = []

function navegacionLenta() {
  replaceSimulado.mockImplementation(
    () => new Promise<void>((resolver) => navegacionesPendientes.push(resolver))
  )
}

describe('transacciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    replaceSimulado.mockReset()
  })

  afterEach(async () => {
    await act(async () => {
      navegacionesPendientes.splice(0).forEach((resolver) => resolver())
    })
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
      tarjeta.compareDocumentPosition(movimientos) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    const contenedorTarjeta = tarjeta.parentElement!
    expect(contenedorTarjeta.classList.contains('escritorio:col-start-2')).toBe(true)
    expect(contenedorTarjeta.classList.contains('escritorio:row-start-1')).toBe(true)
    expect(movimientos.classList.contains('escritorio:col-start-1')).toBe(true)
    expect(movimientos.classList.contains('escritorio:row-start-1')).toBe(true)

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
            descripcion: ['La descripción puede tener como máximo 255 caracteres'],
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

    expect(screen.getByRole('textbox', { name: /Descripción/ }).getAttribute('aria-invalid')).toBe(
      'true'
    )
    expect(screen.getByText('La descripción puede tener como máximo 255 caracteres')).toBeTruthy()

    // El foco va al primer campo inválido según el orden del formulario.
    expect(document.activeElement).toBe(monto)
  })

  it('Error al guardar la transacción conserva los datos escritos', () => {
    const banco = { ...cuentaCaja, id: 'c2', nombre: 'Banco' }
    render(
      <FormularioTransaccion
        formularioRef={createRef<HTMLFormElement>()}
        accion={() => {}}
        pendiente={false}
        categorias={categoriasPorDefecto as never}
        cuentas={[cuentaCaja, banco] as never}
        hoy="2026-09-28"
        estado={{
          mensaje: 'No pudimos guardar la transacción. Inténtalo de nuevo.',
          valores: {
            tipo: 'INGRESO',
            monto: '150.00',
            fecha: '2026-09-17',
            cuentaId: 'c2',
            categoriaId: 'i1',
            descripcion: 'Venta de producto',
          },
        }}
      />
    )

    const aviso = screen.getByRole('alert')
    expect(aviso.textContent).toContain('No pudimos guardar la transacción. Inténtalo de nuevo.')
    const boton = screen.getByRole('button', { name: 'Guardar transacción' })
    expect(aviso.compareDocumentPosition(boton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    expect((screen.getByRole('radio', { name: 'Ingreso' }) as HTMLInputElement).checked).toBe(true)
    expect((screen.getByRole('textbox', { name: 'Monto' }) as HTMLInputElement).value).toBe('150.00')
    expect((screen.getByLabelText('Fecha') as HTMLInputElement).value).toBe('2026-09-17')
    expect((screen.getByRole('combobox', { name: 'Cuenta' }) as HTMLSelectElement).value).toBe('c2')
    expect((screen.getByRole('combobox', { name: 'Categoría' }) as HTMLSelectElement).value).toBe(
      'i1'
    )
    expect(
      (screen.getByRole('textbox', { name: /Descripción/ }) as HTMLInputElement).value
    ).toBe('Venta de producto')

    // Un error general no lleva el foco a ningún campo.
    expect(document.body.contains(document.activeElement) && document.activeElement?.tagName).toBe(
      'BODY'
    )
  })

  it('Pantalla de transacciones sin movimientos muestra el estado vacío', async () => {
    await mostrarPantalla({ transacciones: [] })

    expect(
      screen.getByText('Todavía no tienes movimientos. Registra el primero con el formulario.')
    ).toBeTruthy()

    const boton = screen.getByRole('button', { name: 'Registrar movimiento' })
    expect(boton.className).toContain('bg-secondary')
    expect(boton.className).not.toContain('bg-primary')

    fireEvent.click(boton)

    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Monto' }))
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('Filtros sin resultados muestran el vacío por filtro', async () => {
    await mostrarPantalla({
      transacciones: [],
      filtros: { desde: '2026-09-01', hasta: '2026-09-15' },
    })

    expect(screen.getByText('No hay movimientos del 1 al 15 de septiembre.')).toBeTruthy()
    expect(screen.queryByText(/Todavía no tienes movimientos/)).toBeNull()

    const quitar = screen.getByRole('button', { name: 'Quitar filtros' })
    expect(quitar.className).toContain('text-primary')
    expect(quitar.className).not.toContain('bg-primary')
    expect(quitar.className).not.toContain('bg-secondary')

    fireEvent.click(quitar)

    expect(replaceSimulado).toHaveBeenCalledWith('/transacciones')
  })

  it('Cambiar un filtro actualiza la URL y conserva los datos mientras carga', async () => {
    // La navegación tarda: la transición sigue pendiente mientras llegan los datos nuevos.
    navegacionLenta()
    await mostrarPantalla({ transacciones: [gastoHarina] })

    expect(screen.queryByText('Actualizando…')).toBeNull()

    fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por tipo' }), {
      target: { value: 'GASTO' },
    })

    expect(replaceSimulado).toHaveBeenCalledWith('/transacciones?tipo=GASTO')
    expect(await screen.findByText('Actualizando…')).toBeTruthy()
    // Los movimientos anteriores siguen en pantalla.
    expect(within(screen.getByRole('table')).getByText('Harina')).toBeTruthy()
  })

  it('Los filtros de fechas y cuenta se combinan en la URL', async () => {
    navegacionLenta()
    await mostrarPantalla({
      transacciones: [gastoHarina],
      filtros: { tipo: 'GASTO' },
    })

    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-09-01' } })
    expect(replaceSimulado).toHaveBeenLastCalledWith('/transacciones?tipo=GASTO&desde=2026-09-01')

    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-09-15' } })
    expect(replaceSimulado).toHaveBeenLastCalledWith(
      '/transacciones?tipo=GASTO&hasta=2026-09-15'
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por cuenta' }), {
      target: { value: 'c1' },
    })
    expect(replaceSimulado).toHaveBeenLastCalledWith('/transacciones?tipo=GASTO&cuentaId=c1')

    fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por tipo' }), {
      target: { value: '' },
    })
    expect(replaceSimulado).toHaveBeenLastCalledWith('/transacciones')
  })

  it('Transacción registrada se anuncia y se resalta en el listado', async () => {
    const efectivo = { ...cuentaCaja, nombre: 'Efectivo' }
    const gastoNuevo = { ...gastoHarina, cuenta: { id: 'c1', nombre: 'Efectivo' } }
    const ingresoAnterior = {
      ...gastoHarina,
      id: 't0',
      tipo: 'INGRESO',
      monto: '100.00',
      fecha: '2026-09-27',
      descripcion: 'Venta previa',
      categoria: { id: 'i1', nombre: 'Ventas' },
      cuenta: { id: 'c1', nombre: 'Efectivo' },
    }
    registrarTransaccionAccionSimulada.mockResolvedValue({
      exito: true,
      idCreado: 't1',
      creado: { tipo: 'GASTO', monto: '25.50', cuentaNombre: 'Efectivo' },
    })
    await mostrarPantalla({ cuentas: [efectivo], transacciones: [gastoNuevo, ingresoAnterior] })

    const formulario = screen.getByRole('button', { name: 'Guardar transacción' }).closest('form')!
    await act(async () => {
      fireEvent.submit(formulario)
    })

    const aviso = screen.getByText('Gasto de $25,50 registrado en Efectivo.')
    expect(aviso.closest('[aria-live="polite"]')).toBeTruthy()

    const filaTabla = screen.getByText('Harina').closest('tr')!
    const filaLista = screen.getByText('Efectivo · Harina').closest('li')!
    expect(filaTabla.className).toContain('animate-resaltado')
    expect(filaLista.className).toContain('animate-resaltado')

    expect(screen.getByText('Venta previa').closest('tr')!.className).not.toContain(
      'animate-resaltado'
    )
    expect(screen.getByText('Efectivo · Venta previa').closest('li')!.className).not.toContain(
      'animate-resaltado'
    )
  })

  it('Un ingreso registrado se anuncia como ingreso', async () => {
    registrarTransaccionAccionSimulada.mockResolvedValue({
      exito: true,
      idCreado: 't1',
      creado: { tipo: 'INGRESO', monto: '1250.00', cuentaNombre: 'Banco' },
    })
    await mostrarPantalla({ transacciones: [gastoHarina] })

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Guardar transacción' }).closest('form')!)
    })

    expect(screen.getByText('Ingreso de $1.250,00 registrado en Banco.')).toBeTruthy()
  })

  it('La región de movimientos tiene un título de nivel 2 que la nombra', async () => {
    await mostrarPantalla({ transacciones: [gastoHarina] })

    const titulo = screen.getByRole('heading', { level: 2, name: 'Movimientos' })
    expect(titulo.className).toContain('font-titulo')
    expect(titulo.className).toContain('text-titulo-seccion')

    const region = screen.getByRole('region', { name: 'Movimientos' })
    expect(region.getAttribute('aria-labelledby')).toBe(titulo.id)
    expect(titulo.id).toBeTruthy()

    // El título va encima de los filtros y de la lista.
    expect(region.contains(titulo)).toBe(true)
    const filtros = within(region).getByRole('group', { name: 'Filtros' })
    expect(titulo.compareDocumentPosition(filtros) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('La tabla de movimientos cabe en su columna y la descripción absorbe el ancho sobrante', async () => {
    await mostrarPantalla({ transacciones: [gastoHarina] })

    // Un hijo de la rejilla necesita min-w-ninguno para poder encogerse.
    expect(screen.getByRole('region', { name: 'Movimientos' }).className).toContain('min-w-ninguno')

    const fila = within(screen.getByRole('table')).getAllByRole('row')[1]
    const [fecha, descripcion] = within(fila).getAllByRole('cell')
    expect(fecha.className).toContain('whitespace-nowrap')
    expect(descripcion.className).toContain('w-full')
    expect(descripcion.className).toContain('max-w-ninguno')
    expect(descripcion.className).toContain('truncate')
  })

  it('Quitar filtros solo aparece con un filtro activo', async () => {
    const sinFiltros = await mostrarPantalla({ transacciones: [gastoHarina] })
    expect(screen.queryByRole('button', { name: 'Quitar filtros' })).toBeNull()
    sinFiltros.unmount()

    await mostrarPantalla({ transacciones: [gastoHarina], filtros: { cuentaId: 'c1' } })
    const quitar = screen.getByRole('button', { name: 'Quitar filtros' })
    expect(quitar.className).toContain('text-primary')
    expect(screen.getAllByRole('button', { name: 'Quitar filtros' })).toHaveLength(1)

    fireEvent.click(quitar)
    expect(replaceSimulado).toHaveBeenCalledWith('/transacciones')
  })

  it('Filtros sin resultados que no son un rango de un mes dan un mensaje general', async () => {
    const casos: Record<string, string>[] = [
      { tipo: 'INGRESO' },
      { desde: '2026-09-20', hasta: '2026-10-05' },
      { desde: '2025-09-01', hasta: '2026-09-15' },
      { desde: '2026-09-01' },
    ]

    for (const filtros of casos) {
      const { unmount } = await mostrarPantalla({ transacciones: [], filtros })

      expect(screen.getByText('No hay movimientos con estos filtros.')).toBeTruthy()
      expect(screen.getAllByRole('button', { name: 'Quitar filtros' })).toHaveLength(1)
      unmount()
    }
  })

  it('La entrada de página se anima solo en el contenedor', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    const animados = container.querySelectorAll('.animate-entrada')
    expect(animados).toHaveLength(1)
    expect(animados[0].classList.contains('max-w-contenido')).toBe(true)
  })

  it('La región de avisos vacía no añade espacio bajo el encabezado', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    const contenedorAnimado = container.querySelector('.animate-entrada')!
    expect(contenedorAnimado.children).toHaveLength(2)

    const primerHijo = contenedorAnimado.children[0]
    const encabezado = within(primerHijo as HTMLElement).getByRole('heading', { level: 1, name: 'Transacciones' })
    const aviso = primerHijo.querySelector('[aria-live="polite"]')!
    expect(aviso).toBeTruthy()
    expect(encabezado.compareDocumentPosition(aviso) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('Los iconos del selector de tipo son decorativos', async () => {
    await mostrarPantalla({ transacciones: [gastoHarina] })

    const radioGasto = screen.getByRole('radio', { name: 'Gasto' })
    const radioIngreso = screen.getByRole('radio', { name: 'Ingreso' })
    expect(radioGasto).toBeTruthy()
    expect(radioIngreso).toBeTruthy()

    const labelGasto = radioGasto.closest('label')!
    const svgGasto = labelGasto.querySelector('svg')!
    expect(svgGasto).toBeTruthy()
    expect(svgGasto.getAttribute('aria-hidden')).toBe('true')
    expect(svgGasto.classList.contains('lucide-minus')).toBe(true)

    const labelIngreso = radioIngreso.closest('label')!
    const svgIngreso = labelIngreso.querySelector('svg')!
    expect(svgIngreso).toBeTruthy()
    expect(svgIngreso.getAttribute('aria-hidden')).toBe('true')
    expect(svgIngreso.classList.contains('lucide-plus')).toBe(true)
  })

  it('Abrir la pantalla de transacciones no mueve el foco', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    expect(document.activeElement).toBe(document.body)
    expect(container.querySelector('[autofocus]')).toBeNull()
  })

  it('El botón Guardar transacción queda fijo abajo en móvil', async () => {
    const { container } = await mostrarPantalla({ transacciones: [gastoHarina] })

    const boton = screen.getByRole('button', { name: 'Guardar transacción' })
    const form = boton.closest('form')!
    expect(form).toBeTruthy()

    const envoltorio = boton.parentElement!
    expect(envoltorio.classList.contains('fixed')).toBe(true)
    expect(envoltorio.classList.contains('inset-x-ninguno')).toBe(true)
    expect(envoltorio.classList.contains('bottom-ninguno')).toBe(true)
    expect(envoltorio.classList.contains('z-10')).toBe(true)
    expect(envoltorio.classList.contains('pb-relleno-barra-inferior')).toBe(true)
    expect(envoltorio.classList.contains('escritorio:static')).toBe(true)

    const main = container.querySelector('main')!
    expect(main.classList.contains('pb-reserva-barra-segura')).toBe(true)
    expect(main.classList.contains('escritorio:pb-seccion')).toBe(true)
  })

  it('La cabecera del día de hoy en la lista móvil empieza por Hoy', async () => {
    const gastoHoy = { ...gastoHarina, id: 't-hoy', fecha: '2026-11-06' }
    const gastoAyer = { ...gastoHarina, id: 't-ayer', fecha: '2026-11-05' }

    await mostrarPantalla({
      hoy: '2026-11-06',
      transacciones: [gastoHoy, gastoAyer],
    })

    const regionMovimientos = screen.getByRole('region', { name: 'Movimientos' })
    const cabeceras = within(regionMovimientos).getAllByRole('heading', { level: 3 })
    expect(cabeceras.map((c) => c.textContent)).toEqual(['Hoy · vie, 6 nov', 'jue, 5 nov'])
  })

  it('Los filtros empiezan plegados en móvil y se despliegan con el botón Filtros', async () => {
    await mostrarPantalla({ transacciones: [gastoHarina] })

    const botonFiltros = screen.getByRole('button', { name: /^Filtros/ })
    expect(botonFiltros.getAttribute('aria-expanded')).toBe('false')
    expect(botonFiltros.classList.contains('escritorio:hidden')).toBe(true)

    const idGrupo = botonFiltros.getAttribute('aria-controls')
    expect(idGrupo).toBeTruthy()

    const grupoFiltros = document.getElementById(idGrupo!)!
    expect(grupoFiltros).toBeTruthy()
    expect(grupoFiltros.classList.contains('hidden')).toBe(true)
    expect(grupoFiltros.classList.contains('escritorio:grid')).toBe(true)

    fireEvent.click(botonFiltros)
    expect(botonFiltros.getAttribute('aria-expanded')).toBe('true')
    expect(grupoFiltros.classList.contains('hidden')).toBe(false)

    fireEvent.click(botonFiltros)
    expect(botonFiltros.getAttribute('aria-expanded')).toBe('false')
    expect(grupoFiltros.classList.contains('hidden')).toBe(true)
  })

  it('El botón Filtros indica cuántos filtros hay activos', async () => {
    const { unmount: u1 } = await mostrarPantalla({ transacciones: [gastoHarina], filtros: {} })
    expect(screen.getByRole('button', { name: 'Filtros' })).toBeTruthy()
    u1()

    const { unmount: u2 } = await mostrarPantalla({
      transacciones: [gastoHarina],
      filtros: { tipo: 'GASTO', cuentaId: 'c1' },
    })
    expect(screen.getByRole('button', { name: 'Filtros (2)' })).toBeTruthy()
    u2()

    const { unmount: u3 } = await mostrarPantalla({
      transacciones: [gastoHarina],
      filtros: { desde: '2026-09-01', hasta: '2026-09-30', tipo: 'GASTO', cuentaId: 'c1' },
    })
    expect(screen.getByRole('button', { name: 'Filtros (4)' })).toBeTruthy()
    u3()
  })

  it('Quitar filtros y Actualizando siguen visibles con los filtros plegados', async () => {
    const { container } = await mostrarPantalla({
      transacciones: [gastoHarina],
      filtros: { tipo: 'GASTO' },
    })

    const grupoFiltros = screen.getByRole('group', { name: 'Filtros' })
    const botonQuitar = screen.getByRole('button', { name: 'Quitar filtros' })
    const regionActualizando = container.querySelector('p[aria-live="polite"]')!
    expect(regionActualizando).toBeTruthy()

    expect(grupoFiltros.contains(botonQuitar)).toBe(false)
    expect(grupoFiltros.contains(regionActualizando)).toBe(false)
  })
})
