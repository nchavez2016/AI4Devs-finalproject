// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { reintentosE2E } from './reintentos'

describe('reintentos', () => {
  it('La suite E2E reintenta 2 veces en CI', () => {
    expect(reintentosE2E({ CI: 'true' })).toBe(2)
  })

  it('La suite E2E no reintenta fuera de CI', () => {
    expect(reintentosE2E({})).toBe(0)
  })
})
