import { expect, test } from '@playwright/test'

test('Abrir el panel sin sesión en el navegador lleva al login', async ({ page }) => {
  await page.goto('/panel')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
})
