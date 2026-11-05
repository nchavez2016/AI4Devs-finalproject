# Proposal: rediseno-base

## Why

Cada pantalla se arma por su cuenta: no hay cabecera compartida, el panel lleva una navegación
provisional y los formularios quedan bajo las listas. El 5-nov-2026 el humano relajó parte de las
prohibiciones visuales del brief; este change lo convierte en tokens, componentes y una estructura
común antes de que lleguen transacciones y el dashboard.

## What Changes

- **Sistema de diseño** (`docs/diseno/`): brief, decisiones, tokens, componentes y checklist
  recogen la decisión (iconos, contenedor de icono, sombra de tarjeta, degradado monocromo de
  marca, animación de entrada) con tokens de función, variante de movimiento reducido y ratio de
  contraste de cada color o par nuevo.
- **Cabecera compartida** en `src/app/(privado)/layout.tsx`: marca, navegación (Panel, Cuentas,
  Categorías) con `aria-current`, cerrar sesión y menú móvil.
- **BREAKING (interfaz):** se retiran "← Volver al panel", la prop `volverAlPanel` y la navegación
  y el botón "Cerrar sesión" del panel.
- **Composición:** cuentas y categorías en dos columnas en escritorio (formulario en tarjeta con
  título) y una en móvil; login y registro en tarjeta centrada con la marca; panel con tarjetas de
  acceso.
- **Formularios:** "$" dentro del campo de monto; validación al enviar y foco en el primer campo
  inválido.
- **Skill `ux-cuadre`** actualizada en `.agents/skills/`.
- **shadcn/ui:** solo Sheet (menú móvil), adaptado a los tokens, más la comprobación de clases por
  defecto en `pre-commit`. Select nativo con tokens y tabla propia.

## Capabilities

### New Capabilities
- `navegacion`: cabecera privada, sección activa, cierre de sesión y menú móvil.
- `formularios`: prefijo de monto, validación al enviar y foco en el primer campo inválido.

### Modified Capabilities
- `autenticacion`: "Cierre de sesión" pasa a la cabecera; login y registro en tarjeta con marca.
- `cuentas`: "Acceso desde el panel" (tarjetas) y "Pantalla de cuentas" (dos columnas).
- `categorias`: "Pantalla de categorías" (dos columnas).

## Impact

- Código: `src/app/(privado)/**`, `src/app/login`, `src/app/registro`, `src/components/**`,
  `globals.css`, `.husky/pre-commit` y un script nuevo en `scripts/`.
- Tests existentes que cambiarían (requieren confirmación): los de "enlace al panel" de
  EncabezadoPagina, cuentas y categorías, y "El panel muestra por dónde empezar".
- `transacciones` (sin aplicar) usa `volverAlPanel` en su tarea 6.2: aplicar antes este change y
  ajustar esa tarea.
- Dependencias aprobadas por el humano (5-nov-2026), con versión exacta: `lucide-react`,
  `@radix-ui/react-dialog` y `clsx`. Sin `tailwind-merge` ni `tw-animate-css` (design.md D1).

## Fuera de alcance

Modo oscuro, migrar Button/Campo/Importe a shadcn/ui, otros componentes de shadcn/ui, filtros
avanzados (después de la entrega), la pantalla de transacciones (y su enlace) y el dashboard.
