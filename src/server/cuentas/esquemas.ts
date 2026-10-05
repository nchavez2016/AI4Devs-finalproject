import { z } from 'zod'

export const esquemaCrearCuenta = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  tipo: z.enum(['BANCO', 'EFECTIVO', 'DIGITAL']),
  saldoInicial: z.string().transform((valor) => {
    const limpio = valor.trim().replace(',', '.')
    return limpio === '' ? '0.00' : limpio
  }),
})

export type DatosCrearCuenta = z.infer<typeof esquemaCrearCuenta>
