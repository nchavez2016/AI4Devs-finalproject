'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Campo } from '@/components/ui/Campo'
import { Button } from '@/components/ui/Button'
import { iniciarSesion, type EstadoFormularioLogin } from '@/server/auth/acciones'

const ESTADO_INICIAL: EstadoFormularioLogin = {}

export function FormularioLogin() {
  const [estado, accion, pendiente] = useActionState(iniciarSesion, ESTADO_INICIAL)

  return (
    <form action={accion} noValidate className="flex flex-col gap-entre-campos">
      <Campo etiqueta="Email" name="email" type="email" autoComplete="email" />
      <Campo
        etiqueta="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      {estado.mensaje && (
        <p className="text-detalle text-destructive">{estado.mensaje}</p>
      )}
      <Button type="submit" cargando={pendiente} textoCarga="Entrando…">
        Entrar
      </Button>
      <Link href="/registro" className="text-cuerpo text-primary">
        Crear una cuenta
      </Link>
    </form>
  )
}
