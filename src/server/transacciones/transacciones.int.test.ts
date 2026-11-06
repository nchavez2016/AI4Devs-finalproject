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
})
