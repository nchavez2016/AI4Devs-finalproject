import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/server/auth/acciones', () => ({
  iniciarSesion: vi.fn(),
  registrar: vi.fn(),
}))

describe('formularios', () => {
  it('Los formularios desactivan la validación nativa del navegador', async () => {
    const { FormularioCuenta } = await import('@/app/(privado)/cuentas/FormularioCuenta')
    const { FormularioCategoria } = await import('@/app/(privado)/categorias/FormularioCategoria')
    const { FormularioRegistro } = await import('@/app/registro/FormularioRegistro')
    const { FormularioLogin } = await import('@/app/login/FormularioLogin')

    const formularios = [
      <FormularioCuenta
        key="cuenta"
        formularioRef={createRef<HTMLFormElement>()}
        estado={{}}
        accion={() => {}}
        pendiente={false}
      />,
      <FormularioCategoria key="categoria" estado={{}} accion={() => {}} pendiente={false} />,
      <FormularioRegistro key="registro" />,
      <FormularioLogin key="login" />,
    ]

    for (const formulario of formularios) {
      const { container, unmount } = render(formulario)
      const form = container.querySelector('form')
      expect(form).toBeTruthy()
      expect(form?.noValidate).toBe(true)
      unmount()
    }
  })
})
