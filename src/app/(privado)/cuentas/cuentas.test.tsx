import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'

const authSimulado = vi.fn()
const listarCuentasSimulado = vi.fn()
const crearCuentaAccionSimulada = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('@/server/cuentas/cuentas', () => ({
  listarCuentas: (...args: unknown[]) => listarCuentasSimulado(...args),
}))

vi.mock('@/server/cuentas/acciones', () => ({
  crearCuentaAccion: (...args: unknown[]) => crearCuentaAccionSimulada(...args),
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

  it('Pantalla de cuentas explica para qué sirve', async () => {
    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')
    const explicacion =
      'Aquí registras dónde tienes tu dinero: bancos, efectivo y billeteras digitales.'

    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })

    listarCuentasSimulado.mockResolvedValueOnce([])
    const vacia = render(<ContenidoCuentas {...(await cargarCuentas())} />)
    expect(
      screen.getByRole('heading', { level: 1 }).nextElementSibling?.textContent
    ).toBe(explicacion)
    vacia.unmount()

    listarCuentasSimulado.mockResolvedValueOnce([
      { id: 'c1', nombre: 'Banco Pichincha', tipo: 'BANCO', saldo: '500.00', creadoEn: new Date() },
    ])
    render(<ContenidoCuentas {...(await cargarCuentas())} />)
    expect(
      screen.getByRole('heading', { level: 1 }).nextElementSibling?.textContent
    ).toBe(explicacion)
  })

  it('Pantalla de cuentas sin cuentas muestra el estado vacío', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([])

    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')

    const datos = await cargarCuentas()
    render(<ContenidoCuentas {...datos} />)

    expect(
      screen.getByText('Todavía no tienes cuentas. Crea una para empezar a registrar movimientos.')
    ).toBeTruthy()

    const boton = screen
      .getAllByRole('button', { name: 'Crear cuenta' })
      .find((candidato) => !candidato.closest('form'))!
    expect(boton).toBeTruthy()
    expect(boton.className).toContain('bg-secondary')
    expect(boton.className).not.toContain('bg-primary')
    boton.click()

    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Nombre' })
    )
  })

  it('Cuenta creada se anuncia y se resalta en la lista', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([
      { id: 'c1', nombre: 'Banco Pichincha', tipo: 'BANCO', saldo: '500.00', creadoEn: new Date() },
      { id: 'c2', nombre: 'Caja chica', tipo: 'EFECTIVO', saldo: '20.00', creadoEn: new Date() },
    ])
    crearCuentaAccionSimulada.mockResolvedValue({ exito: true, idCreado: 'c2' })

    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')

    const datos = await cargarCuentas()
    render(<ContenidoCuentas {...datos} />)

    const formulario = screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')!
    await act(async () => {
      fireEvent.submit(formulario)
    })

    expect(screen.getByText('Cuenta Caja chica creada.').closest('[aria-live="polite"]')).toBeTruthy()

    const filaNueva = screen.getByText('Caja chica').closest('li')!
    expect(filaNueva.className).toContain('animate-resaltado')

    const filaAnterior = screen.getByText('Banco Pichincha').closest('li')!
    expect(filaAnterior.className).not.toContain('animate-resaltado')
  })

  it('Error al guardar la cuenta conserva los datos escritos', async () => {
    const { createRef } = await import('react')
    const { FormularioCuenta } = await import('./FormularioCuenta')

    render(
      <FormularioCuenta
        formularioRef={createRef<HTMLFormElement>()}
        accion={() => {}}
        pendiente={false}
        estado={{
          mensaje: 'No pudimos guardar la cuenta. Inténtalo de nuevo.',
          valores: { nombre: 'Banco Pichincha', tipo: 'DIGITAL', saldoInicial: '500,50' },
        }}
      />
    )

    expect(screen.getByRole('alert').textContent).toContain(
      'No pudimos guardar la cuenta. Inténtalo de nuevo.'
    )
    expect((screen.getByRole('textbox', { name: 'Nombre' }) as HTMLInputElement).value).toBe(
      'Banco Pichincha'
    )
    expect((screen.getByRole('combobox', { name: 'Tipo' }) as HTMLSelectElement).value).toBe(
      'DIGITAL'
    )
    expect((screen.getByRole('textbox', { name: /Saldo inicial/ }) as HTMLInputElement).value).toBe(
      '500,50'
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

  it('Pantalla de cuentas muestra la lista y el formulario en dos columnas', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([
      { id: 'c1', nombre: 'Banco Pichincha', tipo: 'BANCO', saldo: '500.00', creadoEn: new Date() },
    ])

    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')

    const { container } = render(<ContenidoCuentas {...(await cargarCuentas())} />)

    const rejilla = container.querySelector('[class*="columnas-lista-formulario"]')!
    expect(rejilla).toBeTruthy()

    const lista = screen.getByRole('list', { name: 'Cuentas' })
    const titulo = screen.getByRole('heading', { level: 2, name: 'Nueva cuenta' })
    const tarjeta = titulo.closest('[class*="shadow-tarjeta"]')!
    expect(tarjeta).toBeTruthy()
    expect(rejilla.contains(lista)).toBe(true)
    expect(rejilla.contains(tarjeta)).toBe(true)
    expect(lista.compareDocumentPosition(tarjeta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const formulario = screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')
    expect(tarjeta.contains(formulario)).toBe(true)

    const primarios = screen
      .getAllByRole('button')
      .filter((boton) => boton.className.includes('bg-primary'))
    expect(primarios.map((boton) => boton.textContent)).toEqual(['Crear cuenta'])

    expect(container.querySelector('.animate-entrada')).toBeTruthy()
  })

  it('Pantalla de cuentas limita el ancho del contenido y del formulario', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usr_a' } })
    listarCuentasSimulado.mockResolvedValue([])

    const { cargarCuentas } = await import('@/server/cuentas/pantalla')
    const { ContenidoCuentas } = await import('./ContenidoCuentas')

    const { container } = render(<ContenidoCuentas {...(await cargarCuentas())} />)

    const contenedorContenido = container.querySelector('.max-w-contenido')
    expect(contenedorContenido).toBeTruthy()

    const contenedorFormulario = container.querySelector('.max-w-formulario')
    expect(contenedorFormulario).toBeTruthy()

    const form = contenedorFormulario?.querySelector('form')
    expect(form).toBeTruthy()
    expect(contenedorContenido?.contains(contenedorFormulario)).toBe(true)
  })
})
