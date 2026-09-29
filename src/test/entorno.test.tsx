import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

describe('entorno de tests', () => {
  it('jsdom expone document y window', () => {
    render(<p>hola</p>)

    expect(typeof window).toBe('object')
    expect(document.body.textContent).toContain('hola')
  })

  it('la zona horaria es America/Guayaquil', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/Guayaquil')
    expect(new Date('2026-01-15T12:00:00Z').getTimezoneOffset()).toBe(300)
  })
})
