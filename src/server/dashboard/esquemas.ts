import { z } from 'zod'

// Parámetros de la URL del dashboard: un período inválido o ausente se trata como "mes".
export const esquemaParametrosDashboard = z.object({
  periodo: z.enum(['dia', 'semana', 'mes']).catch('mes'),
})
