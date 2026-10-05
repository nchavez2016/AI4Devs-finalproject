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

  it('Crear categoría rechazada por nombre vacío', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCategoria(registro.usuario.id, {
      nombre: '   ',
      tipo: 'GASTO',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toEqual(['El nombre es obligatorio'])
    }
  })

  it('Crear categoría rechazada por nombre duplicado en el mismo tipo', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    await crearCategoria(registro.usuario.id, { nombre: 'Publicidad', tipo: 'GASTO' })
    const resultado = await crearCategoria(registro.usuario.id, {
      nombre: 'publicidad',
      tipo: 'GASTO',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toEqual([
        'Ya tienes una categoría de gasto con ese nombre',
      ])
    }
  })

  it('Categorías duplicadas rechazadas aunque se envíen a la vez', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const [primera, segunda] = await Promise.all([
      crearCategoria(registro.usuario.id, { nombre: 'Publicidad', tipo: 'GASTO' }),
      crearCategoria(registro.usuario.id, { nombre: 'Publicidad', tipo: 'GASTO' }),
    ])

    expect([primera.ok, segunda.ok].sort()).toEqual([false, true])

    const categorias = await listarCategorias(registro.usuario.id)
    const publicidad = categorias.gasto.filter((c) => c.nombre === 'Publicidad')
    expect(publicidad).toHaveLength(1)
  })

  it('Mismo nombre permitido en el otro tipo', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const gasto = await crearCategoria(registro.usuario.id, {
      nombre: 'Publicidad',
      tipo: 'GASTO',
    })
    const ingreso = await crearCategoria(registro.usuario.id, {
      nombre: 'Publicidad',
      tipo: 'INGRESO',
    })

    expect(gasto.ok).toBe(true)
    expect(ingreso.ok).toBe(true)
  })

  it('Crear categoría rechazada por tipo inválido', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCategoria(registro.usuario.id, {
      nombre: 'Publicidad',
      tipo: 'OTRO',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.tipo).toEqual([
        'Elige si es de ingreso o de gasto',
      ])
    }
  })

  it('Un usuario no ve las categorías de otro', async () => {
    const ana = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    const luis = await registrarUsuario({
      nombre: 'Luis',
      nombreNegocio: 'Tienda Luis',
      email: 'luis@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!ana.ok || !luis.ok) throw new Error('Falló el registro')

    await crearCategoria(ana.usuario.id, { nombre: 'Publicidad', tipo: 'GASTO' })

    const deLuis = await listarCategorias(luis.usuario.id)
    const nombres = [...deLuis.ingreso, ...deLuis.gasto].map((c) => c.nombre)
    expect(nombres).not.toContain('Publicidad')
    expect(deLuis.gasto).toHaveLength(5)
  })

  it('Longitud máxima del nombre de categoría es 150 caracteres', async () => {
    const registro = await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })
    if (!registro.ok) throw new Error('Falló el registro')

    const resultado = await crearCategoria(registro.usuario.id, {
      nombre: 'a'.repeat(151),
      tipo: 'GASTO',
    })

    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toEqual([
        'El nombre puede tener como máximo 150 caracteres',
      ])
    }
  })
})
