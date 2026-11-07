import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { crearCuentaDePrueba, registrar, registrarUsuarioDePrueba } from '@/test/bd/datos'
import { crearCategoria } from '@/server/categorias/categorias'
import { calcularResumen } from './dashboard'

// "Hoy" de los escenarios: viernes 6 de noviembre de 2026 en Ecuador.
const HOY = '2026-11-06'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

describe('dashboard', () => {
  it('Ver totales del período', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '1200.00',
      fecha: '2026-11-02',
      cuentaId,
      categoria: 'Ventas',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '400.00',
      fecha: '2026-11-03',
      cuentaId,
      categoria: 'Arriendo',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '380.50',
      fecha: '2026-11-05',
      cuentaId,
      categoria: 'Insumos',
    })

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.totalIngresos).toBe('1200.00')
    expect(resumen.totalGastos).toBe('780.50')
    expect(resumen.balance).toBe('419.50')
  })

  it('El período día solo cuenta las transacciones de hoy', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '12.40',
      fecha: '2026-11-06',
      cuentaId,
      categoria: 'Insumos',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '7.60',
      fecha: '2026-11-05',
      cuentaId,
      categoria: 'Insumos',
    })

    const resumen = await calcularResumen(usuarioId, 'dia', HOY)

    expect(resumen.totalGastos).toBe('12.40')
  })

  it('El período semana va de lunes a domingo', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    const gastos = [
      { monto: '10.00', fecha: '2026-11-01' },
      { monto: '20.25', fecha: '2026-11-02' },
      { monto: '30.50', fecha: '2026-11-08' },
      { monto: '40.00', fecha: '2026-11-09' },
    ]
    for (const gasto of gastos) {
      await registrar(usuarioId, { tipo: 'GASTO', ...gasto, cuentaId, categoria: 'Insumos' })
    }

    const resumen = await calcularResumen(usuarioId, 'semana', HOY)

    expect(resumen.totalGastos).toBe('50.75')
  })

  it('Las transacciones fuera del período no cuentan en los totales', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    const ingresos = [
      { monto: '300.00', fecha: '2026-10-31' },
      { monto: '45.50', fecha: '2026-11-01' },
      { monto: '4.50', fecha: '2026-11-30' },
    ]
    for (const ingreso of ingresos) {
      await registrar(usuarioId, { tipo: 'INGRESO', ...ingreso, cuentaId, categoria: 'Ventas' })
    }

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.totalIngresos).toBe('50.00')
  })

  it('Los importes del dashboard se suman sin redondeos intermedios', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '0.10',
      fecha: '2026-11-02',
      cuentaId,
      categoria: 'Ventas',
    })
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '0.20',
      fecha: '2026-11-03',
      cuentaId,
      categoria: 'Ventas',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '0.30',
      fecha: '2026-11-04',
      cuentaId,
      categoria: 'Insumos',
    })

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.totalIngresos).toBe('0.30')
    expect(resumen.totalGastos).toBe('0.30')
    expect(resumen.balance).toBe('0.00')
  })

  it('Ver saldo por cuenta', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const banco = await crearCuentaDePrueba(usuarioId, 'Banco', '500.00')
    const caja = await crearCuentaDePrueba(usuarioId, 'Caja', '0.00')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '200.00',
      fecha: '2026-11-02',
      cuentaId: banco,
      categoria: 'Ventas',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '50.00',
      fecha: '2026-11-03',
      cuentaId: banco,
      categoria: 'Insumos',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '12.75',
      fecha: '2026-11-04',
      cuentaId: caja,
      categoria: 'Transporte',
    })

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.saldosPorCuenta).toEqual([
      { cuentaId: banco, nombre: 'Banco', saldo: '650.00' },
      { cuentaId: caja, nombre: 'Caja', saldo: '-12.75' },
    ])
  })

  it('El saldo por cuenta incluye movimientos fuera del período', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const banco = await crearCuentaDePrueba(usuarioId, 'Banco', '100.00')
    await registrar(usuarioId, {
      tipo: 'INGRESO',
      monto: '25.25',
      fecha: '2026-10-15',
      cuentaId: banco,
      categoria: 'Ventas',
    })

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.saldosPorCuenta).toEqual([{ cuentaId: banco, nombre: 'Banco', saldo: '125.25' }])
    expect(resumen.totalIngresos).toBe('0.00')
  })

  it('Ver principales categorías de gasto', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    const gastos = [
      { monto: '95.25', fecha: '2026-11-02', categoria: 'Insumos' },
      { monto: '400.00', fecha: '2026-11-03', categoria: 'Arriendo' },
      { monto: '120.00', fecha: '2026-11-04', categoria: 'Servicios básicos' },
      { monto: '60.50', fecha: '2026-11-05', categoria: 'Servicios básicos' },
    ]
    for (const gasto of gastos) {
      await registrar(usuarioId, { tipo: 'GASTO', ...gasto, cuentaId })
    }

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.topCategoriasGasto).toEqual([
      { categoria: 'Arriendo', total: '400.00' },
      { categoria: 'Servicios básicos', total: '180.50' },
      { categoria: 'Insumos', total: '95.25' },
    ])
  })

  it('Las categorías de gasto solo cuentan gastos del período', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '70.00',
      fecha: '2026-10-31',
      cuentaId,
      categoria: 'Arriendo',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '30.00',
      fecha: '2026-11-03',
      cuentaId,
      categoria: 'Insumos',
    })

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.topCategoriasGasto).toEqual([{ categoria: 'Insumos', total: '30.00' }])
  })

  it('Las categorías con el mismo total se ordenan por nombre', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    // Las categorías por defecto se crean con "Servicios básicos" antes que "Arriendo": el orden
    // por nombre es el contrario al de creación, así que el test no pasa por casualidad.
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '25.00',
      fecha: '2026-11-02',
      cuentaId,
      categoria: 'Servicios básicos',
    })
    await registrar(usuarioId, {
      tipo: 'GASTO',
      monto: '25.00',
      fecha: '2026-11-03',
      cuentaId,
      categoria: 'Arriendo',
    })

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.topCategoriasGasto.map((c) => c.categoria)).toEqual([
      'Arriendo',
      'Servicios básicos',
    ])
  })

  it('El dashboard muestra como máximo cinco categorías de gasto', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const cuentaId = await crearCuentaDePrueba(usuarioId, 'Banco')
    // Las categorías por defecto de gasto son cinco: se crea una sexta.
    const nueva = await crearCategoria(usuarioId, { nombre: 'Publicidad', tipo: 'GASTO' })
    if (!nueva.ok) throw new Error('Falló la creación de la categoría')
    const gastos = [
      { monto: '60.00', categoria: 'Arriendo' },
      { monto: '50.00', categoria: 'Insumos' },
      { monto: '40.00', categoria: 'Servicios básicos' },
      { monto: '30.00', categoria: 'Transporte' },
      { monto: '20.00', categoria: 'Otros' },
      { monto: '10.00', categoria: 'Publicidad' },
    ]
    for (const gasto of gastos) {
      await registrar(usuarioId, { tipo: 'GASTO', ...gasto, fecha: '2026-11-02', cuentaId })
    }

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.topCategoriasGasto.map((c) => c.total)).toEqual([
      '60.00',
      '50.00',
      '40.00',
      '30.00',
      '20.00',
    ])
  })

  it('Una cuenta sin movimientos muestra su saldo inicial', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const ahorro = await crearCuentaDePrueba(usuarioId, 'Ahorro negocio', '320.40')

    const resumen = await calcularResumen(usuarioId, 'mes', HOY)

    expect(resumen.saldosPorCuenta).toEqual([
      { cuentaId: ahorro, nombre: 'Ahorro negocio', saldo: '320.40' },
    ])
  })
})
