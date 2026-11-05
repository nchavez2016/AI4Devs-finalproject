import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/server/cuentas/acciones', () => ({
  crearCuentaAccion: vi.fn(),
}))

vi.mock('@/server/categorias/acciones', () => ({
  crearCategoriaAccion: vi.fn(),
}))

describe('navegación de las pantallas privadas', () => {
  it('Las pantallas privadas no enlazan de vuelta al panel', async () => {
    const { ContenidoCuentas } = await import('./cuentas/ContenidoCuentas')
    const { ContenidoCategorias } = await import('./categorias/ContenidoCategorias')

    const cuentas = render(<ContenidoCuentas cuentas={[]} />)
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
    cuentas.unmount()

    render(<ContenidoCategorias ingreso={[]} gasto={[]} />)
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
  })
})
