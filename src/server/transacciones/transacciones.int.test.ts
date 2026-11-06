import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { registrarUsuario } from '@/server/auth/registro'
import { listarCategorias } from '@/server/categorias/categorias'
import { crearCuenta, listarCuentas } from '@/server/cuentas/cuentas'
import { listarTransacciones, registrarTransaccion } from './transacciones'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

async function usuarioConCajaEInsumos() {
  const registro = await registrarUsuario({
    nombre: 'Ana',
    nombreNegocio: 'Tienda Ana',
    email: 'ana@tienda.ec',
    password: 'clave-segura-1',
  })
  if (!registro.ok) throw new Error('Falló el registro')
  const usuarioId = registro.usuario.id

  const cuenta = await crearCuenta(usuarioId, {
    nombre: 'Caja',
    tipo: 'EFECTIVO',
    saldoInicial: '500.00',
  })
  if (!cuenta.ok) throw new Error('Falló la creación de la cuenta')

  const categorias = await listarCategorias(usuarioId)
  const insumos = categorias.gasto.find((c) => c.nombre === 'Insumos')
  if (!insumos) throw new Error('Falta la categoría Insumos')

  const ventas = categorias.ingreso.find((c) => c.nombre === 'Ventas')
  if (!ventas) throw new Error('Falta la categoría Ventas')

  return {
    usuarioId,
    cuentaId: cuenta.cuenta.id,
    categoriaId: insumos.id,
    categoriaIngresoId: ventas.id,
  }
}

async function registrarUsuarioDePrueba(nombre: string, email: string) {
  const registro = await registrarUsuario({
    nombre,
    nombreNegocio: `Negocio de ${nombre}`,
    email,
    password: 'clave-segura-1',
  })
  if (!registro.ok) throw new Error('Falló el registro')
  return registro.usuario.id
}

async function dosUsuarios() {
  const usuarioA = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
  const usuarioB = await registrarUsuarioDePrueba('Beto', 'beto@bazar.ec')
  const categoriasA = await listarCategorias(usuarioA)
  const categoriasB = await listarCategorias(usuarioB)
  const buscar = (lista: { id: string; nombre: string }[], nombre: string) => {
    const categoria = lista.find((c) => c.nombre === nombre)
    if (!categoria) throw new Error(`Falta la categoría ${nombre}`)
    return categoria.id
  }

  return {
    usuarioA,
    usuarioB,
    categoriaGastoA: buscar(categoriasA.gasto, 'Insumos'),
    categoriaGastoB: buscar(categoriasB.gasto, 'Insumos'),
  }
}

describe('transacciones', () => {
  it('Registrar un gasto válido', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()

    const resultado = await registrarTransaccion(usuarioId, {
      tipo: 'GASTO',
      monto: '25.50',
      fecha: '2026-09-28',
      cuentaId,
      categoriaId,
    })

    expect(resultado.ok).toBe(true)

    const transacciones = await listarTransacciones(usuarioId)
    expect(transacciones).toEqual([
      expect.objectContaining({
        tipo: 'GASTO',
        monto: '25.50',
        fecha: '2026-09-28',
        descripcion: null,
        cuenta: { id: cuentaId, nombre: 'Caja' },
        categoria: { id: categoriaId, nombre: 'Insumos' },
      }),
    ])

    const cuentas = await listarCuentas(usuarioId)
    expect(cuentas).toEqual([expect.objectContaining({ nombre: 'Caja', saldo: '474.50' })])
  })

  it('Registrar un ingreso válido con descripción', async () => {
    const { usuarioId, cuentaId, categoriaIngresoId } = await usuarioConCajaEInsumos()

    const resultado = await registrarTransaccion(usuarioId, {
      tipo: 'INGRESO',
      monto: '150,00',
      fecha: '2026-09-17',
      cuentaId,
      categoriaId: categoriaIngresoId,
      descripcion: '  Venta de producto  ',
    })

    expect(resultado.ok).toBe(true)

    const transacciones = await listarTransacciones(usuarioId)
    expect(transacciones).toEqual([
      expect.objectContaining({
        tipo: 'INGRESO',
        monto: '150.00',
        fecha: '2026-09-17',
        descripcion: 'Venta de producto',
        cuenta: { id: cuentaId, nombre: 'Caja' },
        categoria: { id: categoriaIngresoId, nombre: 'Ventas' },
      }),
    ])
  })

  it('Rechazar una transacción con monto inválido', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()

    for (const monto of ['0', '0.00', '-25.50']) {
      const resultado = await registrarTransaccion(usuarioId, {
        tipo: 'GASTO',
        monto,
        fecha: '2026-09-28',
        cuentaId,
        categoriaId,
      })

      expect(resultado).toEqual({
        ok: false,
        errores: { monto: ['El monto debe ser mayor que 0'] },
      })
    }

    expect(await listarTransacciones(usuarioId)).toEqual([])
  })

  it('Rechazar una transacción con monto de formato inválido', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()

    for (const monto of ['', 'abc', '10.555', '1.000,00', '1000000000000.00']) {
      const resultado = await registrarTransaccion(usuarioId, {
        tipo: 'GASTO',
        monto,
        fecha: '2026-09-28',
        cuentaId,
        categoriaId,
      })

      expect(resultado.ok).toBe(false)
      if (!resultado.ok) {
        expect(resultado.errores.monto).toEqual([
          'Escribe un monto con hasta 2 decimales, por ejemplo 25.50',
        ])
      }
    }

    expect(await listarTransacciones(usuarioId)).toEqual([])
  })

  it('Rechazar una transacción sin campos obligatorios', async () => {
    const { usuarioId } = await usuarioConCajaEInsumos()

    const esperado = {
      ok: false,
      errores: {
        cuentaId: ['Elige una cuenta'],
        categoriaId: ['Elige una categoría'],
        fecha: ['Indica la fecha'],
      },
    }

    const ausentes = await registrarTransaccion(usuarioId, { tipo: 'GASTO', monto: '25.50' })
    const vacios = await registrarTransaccion(usuarioId, {
      tipo: 'GASTO',
      monto: '25.50',
      cuentaId: '',
      categoriaId: '',
      fecha: '',
    })

    expect(ausentes).toEqual(esperado)
    expect(vacios).toEqual(esperado)
    expect(await listarTransacciones(usuarioId)).toEqual([])
  })

  it('Rechazar una transacción con fecha inexistente', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()

    for (const fecha of ['2026-02-30', '28/09/2026']) {
      const resultado = await registrarTransaccion(usuarioId, {
        tipo: 'GASTO',
        monto: '25.50',
        fecha,
        cuentaId,
        categoriaId,
      })

      expect(resultado.ok).toBe(false)
      if (!resultado.ok) {
        expect(resultado.errores.fecha).toEqual(['Escribe una fecha válida'])
      }
    }

    expect(await listarTransacciones(usuarioId)).toEqual([])
  })

  it('Rechazar una transacción con tipo inválido', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()

    const resultado = await registrarTransaccion(usuarioId, {
      tipo: 'AHORRO',
      monto: '25.50',
      fecha: '2026-09-28',
      cuentaId,
      categoriaId,
    })

    expect(resultado).toEqual({
      ok: false,
      errores: { tipo: ['Elige si es un gasto o un ingreso'] },
    })
    expect(await listarTransacciones(usuarioId)).toEqual([])
  })

  it('Longitud máxima de la descripción es 255 caracteres', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()
    const base = { tipo: 'GASTO', monto: '1.00', fecha: '2026-09-28', cuentaId, categoriaId }

    const primera = await registrarTransaccion(usuarioId, { ...base, descripcion: 'a'.repeat(255) })
    const segunda = await registrarTransaccion(usuarioId, { ...base, descripcion: 'b'.repeat(256) })

    expect(primera.ok).toBe(true)
    expect(segunda).toEqual({
      ok: false,
      errores: { descripcion: ['La descripción puede tener como máximo 255 caracteres'] },
    })

    const transacciones = await listarTransacciones(usuarioId)
    expect(transacciones).toHaveLength(1)
    expect(transacciones[0].descripcion).toBe('a'.repeat(255))
  })

  it('Listado de transacciones de la más reciente a la más antigua', async () => {
    const { usuarioId, cuentaId, categoriaId, categoriaIngresoId } = await usuarioConCajaEInsumos()

    await registrarTransaccion(usuarioId, {
      tipo: 'GASTO',
      monto: '10.00',
      fecha: '2026-09-27',
      cuentaId,
      categoriaId,
    })
    await registrarTransaccion(usuarioId, {
      tipo: 'GASTO',
      monto: '20.00',
      fecha: '2026-09-28',
      cuentaId,
      categoriaId,
    })
    await registrarTransaccion(usuarioId, {
      tipo: 'INGRESO',
      monto: '30.00',
      fecha: '2026-09-27',
      cuentaId,
      categoriaId: categoriaIngresoId,
    })

    const transacciones = await listarTransacciones(usuarioId)

    expect(transacciones.map((t) => [t.tipo, t.monto, t.fecha])).toEqual([
      ['GASTO', '20.00', '2026-09-28'],
      ['INGRESO', '30.00', '2026-09-27'],
      ['GASTO', '10.00', '2026-09-27'],
    ])
  })

  it('Filtrar transacciones por rango de fechas', async () => {
    const { usuarioId, cuentaId, categoriaId } = await usuarioConCajaEInsumos()

    for (const [monto, fecha] of [
      ['10.00', '2026-09-01'],
      ['20.00', '2026-09-15'],
      ['30.00', '2026-09-16'],
    ]) {
      await registrarTransaccion(usuarioId, { tipo: 'GASTO', monto, fecha, cuentaId, categoriaId })
    }

    const transacciones = await listarTransacciones(usuarioId, {
      desde: '2026-09-01',
      hasta: '2026-09-15',
    })

    expect(transacciones.map((t) => t.monto)).toEqual(['20.00', '10.00'])

    const desdeElDos = await listarTransacciones(usuarioId, { desde: '2026-09-02' })
    expect(desdeElDos.map((t) => t.monto)).toEqual(['30.00', '20.00'])
  })

  it('Filtrar transacciones por tipo y cuenta', async () => {
    const { usuarioId, cuentaId, categoriaId, categoriaIngresoId } = await usuarioConCajaEInsumos()
    const banco = await crearCuenta(usuarioId, {
      nombre: 'Banco',
      tipo: 'BANCO',
      saldoInicial: '0.00',
    })
    if (!banco.ok) throw new Error('Falló la creación de la cuenta')

    const base = { fecha: '2026-09-28' }
    await registrarTransaccion(usuarioId, {
      ...base,
      tipo: 'GASTO',
      monto: '25.50',
      cuentaId,
      categoriaId,
    })
    await registrarTransaccion(usuarioId, {
      ...base,
      tipo: 'INGRESO',
      monto: '100.00',
      cuentaId,
      categoriaId: categoriaIngresoId,
    })
    await registrarTransaccion(usuarioId, {
      ...base,
      tipo: 'GASTO',
      monto: '40.00',
      cuentaId: banco.cuenta.id,
      categoriaId,
    })

    const transacciones = await listarTransacciones(usuarioId, { tipo: 'GASTO', cuentaId })

    expect(transacciones.map((t) => t.monto)).toEqual(['25.50'])
  })

  it('Un filtro con valor inválido se ignora', async () => {
    const { usuarioId, cuentaId, categoriaId, categoriaIngresoId } = await usuarioConCajaEInsumos()

    await registrarTransaccion(usuarioId, {
      tipo: 'GASTO',
      monto: '25.50',
      fecha: '2026-09-28',
      cuentaId,
      categoriaId,
    })
    await registrarTransaccion(usuarioId, {
      tipo: 'INGRESO',
      monto: '100.00',
      fecha: '2026-09-28',
      cuentaId,
      categoriaId: categoriaIngresoId,
    })

    const transacciones = await listarTransacciones(usuarioId, {
      tipo: 'AHORRO',
      desde: '2026-02-30',
      hasta: '28/09/2026',
      cuentaId: '',
    })

    expect(transacciones.map((t) => t.monto)).toEqual(['100.00', '25.50'])
  })

  it('Rechazar una transacción en una cuenta de otro usuario', async () => {
    const { usuarioA, usuarioB, categoriaGastoA } = await dosUsuarios()
    const cajaBeto = await crearCuenta(usuarioB, {
      nombre: 'Caja Beto',
      tipo: 'EFECTIVO',
      saldoInicial: '50.00',
    })
    if (!cajaBeto.ok) throw new Error('Falló la creación de la cuenta')

    const base = { tipo: 'GASTO', monto: '25.50', fecha: '2026-09-28', categoriaId: categoriaGastoA }
    const ajena = await registrarTransaccion(usuarioA, { ...base, cuentaId: cajaBeto.cuenta.id })
    const inexistente = await registrarTransaccion(usuarioA, { ...base, cuentaId: 'no-existe' })

    const esperado = { ok: false, errores: { cuentaId: ['Elige una de tus cuentas'] } }
    expect(ajena).toEqual(esperado)
    expect(inexistente).toEqual(esperado)
    expect(await listarTransacciones(usuarioA)).toEqual([])
    expect(await listarTransacciones(usuarioB)).toEqual([])
    expect((await listarCuentas(usuarioB))[0].saldo).toBe('50.00')
  })
})
