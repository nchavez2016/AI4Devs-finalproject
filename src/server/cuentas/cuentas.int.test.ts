import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { registrarUsuario } from '@/server/auth/registro'
import { crearCuenta, listarCuentas } from './cuentas'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

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
})
