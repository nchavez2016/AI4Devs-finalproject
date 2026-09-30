import { describe, expect, it, vi } from 'vitest'

const redirectSimulado = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: redirectSimulado,
}))

describe('Page', () => {
  it('La raíz lleva al panel', async () => {
    const { default: Page } = await import('./page')

    Page()

    expect(redirectSimulado).toHaveBeenCalledWith('/panel')
  })
})
