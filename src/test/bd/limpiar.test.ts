// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { limpiarBD } from './limpiar'

describe('limpiarBD', () => {
  it('limpiarBD aborta si la base no termina en _test', async () => {
    const url = 'postgresql://cuadre:cuadre@bd-inexistente.invalid:5432/cuadre'

    await expect(limpiarBD(url)).rejects.toThrow(/_test/)
  })
})
