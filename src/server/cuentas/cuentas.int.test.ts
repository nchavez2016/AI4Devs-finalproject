import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { registrarUsuario } from '@/server/auth/registro'
import { listarCategorias } from '@/server/categorias/categorias'
import { cuentaRepository } from '@/server/repositories/cuentaRepository'
import { registrarTransaccion } from '@/server/transacciones/transacciones'
import { crearCuenta, listarCuentas, obtenerCuenta } from './cuentas'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

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

async function categoriasDeEjemplo(usuarioId: string) {
  const categorias = await listarCategorias(usuarioId)
  const gasto = categorias.gasto.find((c) => c.nombre === 'Insumos')
  const ingreso = categorias.ingreso.find((c) => c.nombre === 'Ventas')
  if (!gasto || !ingreso) throw new Error('Faltan las categorías por defecto')
  return { gastoId: gasto.id, ingresoId: ingreso.id }
}

async function registrarMovimiento(
  usuarioId: string,
  cuentaId: string,
  categoriaId: string,
  tipo: 'INGRESO' | 'GASTO',
  monto: string
) {
  const resultado = await registrarTransaccion(usuarioId, {
    tipo,
    monto,
    fecha: '2026-09-28',
    cuentaId,
    categoriaId,
  })
  if (!resultado.ok) throw new Error('Falló el registro de la transacción')
}

describe('cuentas', () => {
  it('Crear una cuenta con saldo inicial 500.00', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })

    expect(resultado.ok).toBe(true)

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toEqual([
      expect.objectContaining({
        nombre: 'Banco Pichincha',
        tipo: 'BANCO',
        saldo: '500.00',
      }),
    ])
  })

  it('Crear una cuenta sin saldo inicial la deja en 0.00', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: 'Efectivo',
      tipo: 'EFECTIVO',
      saldoInicial: '',
    })

    expect(resultado.ok).toBe(true)

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toEqual([
      expect.objectContaining({
        nombre: 'Efectivo',
        tipo: 'EFECTIVO',
        saldo: '0.00',
      }),
    ])
  })

  it('Crear una cuenta con saldo inicial negativo', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: 'Banco Guayaquil',
      tipo: 'BANCO',
      saldoInicial: '-120.00',
    })

    expect(resultado.ok).toBe(true)

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toEqual([
      expect.objectContaining({
        nombre: 'Banco Guayaquil',
        tipo: 'BANCO',
        saldo: '-120.00',
      }),
    ])
  })

  it('Saldo inicial con coma decimal se acepta', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: 'Billetera',
      tipo: 'DIGITAL',
      saldoInicial: ' 1250,75 ',
    })

    expect(resultado.ok).toBe(true)

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toEqual([
      expect.objectContaining({
        nombre: 'Billetera',
        tipo: 'DIGITAL',
        saldo: '1250.75',
      }),
    ])
  })

  it('Crear cuenta rechazada por nombre vacío', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: '   ',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toBeDefined()
      expect(resultado.errores.nombre?.length).toBeGreaterThan(0)
    }

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toHaveLength(0)
  })

  it('Longitud máxima del nombre de cuenta es 150 caracteres', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const nombre150 = `  ${'a'.repeat(150)}  `
    const resultado1 = await crearCuenta(registro.usuario.id, {
      nombre: nombre150,
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })

    expect(resultado1.ok).toBe(true)

    const nombre151 = 'b'.repeat(151)
    const resultado2 = await crearCuenta(registro.usuario.id, {
      nombre: nombre151,
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })

    expect(resultado2.ok).toBe(false)
    if (!resultado2.ok) {
      expect(resultado2.errores.nombre).toEqual([
        'El nombre puede tener como máximo 150 caracteres',
      ])
    }

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toHaveLength(1)
    expect(cuentas[0].nombre).toBe('a'.repeat(150))
  })

  it('Crear cuenta rechazada por saldo inicial inválido', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const saldosInvalidos = ['abc', '10.555', '1.000,00', '1000000000000.00']

    for (const saldoInicial of saldosInvalidos) {
      const resultado = await crearCuenta(registro.usuario.id, {
        nombre: 'Banco Pichincha',
        tipo: 'BANCO',
        saldoInicial,
      })

      expect(resultado.ok).toBe(false)
      if (!resultado.ok) {
        expect(resultado.errores.saldoInicial).toEqual([
          'Escribe un saldo con hasta 2 decimales, por ejemplo 500.00',
        ])
      }
    }

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toHaveLength(0)
  })

  it('Crear cuenta rechazada por tipo inválido', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: 'Visa',
      tipo: 'TARJETA',
      saldoInicial: '0.00',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.tipo).toEqual(['Elige un tipo de cuenta'])
    }

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toHaveLength(0)
  })

  it('Crear cuenta rechazada por nombre duplicado', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    await crearCuenta(registro.usuario.id, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: ' banco PICHINCHA ',
      tipo: 'DIGITAL',
      saldoInicial: '100.00',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toEqual(['Ya tienes una cuenta con ese nombre'])
    }

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toHaveLength(1)
  })

  it('Cuentas duplicadas rechazadas aunque se envíen a la vez', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const [resultado1, resultado2] = await Promise.all([
      crearCuenta(registro.usuario.id, {
        nombre: 'Caja chica',
        tipo: 'EFECTIVO',
        saldoInicial: '10.00',
      }),
      crearCuenta(registro.usuario.id, {
        nombre: 'caja chica',
        tipo: 'EFECTIVO',
        saldoInicial: '20.00',
      }),
    ])

    const exitos = [resultado1, resultado2].filter((r) => r.ok)
    const fallos = [resultado1, resultado2].filter((r) => !r.ok)

    expect(exitos).toHaveLength(1)
    expect(fallos).toHaveLength(1)
    if (!fallos[0].ok) {
      expect(fallos[0].errores.nombre).toEqual(['Ya tienes una cuenta con ese nombre'])
    }

    const cuentas = await listarCuentas(registro.usuario.id)
    expect(cuentas).toHaveLength(1)
  })

  it('Consultar una cuenta propia por su identificador', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCuenta(registro.usuario.id, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })
    if (!resultado.ok) throw new Error('Falló la creación de cuenta')

    const cuenta = await obtenerCuenta(registro.usuario.id, resultado.cuenta.id)

    expect(cuenta).not.toBeNull()
    expect(cuenta).toEqual({
      id: resultado.cuenta.id,
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldo: '500.00',
      creadoEn: expect.any(Date),
    })
  })

  it('Un usuario no ve las cuentas de otro en su lista', async () => {
    const registroA = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    const registroB = await registrarUsuario({
      nombre: 'Beto',
      nombreNegocio: 'Bazar Beto',
      email: 'beto@bazar.ec',
      password: 'clave-segura-2',
    })
    if (!registroA.ok || !registroB.ok) throw new Error('Falló el registro')

    await crearCuenta(registroA.usuario.id, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })
    await crearCuenta(registroB.usuario.id, {
      nombre: 'Caja Beto',
      tipo: 'EFECTIVO',
      saldoInicial: '100.00',
    })

    const cuentasA = await listarCuentas(registroA.usuario.id)

    expect(cuentasA).toHaveLength(1)
    expect(cuentasA[0].nombre).toBe('Banco Pichincha')
  })

  it('Una cuenta de otro usuario se trata como inexistente', async () => {
    const registroA = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    const registroB = await registrarUsuario({
      nombre: 'Beto',
      nombreNegocio: 'Bazar Beto',
      email: 'beto@bazar.ec',
      password: 'clave-segura-2',
    })
    if (!registroA.ok || !registroB.ok) throw new Error('Falló el registro')

    const resultadoCuentaB = await crearCuenta(registroB.usuario.id, {
      nombre: 'Caja Beto',
      tipo: 'EFECTIVO',
      saldoInicial: '100.00',
    })
    if (!resultadoCuentaB.ok) throw new Error('Falló la creación de cuenta')

    const cuentaAjena = await obtenerCuenta(registroA.usuario.id, resultadoCuentaB.cuenta.id)
    const cuentaInexistente = await obtenerCuenta(registroA.usuario.id, 'cmu0000000000000000000000')

    expect(cuentaAjena).toBeNull()
    expect(cuentaInexistente).toBeNull()
  })

  it('El nombre de una cuenta de otro usuario no cuenta como duplicado', async () => {
    const registroA = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    const registroB = await registrarUsuario({
      nombre: 'Beto',
      nombreNegocio: 'Bazar Beto',
      email: 'beto@bazar.ec',
      password: 'clave-segura-2',
    })
    if (!registroA.ok || !registroB.ok) throw new Error('Falló el registro')

    const resultadoA = await crearCuenta(registroA.usuario.id, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })
    expect(resultadoA.ok).toBe(true)

    const resultadoB = await crearCuenta(registroB.usuario.id, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '200.00',
    })
    expect(resultadoB.ok).toBe(true)

    const cuentasA = await listarCuentas(registroA.usuario.id)
    const cuentasB = await listarCuentas(registroB.usuario.id)

    expect(cuentasA).toHaveLength(1)
    expect(cuentasB).toHaveLength(1)
  })

  it('Caracterización: el saldo de una cuenta sin transacciones es su saldo inicial', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')
    const usuarioId = registro.usuario.id

    const cero = await crearCuenta(usuarioId, { nombre: 'Caja', tipo: 'EFECTIVO', saldoInicial: '0.00' })
    const negativa = await crearCuenta(usuarioId, {
      nombre: 'Banco',
      tipo: 'BANCO',
      saldoInicial: '-120.00',
    })
    if (!cero.ok || !negativa.ok) throw new Error('Falló la creación de cuentas')

    const lista = await listarCuentas(usuarioId)
    expect(lista.map((c) => [c.nombre, c.saldo])).toEqual([
      ['Caja', '0.00'],
      ['Banco', '-120.00'],
    ])

    const consultadaCero = await obtenerCuenta(usuarioId, cero.cuenta.id)
    const consultadaNegativa = await obtenerCuenta(usuarioId, negativa.cuenta.id)
    expect(consultadaCero?.saldo).toBe('0.00')
    expect(consultadaNegativa?.saldo).toBe('-120.00')
  })

  it('Saldo de cuenta suma ingresos y resta gastos', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const { gastoId, ingresoId } = await categoriasDeEjemplo(usuarioId)
    const cuenta = await crearCuenta(usuarioId, {
      nombre: 'Caja',
      tipo: 'EFECTIVO',
      saldoInicial: '0.00',
    })
    if (!cuenta.ok) throw new Error('Falló la creación de la cuenta')

    await registrarMovimiento(usuarioId, cuenta.cuenta.id, ingresoId, 'INGRESO', '100.00')
    await registrarMovimiento(usuarioId, cuenta.cuenta.id, gastoId, 'GASTO', '25.50')

    const lista = await listarCuentas(usuarioId)
    expect(lista).toEqual([expect.objectContaining({ nombre: 'Caja', saldo: '74.50' })])

    const consultada = await obtenerCuenta(usuarioId, cuenta.cuenta.id)
    expect(consultada?.saldo).toBe('74.50')
  })

  it('Ver el saldo actualizado de una cuenta', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const { gastoId, ingresoId } = await categoriasDeEjemplo(usuarioId)
    const cuenta = await crearCuenta(usuarioId, {
      nombre: 'Banco Pichincha',
      tipo: 'BANCO',
      saldoInicial: '500.00',
    })
    if (!cuenta.ok) throw new Error('Falló la creación de la cuenta')

    await registrarMovimiento(usuarioId, cuenta.cuenta.id, ingresoId, 'INGRESO', '200.00')
    await registrarMovimiento(usuarioId, cuenta.cuenta.id, gastoId, 'GASTO', '50.00')

    const consultada = await obtenerCuenta(usuarioId, cuenta.cuenta.id)
    expect(consultada?.saldo).toBe('650.00')
  })

  it('El saldo de una cuenta solo cuenta sus transacciones', async () => {
    const usuarioId = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const { gastoId } = await categoriasDeEjemplo(usuarioId)
    const caja = await crearCuenta(usuarioId, {
      nombre: 'Caja',
      tipo: 'EFECTIVO',
      saldoInicial: '10.00',
    })
    const banco = await crearCuenta(usuarioId, {
      nombre: 'Banco',
      tipo: 'BANCO',
      saldoInicial: '0.00',
    })
    if (!caja.ok || !banco.ok) throw new Error('Falló la creación de cuentas')

    await registrarMovimiento(usuarioId, banco.cuenta.id, gastoId, 'GASTO', '3.75')

    const lista = await listarCuentas(usuarioId)
    expect(lista.map((c) => [c.nombre, c.saldo])).toEqual([
      ['Caja', '10.00'],
      ['Banco', '-3.75'],
    ])
  })

  it('El saldo de una cuenta no cuenta transacciones de otro usuario', async () => {
    const usuarioA = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const usuarioB = await registrarUsuarioDePrueba('Beto', 'beto@bazar.ec')
    const { ingresoId } = await categoriasDeEjemplo(usuarioB)
    const cajaA = await crearCuenta(usuarioA, {
      nombre: 'Caja',
      tipo: 'EFECTIVO',
      saldoInicial: '10.00',
    })
    const cajaB = await crearCuenta(usuarioB, {
      nombre: 'Caja',
      tipo: 'EFECTIVO',
      saldoInicial: '0.00',
    })
    if (!cajaA.ok || !cajaB.ok) throw new Error('Falló la creación de cuentas')

    await registrarMovimiento(usuarioB, cajaB.cuenta.id, ingresoId, 'INGRESO', '5.25')

    const cuentasA = await listarCuentas(usuarioA)
    const cuentasB = await listarCuentas(usuarioB)
    expect(cuentasA.map((c) => [c.nombre, c.saldo])).toEqual([['Caja', '10.00']])
    expect(cuentasB.map((c) => [c.nombre, c.saldo])).toEqual([['Caja', '5.25']])
    expect((await obtenerCuenta(usuarioA, cajaA.cuenta.id))?.saldo).toBe('10.00')
  })

  it('Las sumas por cuenta del repositorio no incluyen filas de otro usuario', async () => {
    const usuarioA = await registrarUsuarioDePrueba('Ana', 'ana@tienda.ec')
    const usuarioB = await registrarUsuarioDePrueba('Beto', 'beto@bazar.ec')
    const { ingresoId } = await categoriasDeEjemplo(usuarioB)
    const cajaB = await crearCuenta(usuarioB, {
      nombre: 'Caja',
      tipo: 'EFECTIVO',
      saldoInicial: '0.00',
    })
    if (!cajaB.ok) throw new Error('Falló la creación de la cuenta')

    await registrarMovimiento(usuarioB, cajaB.cuenta.id, ingresoId, 'INGRESO', '5.25')

    expect(await cuentaRepository.sumasPorCuenta(usuarioA)).toEqual([])
    expect(await cuentaRepository.sumasPorCuenta(usuarioB)).toHaveLength(1)
  })
})
