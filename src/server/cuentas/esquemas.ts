import { z } from 'zod'

export const esquemaCrearCuenta = z.object({
  nombre: z.string(),
  tipo: z.enum(['BANCO', 'EFECTIVO', 'DIGITAL']),
  saldoInicial: z.string().transform((valor) => (valor === '' ? '0.00' : valor)),
})

export type DatosCrearCuenta = z.infer<typeof esquemaCrearCuenta>
