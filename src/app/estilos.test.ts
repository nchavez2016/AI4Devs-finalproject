import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('estilos globales', () => {
  it('La animación de entrada no deja transform ni filter aplicados al terminar', () => {
    const ruta = resolve(__dirname, 'globals.css')
    const css = readFileSync(ruta, 'utf-8')

    const matchKeyframes = css.match(/@keyframes\s+entrada\s*\{([\s\S]*?)\n\s*\}/)
    expect(matchKeyframes).toBeTruthy()
    const cuerpoKeyframes = matchKeyframes![1]

    const usaTransformOFilter = /transform|filter/.test(cuerpoKeyframes)
    if (usaTransformOFilter) {
      const matchToken = css.match(/--animate-entrada:\s*([^;]+);/)
      expect(matchToken).toBeTruthy()
      const valorToken = matchToken![1].trim()

      expect(valorToken).not.toMatch(/\bforwards\b/)
      expect(valorToken).not.toMatch(/\bboth\b/)
    }
  })

  it('El botón fijo no tapa el campo enfocado', () => {
    const ruta = resolve(__dirname, 'globals.css')
    const css = readFileSync(ruta, 'utf-8')

    expect(css).toMatch(/html\s*\{[^}]*scroll-padding-bottom:\s*var\(--spacing-reserva-barra-inferior\)/)
    expect(css).toMatch(/@variant\s+escritorio\s*\{[\s\S]*?html\s*\{[^}]*scroll-padding-bottom:\s*0/)
  })
})
