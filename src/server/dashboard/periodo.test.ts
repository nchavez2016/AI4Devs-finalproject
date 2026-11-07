import { describe, expect, it } from 'vitest'
import { limitesPeriodo, textoRangoPeriodo } from './periodo'

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

describe('textoRangoPeriodo', () => {
  it('El rango del período día muestra la fecha de hoy', () => {
    expect(textoRangoPeriodo('dia', limitesPeriodo('dia', '2026-11-06'))).toBe('vie 6 nov')
  })

  it('El rango del período semana muestra de lunes a domingo', () => {
    expect(textoRangoPeriodo('semana', limitesPeriodo('semana', '2026-11-06'))).toBe('lun 2 – dom 8 nov')
  })

  it('El rango de una semana que cruza de mes nombra ambos meses', () => {
    expect(textoRangoPeriodo('semana', limitesPeriodo('semana', '2026-12-01'))).toBe('lun 30 nov – dom 6 dic')
  })

  it('El rango del período mes va del primer al último día', () => {
    expect(textoRangoPeriodo('mes', limitesPeriodo('mes', '2026-11-06'))).toBe('1 – 30 nov')
  })
})
