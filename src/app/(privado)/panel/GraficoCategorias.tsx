'use client'

import { useSyncExternalStore } from 'react'
import { Bar, BarChart, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatearImporte } from '@/components/ui/Importe'
import type { CategoriaGasto } from '@/server/dashboard/dashboard'

const sinSuscripcion = () => () => {}

// Visualización de datos (visualizacion.md, 8): barras horizontales con un solo color de
// token, eje de valores desde cero sin marcas, etiqueta de valor con el formato de Importe.
// Los importes llegan como texto; Number() solo se usa para la longitud de la barra.
export function GraficoCategorias({ categorias }: { categorias: CategoriaGasto[] }) {
  // Recharts mide el contenedor: se dibuja solo en el navegador, tras montar.
  const montado = useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false
  )

  if (!montado || typeof ResizeObserver === 'undefined') {
    return null
  }

  const datos = categorias.map((c) => ({
    categoria: c.categoria,
    valor: Number(c.total),
    etiqueta: formatearImporte(c.total, 'saldo'),
  }))
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duracionEntrada = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--duracion-entrada')
  )

  return (
    <div style={{ height: `calc(var(--spacing-alto-fila-tabla) * ${datos.length})` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical">
          <XAxis
            type="number"
            domain={[0, (maximo: number) => maximo * 1.3]}
            tick={false}
            axisLine={false}
            hide
          />
          <YAxis
            type="category"
            dataKey="categoria"
            width="auto"
            tick={{ fill: 'var(--color-muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine x={0} stroke="var(--color-border)" />
          <Bar
            dataKey="valor"
            fill="var(--color-chart-1)"
            isAnimationActive={!movimientoReducido && Number.isFinite(duracionEntrada)}
            animationDuration={duracionEntrada}
          >
            <LabelList dataKey="etiqueta" position="right" fill="var(--color-foreground)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
