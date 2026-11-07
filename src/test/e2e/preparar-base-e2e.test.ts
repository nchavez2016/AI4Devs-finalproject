// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { comprobarBaseE2E, prepararBaseE2E } from './preparar-base-e2e'

describe('preparar-base-e2e', () => {
  it('La suite E2E acepta una base que termina en _test', () => {
    const url = 'postgresql://cuadre:cuadre@localhost:5432/cuadre_e2e_test?schema=public'

    expect(comprobarBaseE2E(url)).toBe('cuadre_e2e_test')
  })

  it('La suite E2E se niega a correr si la base no termina en _test', async () => {
    // Host inexistente: si la guarda no se aplicara antes de conectar, el error sería de
    // conexión y no mencionaría el sufijo; además nada se crearía ni migraría.
    const url = 'postgresql://cuadre:cuadre@bd-inexistente.invalid:5432/cuadre'

    const error = await prepararBaseE2E(url).catch((e: unknown) => e as Error)

    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toContain('cuadre')
    expect((error as Error).message).toContain('_test')
    expect((error as Error).message).not.toMatch(/ENOTFOUND|conexi|preparar la base/i)
  })
})
