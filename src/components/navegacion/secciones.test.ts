import { describe, expect, it } from 'vitest'
import { seccionActiva } from './secciones'

describe('seccionActiva', () => {
  it('La cabecera marca la sección activa', () => {
    expect(seccionActiva('/panel')).toBe('/panel')
    expect(seccionActiva('/cuentas')).toBe('/cuentas')
    expect(seccionActiva('/categorias')).toBe('/categorias')
    expect(seccionActiva('/login')).toBeNull()
    expect(seccionActiva(null)).toBeNull()
  })

  it('Una subruta mantiene activa su sección', () => {
    expect(seccionActiva('/categorias/nueva')).toBe('/categorias')
    expect(seccionActiva('/cuentas/c1/editar')).toBe('/cuentas')
    expect(seccionActiva('/cuentasajenas')).toBeNull()
  })
})
