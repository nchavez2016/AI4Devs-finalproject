import { z } from 'zod'

const esquemaEnv = z.object({
  DATABASE_URL: z.url({ message: 'DATABASE_URL debe ser una URL de PostgreSQL válida' }),
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET debe tener al menos 32 caracteres'),
})

export type Env = z.infer<typeof esquemaEnv>

export function cargarEnv(fuente: Record<string, string | undefined>): Env {
  const resultado = esquemaEnv.safeParse(fuente)

  if (!resultado.success) {
    const variables = [...new Set(resultado.error.issues.map((issue) => issue.path.join('.')))]
    throw new Error(
      `Configuración inválida. Revisa las variables de entorno: ${variables.join(', ')}`
    )
  }

  return resultado.data
}

export const env = cargarEnv(process.env)
