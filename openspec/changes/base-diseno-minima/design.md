# Design

## Context

`globals.css` es el de plantilla (`@theme inline`, Geist, bloque oscuro); `layout.tsx` carga Geist;
no existe `src/components/`. Vitest + Testing Library + jsdom ya funcionan, sin `jest-dom`: las
aserciones usan `getAttribute`/`className`. jsdom no procesa Tailwind ni fuentes, así que el CSS y
las fuentes se verifican con el build y la revisión humana (grupo 4). Referencias: tokens.md (3),
tipografia-y-espacio.md (4–5), componentes.md (7.1, 7.2, 7.5).

## Decisiones

**1. Estructura de `globals.css`.** `@import "tailwindcss"` → `@theme static { --*: initial; …catálogo 3.3 }`
con `@keyframes giro` y `resaltado` dentro del bloque → `:root` con duraciones y `--foco-separacion`
→ redefiniciones de los tokens "→" en `:root` bajo `@variant escritorio` / `@variant amplio` →
`@layer base`: `color-scheme: light`, fondo y tinta del `body`, y `:focus-visible` global
(`outline` de `--default-outline-width` en `--color-ring`, `outline-offset: var(--foco-separacion)`).
Alternativa descartada: `@theme inline` con variables intermedias (como la plantilla): duplica
cada token y un tema no podría redefinirlo en `:root`.

**2. Fuentes.** `IBM_Plex_Sans` (pesos 400, 500, 600) y `Source_Serif_4` (600) con `variable`
(`--font-ibm-plex-sans`, `--font-source-serif-4`) en el `<html>`. `--font-interfaz` y
`--font-titulo` las referencian con su respaldo; como `@theme static` se emite en `:root` (el mismo
`<html>` que recibe las variables de `next/font`), la referencia se resuelve.

**3. Utilidades que sobreviven a `--*: initial`** (a confirmar con la sonda de la tarea 1.2, que
actualiza esta tabla con el resultado real):

| Sobreviven (no dependen del tema) | Desaparecen (dependían del tema) |
|---|---|
| `flex`, `grid`, `hidden`, `items-center`, `justify-between`, `flex-col`, `flex-1`, `shrink-0` | escala numérica: `p-4`, `gap-2`, `w-96`, `h-9`, `inset-0`, `leading-6` |
| `w-full`, `h-full`, `min-h-full`, `w-auto` | `text-xs`…`text-9xl`, `font-medium`, `font-semibold`, `tracking-*` |
| `relative`, `absolute`, `sr-only`, `invisible`, `truncate`, `text-center` | `max-w-3xl` y demás `--container-*`, `sm:`/`md:`/`lg:` |
| `border` (ancho `--default-border-width`), `transition-colors`, `antialiased` | paleta (`bg-zinc-50`, `bg-white`), `shadow-*`, `ease-in-out`, `animate-spin`, `font-sans` |
| Con valor numérico propio: `z-10`, `opacity-50`, `grid-cols-2` | A confirmar: fracciones (`top-1/2`), `rounded-full`, `leading-none`, `p-px` |

Las clases de tokens (`bg-primary`, `text-cuerpo`, `font-control`, `h-alto-control`, `size-icono`,
`rounded-control`, `animate-giro`, `escritorio:`) sustituyen a las desaparecidas.

**4. `formatearImporte(valor: string, tipo: 'ingreso' | 'gasto' | 'saldo'): string`.** El signo
y el cero se detectan sobre el texto; el valor absoluto (texto sin "-") se pasa a
`Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format`, que acepta cadenas
decimales exactas sin pasar por `number`; se antepone "+" (ingreso) o "−" U+2212 (gasto, saldo
negativo). El componente `Importe` añade el color (`text-ingreso`, `text-gasto`, `text-negativo`,
`text-muted-foreground`, `text-foreground`), el texto `sr-only` "Ingreso"/"Gasto" y el tamaño
(`cuerpo`, `importe-resumen`, `importe-principal`).

**5. `Button`.** Props `variante` (por defecto `primario`), `cargando`, `textoCarga` (por defecto
"Guardando…"). En carga: `disabled`, `aria-busy="true"`, la etiqueta queda en el DOM con `invisible`
(conserva el ancho), el indicador va en una capa `absolute inset-ninguno` centrada y `textoCarga` en
`sr-only`. El aspecto `muted` de deshabilitado se aplica solo si no está cargando (el botón en carga
mantiene su variante).

**6. `Campo`.** Props `etiqueta`, `ayuda?`, `error?`, `opcional?`, `monto?` más las del `<input>`;
ids con `useId`. `aria-describedby` une los ids de ayuda y error presentes. Monto: prefijo `$` no
editable, `inputMode="decimal"`, `text-importe-campo`. Sin estado ni reformateo.

**7. Sin dependencias.** Las clases se combinan con `[…].filter(Boolean).join(' ')`; el indicador y
el icono de error son SVG en línea con `fill="currentColor"` (sus coordenadas son dibujo, no estilo).

## Escenarios (nombre exacto del test)

- `src/components/ui/Importe.test.tsx`: `formatea un ingreso como +$25,50`; `formatea un gasto como −$25,50 con el signo U+2212`; `formatea un saldo positivo como $1.234,50`; `formatea un saldo negativo como −$120,00`; `formatea el cero como $0,00 sin signo`; `formatea sin convertir el valor a number`; `Importe incluye Ingreso o Gasto solo para lectores de pantalla`; `Importe aplica el color de su caso`; `Importe aplica el tamaño indicado`.
- `src/components/ui/Button.test.tsx`: `Button aplica las clases de su variante`; `Button en carga tiene aria-busy, está deshabilitado y conserva su ancho`.
- `src/components/ui/Campo.test.tsx`: `Campo enlaza la etiqueta y la ayuda con el control`; `Campo con error tiene aria-invalid y el mensaje enlazado con aria-describedby`; `Campo de monto muestra el prefijo $ y usa inputmode decimal`.

## Riesgos / Trade-offs

- [Una clase inexistente no genera CSS y nadie avisa] → sonda de la tarea 1.2 y revisión del grupo 4
  hasta que exista el guardián automático.
- ["Conserva su ancho" no es medible en jsdom] → el test comprueba el mecanismo (etiqueta en el DOM
  con `invisible`, indicador `absolute`); la medida real la confirma el humano.
- [El tipo de `format` puede no aceptar `string` en la `lib` de TypeScript] → tipar el argumento como
  `Intl.StringNumericLiteral`; nunca `Number(valor)`.
- [`src/app/page.tsx` queda sin estilo] → aceptado: es la página de plantilla y se sustituye con la
  primera pantalla de negocio.
