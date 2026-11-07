// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// El YAML se lee como texto: basta para comprobar pasos y orden sin añadir un parser.
const ci = readFileSync('.github/workflows/ci.yml', 'utf8')

describe('workflow de CI', () => {
  it('El workflow de CI ejecuta los pasos obligatorios en orden', () => {
    const pasos = [
      'npm ci',
      'npx prisma generate',
      'npm run lint',
      'npm run typecheck',
      'npm run test:run',
      'npx playwright install --with-deps chromium',
      'npm run test:e2e',
    ]
    const posiciones = pasos.map((paso) => ci.indexOf(`run: ${paso}`))

    expect(posiciones.every((posicion) => posicion >= 0)).toBe(true)
    expect(posiciones).toEqual([...posiciones].sort((a, b) => a - b))
  })

  it('El workflow de CI usa Node 24 y PostgreSQL 16', () => {
    expect(ci).toMatch(/image:\s*postgres:16\b/)
    expect(ci).toMatch(/node-version:\s*['"]?24['"]?\s*$/m)
  })

  it('El workflow de CI publica el informe de Playwright siempre', () => {
    // Texto del paso completo: desde su "- name:" hasta el final del archivo (es el último paso).
    const paso = ci.slice(ci.lastIndexOf('- name:', ci.indexOf('actions/upload-artifact')))

    expect(ci).toContain('actions/upload-artifact')
    expect(paso).toMatch(/if:\s*\$\{\{\s*always\(\)\s*\}\}|if:\s*always\(\)/)
    expect(paso).toMatch(/path:\s*playwright-report/)
  })
})
