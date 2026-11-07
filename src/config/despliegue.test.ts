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

  it('Ningún script automático invoca el seed', () => {
    const { scripts } = leerPackageJson()
    const conSeed = Object.entries(scripts)
      .filter(([, comando]) => /seed/i.test(comando))
      .map(([nombre]) => nombre)

    expect(scripts['db:seed']).toBeDefined()
    expect(conSeed).toEqual(['db:seed'])
    expect(readFileSync('prisma.config.ts', 'utf8')).not.toMatch(/seed/i)
  })

  it('El proyecto declara Node 24', () => {
    const { engines } = leerPackageJson()

    expect(engines?.node).toBe('24.x')
  })
})
