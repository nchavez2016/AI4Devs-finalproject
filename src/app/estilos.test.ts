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
    const css = readFileSync(resolve(__dirname, 'globals.css'), 'utf-8')

    // Se busca solo dentro de @layer base: otro @variant escritorio anterior (el de :root)
    // no puede dar un falso positivo.
    const capaBase = cuerpoDeBloque(css, /@layer\s+base\s*\{/)
    expect(capaBase).not.toBeNull()

    const variantEscritorio = capaBase!.match(/@variant\s+escritorio\s*\{/)
    expect(variantEscritorio).toBeTruthy()
    const cuerpoVariant = cuerpoDeBloque(capaBase!, /@variant\s+escritorio\s*\{/)
    expect(cuerpoVariant).toMatch(/html\s*\{[^}]*scroll-padding-bottom:\s*0\s*;/)

    // La regla de móvil es la que queda fuera de la variante.
    const fueraDeVariant = capaBase!.replace(
      `${variantEscritorio![0]}${cuerpoVariant}}`,
      ''
    )
    expect(fueraDeVariant).toMatch(
      /html\s*\{[^}]*scroll-padding-bottom:\s*var\(--spacing-reserva-barra-inferior\)/
    )
  })
})

// Devuelve el texto entre las llaves del primer bloque que empieza en `inicio`, o null.
function cuerpoDeBloque(texto: string, inicio: RegExp): string | null {
  const coincidencia = inicio.exec(texto)
  if (!coincidencia) return null

  const desde = coincidencia.index + coincidencia[0].length
  let profundidad = 1
  for (let i = desde; i < texto.length; i++) {
    if (texto[i] === '{') profundidad++
    else if (texto[i] === '}') {
      profundidad--
      if (profundidad === 0) return texto.slice(desde, i)
    }
  }
  return null
}
