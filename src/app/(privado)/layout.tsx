import type { ReactNode } from 'react'
import { CabeceraPrivada } from '@/components/navegacion/CabeceraPrivada'

export default function LayoutPrivado({ children }: { children: ReactNode }) {
  return (
    <>
      <CabeceraPrivada />
      {children}
    </>
  )
}
