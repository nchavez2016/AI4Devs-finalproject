import { z } from 'zod'

export const esquemaCrearCuenta = z.object({
  nombre: z.string(),
  tipo: z.enum(['BANCO', 'EFECTIVO', 'DIGITAL']),
  saldoInicial: z.string(),
})

export type DatosCrearCuenta = z.infer<typeof esquemaCrearCuenta>
