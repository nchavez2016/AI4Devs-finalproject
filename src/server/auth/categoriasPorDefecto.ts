import { TipoMovimiento } from '@/generated/prisma/enums'

/**
 * Categorías que se crean para todo usuario nuevo, en la misma transacción que su
 * registro: el flujo principal (HU-001) exige una categoría y el usuario nuevo no
 * tiene ninguna (design.md, "Categorías por defecto"). Lista editable.
 */
export const CATEGORIAS_POR_DEFECTO: { nombre: string; tipo: TipoMovimiento }[] = [
  { nombre: 'Insumos', tipo: TipoMovimiento.GASTO },
  { nombre: 'Servicios básicos', tipo: TipoMovimiento.GASTO },
  { nombre: 'Arriendo', tipo: TipoMovimiento.GASTO },
  { nombre: 'Transporte', tipo: TipoMovimiento.GASTO },
  { nombre: 'Otros', tipo: TipoMovimiento.GASTO },
  { nombre: 'Ventas', tipo: TipoMovimiento.INGRESO },
  { nombre: 'Otros ingresos', tipo: TipoMovimiento.INGRESO },
]
