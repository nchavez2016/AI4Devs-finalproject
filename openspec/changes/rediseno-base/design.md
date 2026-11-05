# Design: rediseno-base

## Context

Motivación en proposal.md. Estado actual: sin `src/app/(privado)/layout.tsx`, sin shadcn/ui
(`components.json` no existe), sin librería de iconos (Campo dibuja su SVG a mano) y sin la
comprobación de clases de tokens.md 3.2 en `.husky/pre-commit`. Vitest ya recoge
`scripts/**/*.test.mjs`, y `typescript` ya está instalado.

## Goals / Non-Goals

**Goals:** una sola estructura privada (cabecera + `main`), tokens nuevos sin valores literales en
los componentes, y shadcn/ui adoptado solo donde ahorra trabajo real.
**Non-Goals:** instalar componentes que ninguna pantalla de este change usa.

## Decisions

**D1. Dependencias aprobadas por el humano, con versión exacta.**

| Paquete (instalado) | Para qué | Alternativa descartada |
|---|---|---|
| `lucide-react` 1.69.0 | Iconos de trazo, uno por import, `aria-hidden` y clase `size-icono` | SVG a mano: sin coherencia de trazo y más código que mantener |
| `@radix-ui/react-dialog` 1.3.1 | Base del Sheet (menú móvil): foco atrapado, Escape y retorno del foco | Paquete `radix-ui` completo: trae primitivas que no se usan |
| `clsx` 2.1.1 | `cn()` de los componentes de shadcn/ui | — |

- **Componentes de shadcn/ui en este change: solo Sheet** (menú móvil). Los selectores son un
  `select` nativo con tokens y la tabla de movimientos es propia (componentes.md 7.4), no la de
  shadcn/ui; esto vale también para `transacciones`. Dialog y Dropdown Menu no se instalan aquí:
  se decidirán en el change que los necesite.
- **Sin `tailwind-merge`:** no conoce los tokens propios y trataría `text-cuerpo` y
  `text-foreground` como la misma utilidad, así que borraría una de las dos. `cn()` = `clsx`.
- **Sin `tw-animate-css`:** las entradas del Sheet usan fotogramas propios con duraciones de
  token (`--duracion-panel`). Se actualiza movimiento.md, que lo daba por instalado.
- Sheet se copia a mano en `src/components/ui/sheet.tsx` (no `shadcn init`, que reescribiría
  `globals.css`), y se adapta con tokens.md 3.2.

**D2. Comprobación de clases (tokens.md 3.2) antes del primer componente de shadcn/ui.**
`scripts/diseno/comprobar-clases.mjs` usa el API de compilación de `typescript` para sacar todos
los literales y plantillas de los `.ts/.tsx` en stage, aplica los patrones de 3.2 y revisa los
`@apply` de los `.css`. Informa archivo, línea y clase. Se añade a `.husky/pre-commit` antes de
lint. Se descartó una expresión regular sobre `className`, porque no ve `cn(...)`.

**D3. Tokens nuevos** (en tokens.md 3.3 y en `globals.css`). Los valores se fijan al aplicar, con
el ratio calculado por script en la tabla 3.4:
`--shadow-tarjeta`, `--shadow-tarjeta-hover`; `--color-icono` y `--color-icono-fondo` (tono
claro del primario; mínimo 3:1); `--degradado-marca` (de `primary` a `primary-hover`, en `:root`,
con `primary-foreground` a 4,5:1 en ambos extremos); `--radius-contenedor-icono`,
`--spacing-contenedor-icono`, `--spacing-alto-cabecera`; `--columnas-lista-formulario` (en
`:root`, usada como `grid-cols-(--columnas-lista-formulario)` dentro de `escritorio:`);
`--animate-entrada` (opacidad y 0,25rem, `--duracion-entrada` ≤ 220 ms). Con movimiento reducido,
`--animate-entrada: none`. La animación se aplica una vez al contenedor de la página, nunca a cada
fila ni a cada tarjeta.

**D4. Cabecera.** El layout de `(privado)` es un componente de servidor: marca, formulario de
`cerrarSesion` y `NavegacionPrincipal` (cliente, con `usePathname`). La sección activa sale de una
función pura `seccionActiva(ruta)` con tests de unidad. Los `<header>` de `EncabezadoPagina` quedan
dentro de `<main>`, así que solo la cabecera de la app tiene el rol `banner`.

**D5. Formularios.** Un hook `useFocoPrimerError` busca, tras cada estado devuelto por la acción,
el primer `[aria-invalid="true"]` del formulario y lo enfoca. Todos los `form` llevan `noValidate`.
En el campo de monto, el borde pasa del `input` a un contenedor con `focus-within`, y el input
queda sin borde.

## Risks / Trade-offs

- [Tests existentes que contradicen el diseño] → antes de tocarlos se pide confirmación (tarea
  0.1): "EncabezadoPagina muestra el enlace al panel solo si se pide", "Pantalla de cuentas enlaza
  de vuelta al panel", "Pantalla de categorías enlaza de vuelta al panel" y "El panel muestra por
  dónde empezar".
- [Las specs principales y el código ya no coinciden en algunos textos] (por ejemplo, "Todavía
  no tienes cuentas…" frente a "Aún no tienes cuentas"; "Cuenta Banco Pichincha creada." frente a
  "Cuenta creada"; "Ingresos" frente a "Ingreso") → no se corrige aquí: va en Discrepancias de
  progress.md para que decidas.
- [Falsos positivos de la comprobación] → se ajusta la expresión; nunca se desactiva (tokens.md 3.2).
- [`transacciones` usa `volverAlPanel`] → aplicar este change primero y ajustar su tarea 6.2.
