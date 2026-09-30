import { describe, expect, it } from 'vitest'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'
import { authConfig } from './auth'

describe('authConfig', () => {
  it('la sesión expone id, nombre y nombre del negocio del token', async () => {
    const token = {
      sub: 'usr_1',
      nombre: 'Ana',
      nombreNegocio: 'Tienda Ana',
    } as JWT
    const session = { user: {}, expires: new Date().toISOString() } as Session

    const callbackSession = authConfig.callbacks!.session as (parametros: {
      session: Session
      token: JWT
    }) => Session | Promise<Session>

    const resultado = await callbackSession({ session, token })

    expect(resultado.user?.id).toBe('usr_1')
    expect(resultado.user?.nombre).toBe('Ana')
    expect(resultado.user?.nombreNegocio).toBe('Tienda Ana')
  })
})
