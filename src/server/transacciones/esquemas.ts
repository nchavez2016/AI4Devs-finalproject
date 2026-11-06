import { z } from 'zod'
import { Prisma } from '@/generated/prisma/client'

export const esquemaRegistrarTransaccion = z.object({
  tipo: z.enum(['INGRESO', 'GASTO']),
  monto: z
    .string()
    .transform((valor) => valor.trim().replace(',', '.'))
    .refine((valor) => new Prisma.Decimal(valor).gt(0), 'El monto debe ser mayor que 0'),
  fecha: z.string(),
  cuentaId: z.string(),
  categoriaId: z.string(),
  descripcion: z
    .string()
    .optional()
    .transform((valor) => {
      const recortada = valor?.trim()
      return recortada ? recortada : null
    }),
})

export type DatosRegistrarTransaccion = z.infer<typeof esquemaRegistrarTransaccion>
