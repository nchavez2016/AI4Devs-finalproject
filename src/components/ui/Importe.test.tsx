import { describe, expect, it } from 'vitest'
import { formatearImporte } from './Importe'

describe('Importe', () => {
  it('formatea un ingreso como +$25,50', () => {
    expect(formatearImporte('25.50', 'ingreso')).toBe('+$25,50')
  })
})
