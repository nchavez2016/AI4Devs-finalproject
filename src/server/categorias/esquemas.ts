import { z } from 'zod'
import { esquemaNombre } from '@/server/validacion'

export const esquemaCrearCategoria = z.object({
  nombre: esquemaNombre,
  tipo: z.enum(['INGRESO', 'GASTO'], 'Elige si es de ingreso o de gasto'),
})

export type DatosCrearCategoria = z.infer<typeof esquemaCrearCategoria>
