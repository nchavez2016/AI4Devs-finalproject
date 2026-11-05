'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Campo } from '@/components/ui/Campo'
import { Button } from '@/components/ui/Button'
import { registrar, type EstadoFormularioRegistro } from '@/server/auth/acciones'

const ESTADO_INICIAL: EstadoFormularioRegistro = { errores: {} }

export function FormularioRegistro() {
  const [estado, accion, pendiente] = useActionState(registrar, ESTADO_INICIAL)

  return (
    <form action={accion} noValidate className="flex flex-col gap-entre-campos">
      <Campo
        etiqueta="Nombre"
        name="nombre"
        autoComplete="name"
        error={estado.errores.nombre?.[0]}
      />
      <Campo
        etiqueta="Nombre del negocio"
        name="nombreNegocio"
        error={estado.errores.nombreNegocio?.[0]}
      />
      <Campo
        etiqueta="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={estado.errores.email?.[0]}
      />
      <Campo
        etiqueta="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        error={estado.errores.password?.[0]}
      />
      <Button type="submit" cargando={pendiente} textoCarga="Creando cuenta…">
        Registrarme
      </Button>
      <Link href="/login" className="text-cuerpo text-primary">
        Ya tengo una cuenta
      </Link>
    </form>
  )
}
