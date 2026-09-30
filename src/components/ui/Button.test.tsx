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
})
