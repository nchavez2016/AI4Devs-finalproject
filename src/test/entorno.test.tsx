import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

const innerWidthOriginal = window.innerWidth

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

  // Estos dos tests dependen del orden: el primero ensucia el entorno y el
  // segundo comprueba que el setup lo ha limpiado antes de ejecutarse.
  it('un test deja DOM, timers falsos, spies y globals modificados', () => {
    render(<p>residuo</p>)
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.stubGlobal('innerWidth', 123)

    expect(document.body.textContent).toContain('residuo')
    expect(vi.isFakeTimers()).toBe(true)
    expect(Math.random()).toBe(0.5)
    expect(window.innerWidth).toBe(123)
  })

  it('el test siguiente empieza con DOM vacío, timers reales, spies restaurados y globals originales', () => {
    expect(document.body.innerHTML).toBe('')
    expect(vi.isFakeTimers()).toBe(false)
    expect(vi.isMockFunction(Math.random)).toBe(false)
    expect(window.innerWidth).toBe(innerWidthOriginal)
  })
})
