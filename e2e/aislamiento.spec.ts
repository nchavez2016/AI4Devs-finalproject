import { expect, test } from '@playwright/test'
import { correoUnico } from '../src/test/e2e/correo-unico'
import { crearCuenta, registrarGasto, registrarse } from './soporte/pasos'

test('El panel de un usuario no muestra la cuenta ni los gastos de otro', async ({ browser }) => {
  // Dos contextos = dos sesiones de navegador independientes.
  const contextoBeto = await browser.newContext()
  const contextoAna = await browser.newContext()

  try {
    const paginaBeto = await contextoBeto.newPage()
    await registrarse(paginaBeto, {
      nombre: 'Beto E2E',
      negocio: 'Taller Beto E2E',
      correo: correoUnico(),
      password: 'clave-segura-1',
    })
    await crearCuenta(paginaBeto, { nombre: 'Banco Beto', tipo: 'Banco', saldoInicial: '0.00' })
    await registrarGasto(paginaBeto, {
      monto: '500.00',
      categoria: 'Arriendo',
      cuenta: 'Banco Beto',
      aviso: 'Gasto de $500,00 registrado en Banco Beto.',
    })

    const paginaAna = await contextoAna.newPage()
    await registrarse(paginaAna, {
      nombre: 'Ana E2E',
      negocio: 'Tienda Ana E2E',
      correo: correoUnico(),
      password: 'clave-segura-1',
    })
    await paginaAna.goto('/panel')

    await expect(paginaAna.getByRole('heading', { level: 1 })).toHaveText('Tienda Ana E2E')
    await expect(paginaAna.getByTestId('total-gastos')).toHaveText('$0,00')
    await expect(paginaAna.getByText('Banco Beto')).toHaveCount(0)
    await expect(paginaAna.getByText('Arriendo')).toHaveCount(0)
  } finally {
    await contextoBeto.close()
    await contextoAna.close()
  }
})
