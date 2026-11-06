import { z } from 'zod'

export const esquemaRegistrarTransaccion = z.object({
  tipo: z.enum(['INGRESO', 'GASTO']),
  monto: z
    .string()
    .transform((valor) => valor.trim().replace(',', '.')),
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
