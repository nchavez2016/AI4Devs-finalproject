import { clsx, type ClassValue } from 'clsx'

// Une clases condicionales. No usa tailwind-merge: no conoce los tokens propios y
// borraría clases válidas (design.md, D1).
export function cn(...entradas: ClassValue[]): string {
  return clsx(entradas)
}
