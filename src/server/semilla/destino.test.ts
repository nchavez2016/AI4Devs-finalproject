// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { comprobarDestinoSemilla } from './destino'

const URL_NEON = 'postgresql://usuario:clave@ep-ejemplo.neon.tech/neondb?sslmode=require'

describe('destino de la semilla', () => {
  it('El seed se niega a correr sin confirmar la base', () => {
    expect(() => comprobarDestinoSemilla(URL_NEON, undefined)).toThrow(/neondb/)
  })

  it('El seed se niega a correr si la confirmación no coincide', () => {
    expect(() => comprobarDestinoSemilla(URL_NEON, 'cuadre')).toThrow(/neondb.*cuadre|cuadre.*neondb/)
  })

  it('El seed acepta la base confirmada', () => {
    expect(comprobarDestinoSemilla(URL_NEON, 'neondb')).toBe('neondb')
  })
})
