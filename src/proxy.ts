import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { resolverRedireccion } from '@/server/auth/rutas'

// Corre en Node.js (guía de Next.js), en cada ruta salvo las excluidas por `matcher`.
// Comprobación optimista: solo lee la sesión de la cookie (req.auth), sin consultar la
// base de datos (design.md, decisión c).
export default auth((req) => {
  const redireccion = resolverRedireccion(req.nextUrl.pathname, !!req.auth)

  if (redireccion) {
    return NextResponse.redirect(new URL(redireccion, req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
