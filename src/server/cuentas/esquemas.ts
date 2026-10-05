import { z } from 'zod'
import { esquemaNombre } from '@/server/validacion'

export const esquemaCrearCuenta = z.object({
  nombre: esquemaNombre,
  tipo: z.enum(['BANCO', 'EFECTIVO', 'DIGITAL'], 'Elige un tipo de cuenta'),
  saldoInicial: z
    .string()
    .transform((valor) => valor.trim())
    .superRefine((valor, ctx) => {
      if (valor === '') return
      if (!/^-?\d{1,12}([.,]\d{1,2})?$/.test(valor)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Escribe un saldo con hasta 2 decimales, por ejemplo 500.00',
        })
      }
    })
    .transform((valor) => (valor === '' ? '0.00' : valor.replace(',', '.'))),
})

export type DatosCrearCuenta = z.infer<typeof esquemaCrearCuenta>
