import { describe, expect, it } from 'vitest'
import { resolverRedireccion } from './rutas'

describe('resolverRedireccion', () => {
  it('Ruta privada sin sesión redirige al login', () => {
    const redireccion = resolverRedireccion('/panel', false)

    expect(redireccion).toBe('/login')
  })

  it('Rutas públicas accesibles sin sesión', () => {
    expect(resolverRedireccion('/login', false)).toBeNull()
    expect(resolverRedireccion('/registro', false)).toBeNull()
  })
})
