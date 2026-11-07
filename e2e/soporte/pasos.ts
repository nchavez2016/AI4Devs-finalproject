import { expect, type Page } from '@playwright/test'

export interface DatosRegistro {
  nombre: string
  negocio: string
  correo: string
  password: string
}

/** Se registra por la pantalla de registro; la app abre la sesión y lleva al panel. */
export async function registrarse(page: Page, datos: DatosRegistro): Promise<void> {
  await page.goto('/registro')
  await page.getByLabel('Nombre', { exact: true }).fill(datos.nombre)
  await page.getByLabel('Nombre del negocio').fill(datos.negocio)
  await page.getByLabel('Email').fill(datos.correo)
  await page.getByLabel('Contraseña').fill(datos.password)
  await page.getByRole('button', { name: 'Registrarme' }).click()
  await expect(page).toHaveURL(/\/panel$/)
}

export interface DatosCuenta {
  nombre: string
  tipo: 'Banco' | 'Efectivo' | 'Billetera digital'
  saldoInicial: string
}

export async function crearCuenta(page: Page, datos: DatosCuenta): Promise<void> {
  await page.goto('/cuentas')
  await page.getByLabel('Nombre', { exact: true }).fill(datos.nombre)
  await page.getByLabel('Tipo').selectOption({ label: datos.tipo })
  await page.getByLabel('Saldo inicial').fill(datos.saldoInicial)
  // En el estado vacío también hay un botón secundario "Crear cuenta": se acota al formulario.
  await page
    .getByTestId('formulario-cuenta')
    .getByRole('button', { name: 'Crear cuenta' })
    .click()
  await expect(page.getByText(`Cuenta ${datos.nombre} creada.`)).toBeVisible()
}

export interface DatosGasto {
  monto: string
  categoria: string
  cuenta: string
  /** Texto del aviso que confirma el registro, p. ej. "Gasto de $25,50 registrado en Caja." */
  aviso: string
}

/** Registra un gasto con la fecha que propone el formulario (hoy). */
export async function registrarGasto(page: Page, datos: DatosGasto): Promise<void> {
  await page.goto('/transacciones')
  // La pantalla también tiene filtros con las mismas etiquetas: se acota al formulario.
  const formulario = page.getByTestId('formulario-transaccion')
  await formulario.getByLabel('Monto').fill(datos.monto)
  await formulario.getByLabel('Categoría').selectOption({ label: datos.categoria })
  await formulario.getByLabel('Cuenta').selectOption({ label: datos.cuenta })
  await formulario.getByRole('button', { name: 'Guardar transacción' }).click()
  await expect(page.getByText(datos.aviso)).toBeVisible()
}
