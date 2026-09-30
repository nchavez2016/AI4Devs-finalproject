import { z } from 'zod'

export const esquemaRegistro = z.object({
  nombre: z.string(),
  nombreNegocio: z.string(),
  email: z.string().trim().toLowerCase(),
  password: z.string(),
})

export type DatosRegistro = z.infer<typeof esquemaRegistro>
