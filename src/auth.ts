import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { env } from '@/config/env'
import { verificarCredenciales } from '@/server/auth/credenciales'

// Config separado del NextAuth(...) para poder probar los callbacks de forma aislada
// (src/auth.test.ts), sin levantar un servidor ni tocar la base de datos.
export const authConfig: NextAuthConfig = {
  secret: env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Contraseña' },
      },
      async authorize(credentials) {
        const resultado = await verificarCredenciales(credentials)

        if (!resultado.ok) {
          return null
        }

        return {
          id: resultado.usuario.id,
          nombre: resultado.usuario.nombre,
          nombreNegocio: resultado.usuario.nombreNegocio,
          email: resultado.usuario.email,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.nombre = user.nombre
        token.nombreNegocio = user.nombreNegocio
      }

      return token
    },
    session({ session, token }) {
      session.user.id = token.sub!
      session.user.nombre = token.nombre
      session.user.nombreNegocio = token.nombreNegocio

      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
