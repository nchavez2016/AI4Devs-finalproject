import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('Button aplica las clases de su variante', () => {
    const { container: primarioDefecto } = render(<Button>Guardar</Button>)
    expect(primarioDefecto.firstElementChild?.className).toContain('bg-primary')
    expect(primarioDefecto.firstElementChild?.className).toContain('text-primary-foreground')

    const { container: secundario } = render(<Button variante="secundario">Cancelar</Button>)
    expect(secundario.firstElementChild?.className).toContain('bg-secondary')
    expect(secundario.firstElementChild?.className).toContain('border-input')

    const { container: terciario } = render(<Button variante="terciario">Quitar filtros</Button>)
    expect(terciario.firstElementChild?.className).toContain('text-primary')

    const { container: destructivo } = render(<Button variante="destructivo">Eliminar</Button>)
    expect(destructivo.firstElementChild?.className).toContain('bg-destructive')
    expect(destructivo.firstElementChild?.className).toContain('text-destructive-foreground')
  })

  it('Button en carga tiene aria-busy, está deshabilitado y conserva su ancho', () => {
    const { container } = render(<Button cargando>Guardar gasto</Button>)
    const button = container.querySelector('button')
    expect(button?.getAttribute('aria-busy')).toBe('true')
    expect(button?.hasAttribute('disabled')).toBe(true)

    const etiqueta = button?.querySelector('.invisible')
    expect(etiqueta?.textContent).toBe('Guardar gasto')

    const indicador = button?.querySelector('.animate-giro')
    expect(indicador).not.toBeNull()
    const capaIndicador = button?.querySelector('.absolute')
    expect(capaIndicador).not.toBeNull()

    const textoSr = button?.querySelector('.sr-only')
    expect(textoSr?.textContent).toBe('Guardando…')
  })
})
