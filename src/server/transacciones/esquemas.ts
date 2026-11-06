import { z } from 'zod'
import { Prisma } from '@/generated/prisma/client'

// Hasta 12 enteros y 2 decimales, con punto (la coma ya se cambió por punto).
const FORMATO_MONTO = /^-?\d{1,12}(\.\d{1,2})?$/

// AAAA-MM-DD que existe en el calendario: ida y vuelta por Date.UTC (design b).
function esFechaReal(valor: string): boolean {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor)
  if (!partes) return false

  const [anio, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])]
  const fecha = new Date(Date.UTC(anio, mes - 1, dia))

  return (
    fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia
  )
}

export const esquemaRegistrarTransaccion = z.object({
  tipo: z.enum(['INGRESO', 'GASTO'], 'Elige si es un gasto o un ingreso'),
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
  fecha: z
    .string({ error: 'Indica la fecha' })
    .min(1, { error: 'Indica la fecha', abort: true })
    .refine(esFechaReal, 'Escribe una fecha válida'),
  cuentaId: z.string({ error: 'Elige una cuenta' }).min(1, 'Elige una cuenta'),
  categoriaId: z.string({ error: 'Elige una categoría' }).min(1, 'Elige una categoría'),
  descripcion: z
    .string()
    .optional()
    .transform((valor) => {
      const recortada = valor?.trim()
      return recortada ? recortada : null
    })
    .refine(
      (valor) => valor === null || valor.length <= 255,
      'La descripción puede tener como máximo 255 caracteres'
    ),
})

export type DatosRegistrarTransaccion = z.infer<typeof esquemaRegistrarTransaccion>
