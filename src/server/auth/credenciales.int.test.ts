import { beforeEach, describe, expect, it } from 'vitest'
import { registrarUsuario } from './registro'
import { verificarCredenciales } from './credenciales'
import { limpiarBD } from '@/test/bd/limpiar'

beforeEach(async () => {
  await limpiarBD(process.env.DATABASE_URL!)
})

describe('verificarCredenciales', () => {
  it('Inicio de sesión con credenciales correctas', async () => {
    await registrarUsuario({
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
      email: 'ana@tienda.ec',
      password: 'clave-segura-1',
    })

    const resultado = await verificarCredenciales({
      email: 'Ana@Tienda.ec',
      password: 'clave-segura-1',
    })

    expect(resultado.ok).toBe(true)
    if (resultado.ok) {
      expect(resultado.usuario.nombre).toBe('Ana')
      expect(resultado.usuario.nombreNegocio).toBe('Tienda Ana')
      expect(resultado.usuario.id).toBeTruthy()
    }
  })
})
