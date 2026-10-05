import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { registrarUsuario } from '@/server/auth/registro'
import { listarCategorias } from './categorias'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

describe('categorias', () => {
  it('Usuario nuevo ve sus 7 categorías por defecto separadas por tipo', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await listarCategorias(registro.usuario.id)

    expect(resultado.gasto.map((c) => c.nombre)).toEqual([
      'Arriendo',
      'Insumos',
      'Otros',
      'Servicios básicos',
      'Transporte',
    ])
    expect(resultado.ingreso.map((c) => c.nombre)).toEqual([
      'Otros ingresos',
      'Ventas',
    ])
  })
})
