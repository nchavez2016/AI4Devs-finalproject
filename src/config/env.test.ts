import { describe, expect, it } from 'vitest'
import { cargarEnv } from './env'

describe('env', () => {
  it('Configuración incompleta impide arrancar', () => {
    const fuente = {
      DATABASE_URL: 'postgresql://cuadre:cuadre@localhost:5432/cuadre?schema=public',
    }

    expect(() => cargarEnv(fuente)).toThrow(/AUTH_SECRET/)
  })

  it('Configuración completa se acepta', () => {
    const fuente = {
      DATABASE_URL: 'postgresql://cuadre:cuadre@localhost:5432/cuadre?schema=public',
      AUTH_SECRET: 'a'.repeat(32),
    }

    const resultado = cargarEnv(fuente)

    expect(resultado.DATABASE_URL).toBe(fuente.DATABASE_URL)
    expect(resultado.AUTH_SECRET).toBe(fuente.AUTH_SECRET)
  })
})
