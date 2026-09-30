// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { exigirBaseDePrueba } from './guardia'

describe('exigirBaseDePrueba', () => {
  it('rechaza una URL cuya base no termina en _test', () => {
    const url = 'postgresql://cuadre:cuadre@bd-inexistente.invalid:5432/cuadre'

    expect(() => exigirBaseDePrueba(url)).toThrow(/_test/)
  })

  it('acepta una URL cuya base termina en _test y devuelve su nombre', () => {
    const url = 'postgresql://cuadre:cuadre@localhost:5432/cuadre_test?schema=public'

    expect(exigirBaseDePrueba(url)).toBe('cuadre_test')
  })
})
