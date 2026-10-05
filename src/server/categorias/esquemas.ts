import { z } from 'zod'

export const esquemaCrearCategoria = z.object({
  nombre: z.string().trim(),
  tipo: z.enum(['INGRESO', 'GASTO']),
})

export type DatosCrearCategoria = z.infer<typeof esquemaCrearCategoria>
