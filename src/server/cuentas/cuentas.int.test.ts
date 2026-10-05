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
})
