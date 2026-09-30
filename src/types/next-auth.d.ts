import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    nombre: string
    nombreNegocio: string
  }

  interface Session {
    user: {
      nombre: string
      nombreNegocio: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    nombre: string
    nombreNegocio: string
  }
}
