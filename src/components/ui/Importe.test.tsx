import { describe, expect, it } from 'vitest'
import { formatearImporte } from './Importe'

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
})
