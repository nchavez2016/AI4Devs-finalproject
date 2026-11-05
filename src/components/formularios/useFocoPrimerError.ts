import { useEffect, type RefObject } from 'react'

// Lleva el foco al primer campo inválido del formulario cada vez que cambia el estado
// devuelto por la acción (componentes.md, 7.2).
export function useFocoPrimerError(
  formularioRef: RefObject<HTMLFormElement | null>,
  estado: unknown
): void {
  useEffect(() => {
    formularioRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [formularioRef, estado])
}
