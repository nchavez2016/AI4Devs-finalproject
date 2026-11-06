import { beforeEach, describe, expect, it, vi } from 'vitest'

const authSimulado = vi.fn()
const redirectSimulado = vi.fn()
const registrarTransaccionSimulado = vi.fn()
const revalidatePathSimulado = vi.fn()

vi.mock('@/auth', () => ({
  auth: () => authSimulado(),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectSimulado(url),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathSimulado(...args),
}))

vi.mock('./transacciones', () => ({
  registrarTransaccion: (...args: unknown[]) => registrarTransaccionSimulado(...args),
}))

function formularioDeGasto() {
  const formData = new FormData()
  formData.set('tipo', 'GASTO')
  formData.set('monto', '25.50')
  formData.set('fecha', '2026-09-28')
  formData.set('cuentaId', 'cuenta-1')
  formData.set('categoriaId', 'categoria-1')
  formData.set('descripcion', 'Harina')
  return formData
}

const transaccionCreada = {
  id: 't1',
  tipo: 'GASTO',
  monto: '25.50',
  fecha: '2026-09-28',
  descripcion: 'Harina',
  cuenta: { id: 'cuenta-1', nombre: 'Efectivo' },
  categoria: { id: 'categoria-1', nombre: 'Insumos' },
  creadoEn: new Date(),
}

describe('registrarTransaccionAccion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('La transacción se crea siempre para el usuario de la sesión', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    registrarTransaccionSimulado.mockResolvedValue({ ok: true, transaccion: transaccionCreada })

    const { registrarTransaccionAccion } = await import('./acciones')

    const formData = formularioDeGasto()
    formData.set('usuarioId', 'usuario-b')

    await registrarTransaccionAccion(undefined, formData)

    expect(registrarTransaccionSimulado).toHaveBeenCalledWith('usuario-a', {
      tipo: 'GASTO',
      monto: '25.50',
      fecha: '2026-09-28',
      cuentaId: 'cuenta-1',
      categoriaId: 'categoria-1',
      descripcion: 'Harina',
    })
  })

  it('registrarTransaccionAccion revalida /transacciones y devuelve lo creado', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    registrarTransaccionSimulado.mockResolvedValue({ ok: true, transaccion: transaccionCreada })

    const { registrarTransaccionAccion } = await import('./acciones')

    const estado = await registrarTransaccionAccion(undefined, formularioDeGasto())

    expect(revalidatePathSimulado).toHaveBeenCalledWith('/transacciones')
    expect(estado).toEqual({
      exito: true,
      idCreado: 't1',
      creado: { tipo: 'GASTO', monto: '25.50', cuentaNombre: 'Efectivo' },
    })
  })

  it('registrarTransaccionAccion devuelve los errores por campo del caso de uso', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    registrarTransaccionSimulado.mockResolvedValue({
      ok: false,
      errores: { monto: ['El monto debe ser mayor que 0'] },
    })

    const { registrarTransaccionAccion } = await import('./acciones')

    const estado = await registrarTransaccionAccion(undefined, formularioDeGasto())

    expect(estado).toEqual({ errores: { monto: ['El monto debe ser mayor que 0'] } })
    expect(revalidatePathSimulado).not.toHaveBeenCalled()
  })

  it('registrarTransaccionAccion convierte un error inesperado en el aviso y conserva los valores', async () => {
    authSimulado.mockResolvedValue({ user: { id: 'usuario-a' } })
    registrarTransaccionSimulado.mockRejectedValue(new Error('conexión perdida'))

    const { registrarTransaccionAccion } = await import('./acciones')

    const estado = await registrarTransaccionAccion(undefined, formularioDeGasto())

    expect(estado).toEqual({
      mensaje: 'No pudimos guardar la transacción. Inténtalo de nuevo.',
      valores: {
        tipo: 'GASTO',
        monto: '25.50',
        fecha: '2026-09-28',
        cuentaId: 'cuenta-1',
        categoriaId: 'categoria-1',
        descripcion: 'Harina',
      },
    })
  })

  it('Registrar una transacción sin sesión redirige al login', async () => {
    authSimulado.mockResolvedValue(null)
    redirectSimulado.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    const { registrarTransaccionAccion } = await import('./acciones')

    await expect(registrarTransaccionAccion(undefined, formularioDeGasto())).rejects.toThrow(
      'NEXT_REDIRECT'
    )

    expect(redirectSimulado).toHaveBeenCalledWith('/login')
    expect(registrarTransaccionSimulado).not.toHaveBeenCalled()
  })
})
