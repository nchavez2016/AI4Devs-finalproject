// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { correoUnico } from './correo-unico'

describe('correo-unico', () => {
  it('Cada ejecución E2E usa un correo distinto', () => {
    const primero = correoUnico()
    const segundo = correoUnico()

    expect(primero).not.toBe(segundo)
    expect(primero.endsWith('@e2e.cuadre.test')).toBe(true)
    expect(segundo.endsWith('@e2e.cuadre.test')).toBe(true)
  })
})
