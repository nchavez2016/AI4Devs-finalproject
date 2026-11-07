import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const estadoEnlace = vi.hoisted(() => ({ pending: false }))

// useLinkStatus solo funciona dentro del router de Next: aquí se simula el estado pendiente.
vi.mock('next/link', async (importOriginal) => {
  const original = await importOriginal<typeof import('next/link')>()
  return { ...original, useLinkStatus: () => estadoEnlace }
})

describe('SelectorPeriodo', () => {
  it('El selector de período marca el período activo', async () => {
    const { SelectorPeriodo } = await import('./SelectorPeriodo')

    render(<SelectorPeriodo periodo="semana" />)

    const selector = screen.getByRole('navigation', { name: 'Período' })
    const enlaces = within(selector).getAllByRole('link')
    expect(enlaces.map((enlace) => enlace.textContent)).toEqual([
      'Hoy',
      'Esta semana',
      'Este mes',
    ])
    expect(enlaces.map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/panel?periodo=dia',
      '/panel?periodo=semana',
      '/panel?periodo=mes',
    ])
    expect(enlaces.map((enlace) => enlace.getAttribute('aria-current'))).toEqual([
      null,
      'page',
      null,
    ])
  })

  it('Cambiar de período muestra Actualizando junto al selector', async () => {
    const { SelectorPeriodo } = await import('./SelectorPeriodo')

    estadoEnlace.pending = false
    const { rerender } = render(<SelectorPeriodo periodo="mes" />)
    expect(screen.getByRole('status').textContent).toBe('')

    estadoEnlace.pending = true
    rerender(<SelectorPeriodo periodo="mes" />)

    expect(screen.getByRole('status').textContent).toBe('Actualizando…')
    // Los enlaces siguen en pantalla mientras se actualiza.
    expect(screen.getAllByRole('link')).toHaveLength(3)

    estadoEnlace.pending = false
  })
})
