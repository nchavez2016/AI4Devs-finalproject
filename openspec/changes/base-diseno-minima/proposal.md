# Proposal

## Why

El sistema de diseño "Libro de caja" existe solo en `docs/diseno/sistema/`. Si las primeras
pantallas se construyen sobre el tema por defecto de Tailwind y Geist, habrá que rehacerlas. Este
change convierte en código el mínimo necesario para que nazcan con el estilo correcto.

## What Changes

- `src/app/globals.css`: catálogo completo de tokens (tokens.md, 3.3) en `@theme static` con
  `--*: initial`, tokens sin utilidad en `:root`, redefiniciones en `escritorio`/`amplio`, foco
  global, fotogramas `giro`/`resaltado` y bloque `prefers-reduced-motion: reduce` que redefine los
  tokens de movimiento (movimiento.md, 6). Se elimina el bloque `prefers-color-scheme: dark` y se
  declara `color-scheme: light`.
- **BREAKING (visual)**: desaparecen todas las utilidades del tema por defecto (`p-4`, `text-sm`,
  `bg-zinc-50`…). La página de inicio de plantilla (`src/app/page.tsx`) queda sin esos estilos; no
  se toca porque la sustituye la primera pantalla de negocio.
- `src/app/layout.tsx`: IBM Plex Sans y Source Serif 4 con `next/font/google` en lugar de Geist, y `lang="es"`.
- `src/components/ui/`: `Button` (cuatro variantes y carga), `Campo` (etiqueta, ayuda, error y
  variante de monto) e `Importe` (función pura `formatearImporte` y componente).
- Página temporal `src/app/diseno/page.tsx` para la revisión visual humana; se elimina al cerrar el
  change 2.
- `AGENTS.md`: una línea en Convenciones sobre el uso exclusivo de tokens.

## Capabilities

### New Capabilities
Ninguna. El change no altera comportamiento de la app (`skip_specs: true`); los escenarios con
nombre de test exacto están en design.md.

### Modified Capabilities
Ninguna. No existen specs en `openspec/specs/`, así que ninguna se ve afectada.

## Impact

- Archivos: `globals.css`, `layout.tsx`, `AGENTS.md`, nuevos `src/components/ui/*` y
  `src/app/diseno/page.tsx`.
- Dependencias: ninguna nueva. `next/font/google` viene con Next.js; no se usan `clsx`,
  `tailwind-merge` ni librerías de iconos (el indicador de carga y el icono de error son SVG en línea).

## Fuera de alcance

- Instalar shadcn/ui (llegará con el primer componente que lo necesite, justificado en su design.md).
- Playwright, el guardián automático de clases del hook `pre-commit` y el test de contraste.
- Tema oscuro.
- Pantallas de negocio y la sustitución de `src/app/page.tsx`.
- Comportamiento del campo de monto al salir (reformateo a "25,50"), validación al enviar y foco al
  primer campo inválido: llegan con el formulario de registro.
- Selector de tipo, tarjeta, lista/tabla de movimientos y el caso "Totales con etiqueta" de Importe.
