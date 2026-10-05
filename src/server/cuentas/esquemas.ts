import { z } from 'zod'

export const esquemaCrearCuenta = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(150, 'El nombre puede tener como máximo 150 caracteres'),
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
