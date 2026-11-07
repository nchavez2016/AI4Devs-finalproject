import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { expect, type Page, type TestInfo } from '@playwright/test'

const CARPETA = path.join('docs', 'evidencias', 'e2e')
const ANCHOS = [360, 1280] as const

/**
 * Evidencia opcional: con E2E_EVIDENCIA=1 guarda capturas de /panel a 360 px y 1280 px en
 * docs/evidencias/e2e/. Se llama al final del flujo, tras todas las aserciones. Sin la
 * variable no hace nada y un fallo al capturar solo se avisa: nunca cambia el resultado.
 * Las capturas se commitean a mano, no en cada ejecución (design.md, D5).
 */
export async function guardarEvidenciasDelPanel(page: Page, testInfo: TestInfo): Promise<void> {
  if (process.env.E2E_EVIDENCIA !== '1') return
  // Una sola vez por ejecución: los dos anchos se fijan aquí, no por proyecto.
  if (testInfo.project.name !== 'escritorio') return

  try {
    mkdirSync(CARPETA, { recursive: true })
    for (const ancho of ANCHOS) {
      await page.setViewportSize({ width: ancho, height: 900 })
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await page.screenshot({
        path: path.join(CARPETA, `panel-${ancho}.png`),
        fullPage: true,
      })
    }
  } catch (error) {
    console.warn(`No se pudieron guardar las evidencias del panel: ${String(error)}`)
  }
}
