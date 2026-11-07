import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { crearCuentaDePrueba, registrar, registrarUsuarioDePrueba } from '@/test/bd/datos'
import { crearCategoria } from '@/server/categorias/categorias'
import { cargarDashboard } from './pantalla'

const { authSimulado, redirectSimulado } = vi.hoisted(() => ({
  authSimulado: vi.fn(),
  redirectSimulado: vi.fn((ruta: string) => {
    throw new Error(`NEXT_REDIRECT:${ruta}`)
  }),
}))

vi.mock('@/auth', () => ({
  auth: authSimulado,
}))

vi.mock('next/navigation', () => ({
  redirect: redirectSimulado,
}))

function iniciarSesion(usuarioId: string, nombreNegocio: string) {
  authSimulado.mockResolvedValue({ user: { id: usuarioId, nombreNegocio } })
}

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
  // Solo se simula Date: las promesas y la conexión a la base siguen reales.
  vi.useFakeTimers({ toFake: ['Date'] })
  // Viernes 6 de noviembre de 2026, mediodía en Ecuador.
  vi.setSystemTime(new Date('2026-11-06T17:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
  authSimulado.mockReset()
  redirectSimulado.mockClear()
})

describe('cargarDashboard', () => {
  it('El dashboard no incluye datos de otro usuario', async () => {
    const usuarioA = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cajaA = await crearCuentaDePrueba(usuarioA, 'Caja')
    await registrar(usuarioA, {
      tipo: 'GASTO',
      monto: '10.00',
      fecha: '2026-11-02',
      cuentaId: cajaA,
      categoria: 'Insumos',
    })

    const usuarioB = await registrarUsuarioDePrueba('Beto', 'beto@bazar.ec')
    const bancoB = await crearCuentaDePrueba(usuarioB, 'Banco Beto')
    const publicidad = await crearCategoria(usuarioB, { nombre: 'Publicidad', tipo: 'GASTO' })
    if (!publicidad.ok) throw new Error('Falló la creación de la categoría')
    await registrar(usuarioB, {
      tipo: 'INGRESO',
      monto: '999.99',
      fecha: '2026-11-02',
      cuentaId: bancoB,
      categoria: 'Ventas',
    })
    await registrar(usuarioB, {
      tipo: 'GASTO',
      monto: '500.00',
      fecha: '2026-11-03',
      cuentaId: bancoB,
      categoria: 'Publicidad',
    })

    iniciarSesion(usuarioA, 'Negocio de Ana')
    const datos = await cargarDashboard({})

    expect(datos.resumen.totalIngresos).toBe('0.00')
    expect(datos.resumen.totalGastos).toBe('10.00')
    const texto = JSON.stringify(datos)
    expect(texto).not.toContain('Publicidad')
    expect(texto).not.toContain('Banco Beto')
  })

  it('El período por defecto es el mes en curso', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '100.00',
      fecha: '2026-11-02',
      cuentaId,
      categoria: 'Ventas',
    })
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '50.00',
      fecha: '2026-10-30',
      cuentaId,
      categoria: 'Ventas',
    })

    iniciarSesion(usuarioId, 'Negocio de Ana')
    const datos = await cargarDashboard({})

    expect(datos.periodo).toBe('mes')
    expect(datos.resumen.totalIngresos).toBe('100.00')
  })

  it('Un período inválido en la URL se trata como mes', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '100.00',
      fecha: '2026-11-02',
      cuentaId,
      categoria: 'Ventas',
    })

    iniciarSesion(usuarioId, 'Negocio de Ana')
    const datos = await cargarDashboard({ periodo: 'anio' })

    expect(datos.periodo).toBe('mes')
    expect(datos.resumen.totalIngresos).toBe('100.00')
  })

  it('Los límites del período usan la fecha de Ecuador', async () => {
    // 03:30 UTC del 1 de diciembre son las 22:30 del 30 de noviembre en Ecuador (UTC-5).
    vi.setSystemTime(new Date('2026-12-01T03:30:00Z'))
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '80.00',
      fecha: '2026-11-30',
      cuentaId,
      categoria: 'Ventas',
    })
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '15.00',
      fecha: '2026-12-01',
      cuentaId,
      categoria: 'Ventas',
    })

    iniciarSesion(usuarioId, 'Negocio de Ana')
    const datos = await cargarDashboard({ periodo: 'mes' })

    expect(datos.resumen.totalIngresos).toBe('80.00')
  })

  it('Abrir el dashboard sin sesión redirige al login', async () => {
    authSimulado.mockResolvedValue(null)

    await expect(cargarDashboard({})).rejects.toThrow('NEXT_REDIRECT:/login')
    expect(redirectSimulado).toHaveBeenCalledWith('/login')
  })
})
