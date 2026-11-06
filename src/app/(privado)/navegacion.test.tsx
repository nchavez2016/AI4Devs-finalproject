import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/server/cuentas/acciones', () => ({
  crearCuentaAccion: vi.fn(),
}))

vi.mock('@/server/categorias/acciones', () => ({
  crearCategoriaAccion: vi.fn(),
}))

vi.mock('@/server/transacciones/acciones', () => ({
  registrarTransaccionAccion: vi.fn(),
}))

describe('navegación de las pantallas privadas', () => {
  it('Las pantallas privadas no enlazan de vuelta al panel', async () => {
    const { ContenidoCuentas } = await import('./cuentas/ContenidoCuentas')
    const { ContenidoCategorias } = await import('./categorias/ContenidoCategorias')
    const { ContenidoTransacciones } = await import('./transacciones/ContenidoTransacciones')

    const cuentas = render(<ContenidoCuentas cuentas={[]} />)
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
    cuentas.unmount()

    const categorias = render(<ContenidoCategorias ingreso={[]} gasto={[]} />)
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
    categorias.unmount()

    render(
      <ContenidoTransacciones
        transacciones={[]}
        cuentas={[]}
        categorias={{ ingreso: [], gasto: [] }}
        filtros={{}}
        hoy="2026-09-28"
      />
    )
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).toBeNull()
  })
})
