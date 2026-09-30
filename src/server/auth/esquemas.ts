import { z } from 'zod'

export const esquemaRegistro = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  nombreNegocio: z.string().trim().min(1, 'El nombre del negocio es obligatorio'),
  email: z.string().trim().toLowerCase().email('El email no tiene un formato válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type DatosRegistro = z.infer<typeof esquemaRegistro>

export const esquemaCredenciales = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string(),
})
