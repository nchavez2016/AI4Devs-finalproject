import { z } from 'zod'
import { Prisma } from '@/generated/prisma/client'

// Hasta 12 enteros y 2 decimales, con punto (la coma ya se cambió por punto).
const FORMATO_MONTO = /^-?\d{1,12}(\.\d{1,2})?$/

export const esquemaRegistrarTransaccion = z.object({
  tipo: z.enum(['INGRESO', 'GASTO']),
  monto: z
    .string()
    .transform((valor) => valor.trim().replace(',', '.'))
    .superRefine((valor, ctx) => {
      if (!FORMATO_MONTO.test(valor)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Escribe un monto con hasta 2 decimales, por ejemplo 25.50',
        })
        return
      }

      if (!new Prisma.Decimal(valor).gt(0)) {
        ctx.addIssue({ code: 'custom', message: 'El monto debe ser mayor que 0' })
      }
    }),
  fecha: z.string({ error: 'Indica la fecha' }).min(1, 'Indica la fecha'),
  cuentaId: z.string({ error: 'Elige una cuenta' }).min(1, 'Elige una cuenta'),
  categoriaId: z.string({ error: 'Elige una categoría' }).min(1, 'Elige una categoría'),
  descripcion: z
    .string()
    .optional()
    .transform((valor) => {
      const recortada = valor?.trim()
      return recortada ? recortada : null
    }),
})

export type DatosRegistrarTransaccion = z.infer<typeof esquemaRegistrarTransaccion>
