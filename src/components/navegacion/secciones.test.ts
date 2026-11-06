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

  it('La cabecera marca Transacciones como activa con filtros en la URL', () => {
    // usePathname no incluye la query: /transacciones?tipo=GASTO llega como /transacciones.
    expect(seccionActiva('/transacciones')).toBe('/transacciones')
    expect(seccionActiva('/transacciones/nueva')).toBe('/transacciones')
  })

  it('Una subruta mantiene activa su sección', () => {
    expect(seccionActiva('/categorias/nueva')).toBe('/categorias')
    expect(seccionActiva('/cuentas/c1/editar')).toBe('/cuentas')
    expect(seccionActiva('/cuentasajenas')).toBeNull()
  })
})
