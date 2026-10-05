import { beforeEach, describe, expect, it } from 'vitest'
import { limpiarBD } from '@/test/bd/limpiar'
import { registrarUsuario } from '@/server/auth/registro'
import { crearCategoria, listarCategorias } from './categorias'

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

  it('Crear una categoría de gasto', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCategoria(registro.usuario.id, {
      nombre: '  Publicidad  ',
      tipo: 'GASTO',
    })

    expect(resultado.ok).toBe(true)
    if (resultado.ok) {
      expect(resultado.categoria.nombre).toBe('Publicidad')
      expect(resultado.categoria.tipo).toBe('GASTO')
      expect(resultado.categoria.categoriaPadreId).toBeNull()
    }

    const categorias = await listarCategorias(registro.usuario.id)
    const nombresGasto = categorias.gasto.map((c) => c.nombre)
    expect(nombresGasto).toContain('Publicidad')
  })

  it('Crear una categoría de ingreso', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCategoria(registro.usuario.id, {
      nombre: 'Servicios técnicos',
      tipo: 'INGRESO',
    })

    expect(resultado.ok).toBe(true)
    if (resultado.ok) {
      expect(resultado.categoria.nombre).toBe('Servicios técnicos')
      expect(resultado.categoria.tipo).toBe('INGRESO')
      expect(resultado.categoria.categoriaPadreId).toBeNull()
    }

    const categorias = await listarCategorias(registro.usuario.id)
    const nombresIngreso = categorias.ingreso.map((c) => c.nombre)
    expect(nombresIngreso).toContain('Servicios técnicos')
  })
})
