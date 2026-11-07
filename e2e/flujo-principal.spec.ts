import { expect, test } from '@playwright/test'
import { correoUnico } from '../src/test/e2e/correo-unico'
import { guardarEvidenciasDelPanel } from './soporte/evidencias'
import { crearCuenta, registrarGasto, registrarse } from './soporte/pasos'

test('Flujo principal de registro, cuenta, gasto y panel', async ({ page }, testInfo) => {
  await registrarse(page, {
    nombre: 'Ana E2E',
    negocio: 'Tienda E2E',
    correo: correoUnico(),
    password: 'clave-segura-1',
  })
  await crearCuenta(page, { nombre: 'Caja E2E', tipo: 'Efectivo', saldoInicial: '100.00' })
  await registrarGasto(page, {
    monto: '25.50',
    categoria: 'Insumos',
    cuenta: 'Caja E2E',
    aviso: 'Gasto de $25,50 registrado en Caja E2E.',
  })

  // Panel: totales del período (mes en curso), saldo de la cuenta y top de categorías.
  await page.goto('/panel')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tienda E2E')
  await expect(page.getByTestId('total-ingresos')).toHaveText('$0,00')
  await expect(page.getByTestId('total-gastos')).toHaveText('$25,50')
  await expect(page.getByTestId('total-balance')).toContainText('−$25,50')

  const saldos = page.getByRole('region', { name: 'Saldos por cuenta' })
  await expect(saldos.getByRole('listitem').filter({ hasText: 'Caja E2E' })).toContainText(
    '$74,50'
  )

  const categorias = page.getByRole('region', { name: 'Categorías de gasto' })
  await expect(categorias.getByRole('row').filter({ hasText: 'Insumos' })).toContainText(
    '$25,50'
  )

  await guardarEvidenciasDelPanel(page, testInfo)
})
