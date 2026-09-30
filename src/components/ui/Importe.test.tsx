import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Importe, formatearImporte } from './Importe'

describe('Importe', () => {
  it('formatea un ingreso como +$25,50', () => {
    expect(formatearImporte('25.50', 'ingreso')).toBe('+$25,50')
  })

  it('formatea un gasto como −$25,50 con el signo U+2212', () => {
    expect(formatearImporte('25.50', 'gasto')).toBe('−$25,50')
  })

  it('formatea un saldo positivo como $1.234,50', () => {
    expect(formatearImporte('1234.50', 'saldo')).toBe('$1.234,50')
  })

  it('formatea un saldo negativo como −$120,00', () => {
    expect(formatearImporte('-120.00', 'saldo')).toBe('−$120,00')
  })

  it('formatea el cero como $0,00 sin signo', () => {
    expect(formatearImporte('0.00', 'saldo')).toBe('$0,00')
    expect(formatearImporte('-0.00', 'saldo')).toBe('$0,00')
  })

  it('formatea sin convertir el valor a number', () => {
    expect(formatearImporte('12345678901234567.89', 'saldo')).toBe('$12.345.678.901.234.567,89')
  })

  it('Importe incluye Ingreso o Gasto solo para lectores de pantalla', () => {
    const { container: ingresoContainer } = render(<Importe valor="25.50" tipo="ingreso" />)
    const srIngreso = ingresoContainer.querySelector('.sr-only')
    expect(srIngreso?.textContent?.trim()).toBe('Ingreso')
    expect(ingresoContainer.textContent).toContain('+$25,50')

    const { container: gastoContainer } = render(<Importe valor="25.50" tipo="gasto" />)
    const srGasto = gastoContainer.querySelector('.sr-only')
    expect(srGasto?.textContent?.trim()).toBe('Gasto')
    expect(gastoContainer.textContent).toContain('−$25,50')

    const { container: saldoContainer } = render(<Importe valor="25.50" tipo="saldo" />)
    const srSaldo = saldoContainer.querySelector('.sr-only')
    expect(srSaldo).toBeNull()
    expect(saldoContainer.textContent).toContain('$25,50')
  })
})
