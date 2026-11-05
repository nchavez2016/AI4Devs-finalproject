import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const usePathnameSimulado = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: usePathnameSimulado,
}))

describe('NavegacionPrincipal', () => {
  beforeEach(() => {
    usePathnameSimulado.mockReset()
  })

  it('La navegación marca con aria-current solo la sección activa', async () => {
    usePathnameSimulado.mockReturnValue('/cuentas')
    const { NavegacionPrincipal } = await import('./NavegacionPrincipal')

    render(<NavegacionPrincipal />)

    expect(screen.getByRole('link', { name: 'Cuentas' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'Panel' }).getAttribute('aria-current')).toBeNull()
    expect(screen.getByRole('link', { name: 'Categorías' }).getAttribute('aria-current')).toBeNull()
  })
})
