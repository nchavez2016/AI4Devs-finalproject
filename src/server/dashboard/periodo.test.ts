import { describe, expect, it } from 'vitest'
import { limitesPeriodo } from './periodo'

function dia(fecha: Date) {
  return fecha.toISOString().slice(0, 10)
}

describe('limitesPeriodo', () => {
  it('La semana de un domingo termina ese mismo domingo', () => {
    // 2026-11-08 es domingo: la semana va del lunes 2026-11-02 a ese domingo.
    const { desde, hasta } = limitesPeriodo('semana', '2026-11-08')

    expect(dia(desde)).toBe('2026-11-02')
    expect(dia(hasta)).toBe('2026-11-08')
  })
})
