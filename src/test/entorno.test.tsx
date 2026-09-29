import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

describe('entorno de tests', () => {
  it('jsdom expone document y window', () => {
    render(<p>hola</p>)

    expect(typeof window).toBe('object')
    expect(document.body.textContent).toContain('hola')
  })
})
