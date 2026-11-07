import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function leerPackageJson(): {
  scripts: Record<string, string>
  engines?: Record<string, string>
} {
  return JSON.parse(readFileSync('package.json', 'utf8'))
}

describe('despliegue', () => {
  it('El build genera el cliente Prisma antes de compilar', () => {
    const { scripts } = leerPackageJson()

    expect(scripts.build).toBe('prisma generate && next build')
  })

  it('El proyecto declara Node 24', () => {
    const { engines } = leerPackageJson()

    expect(engines?.node).toBe('24.x')
  })
})
