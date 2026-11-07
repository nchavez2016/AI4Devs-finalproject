// Siembra al usuario revisor (revisor@cuadre.test) con cuentas y movimientos de ejemplo.
// Uso: npm run db:seed. Exige SEED_CONFIRMAR_BASE igual al nombre de la base de DATABASE_URL.
// Solo se ejecuta a mano: ni el build, ni los tests, ni las migraciones lo invocan.

import { comprobarDestinoSemilla } from '../src/server/semilla/destino'
import { hoyEnEcuador } from '../src/server/fechas'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Falta DATABASE_URL: no se sabe a qué base sembrar.')
  }

  // La guarda va antes de importar el repositorio: así nada se conecta si el destino no es el previsto.
  const base = comprobarDestinoSemilla(url, process.env.SEED_CONFIRMAR_BASE)

  const { sembrar } = await import('../src/server/semilla/sembrar')
  const { prisma } = await import('../src/server/repositories/prisma')

  const hoy = hoyEnEcuador()
  try {
    await sembrar(hoy)
    console.log(`Seed aplicado en la base "${base}" con fecha de referencia ${hoy}.`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
