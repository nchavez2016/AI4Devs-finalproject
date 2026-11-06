import { z } from 'zod'

export const esquemaRegistrarTransaccion = z.object({
  tipo: z.enum(['INGRESO', 'GASTO']),
  monto: z.string(),
  fecha: z.string(),
  cuentaId: z.string(),
  categoriaId: z.string(),
  descripcion: z.string().optional(),
})

export type DatosRegistrarTransaccion = z.infer<typeof esquemaRegistrarTransaccion>
