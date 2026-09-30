# Tasks

> El change no tiene specs (`skip_specs`); los nombres exactos de los tests están en design.md → Escenarios.
> `globals.css` y `layout.tsx` no tienen tests ni se pueden caracterizar en jsdom (no procesa Tailwind ni fuentes): el grupo 1 se verifica con el build y la sonda, y el grupo 4 con revisión humana.

## 1. Tokens, fuentes y AGENTS.md

- [x] 1.1 Reescribir `src/app/globals.css` según design.md → Decisión 1: catálogo completo de tokens.md 3.3 en `@theme static` con `--*: initial`, `@keyframes giro` y `resaltado`, tokens de movimiento y `--foco-separacion` en `:root`, redefiniciones "→" bajo `escritorio`/`amplio`, `color-scheme: light`, `body` y `:focus-visible` global; un bloque `@media (prefers-reduced-motion: reduce)` que solo redefine tokens (movimiento.md, 6): `--duracion-rapida`, `--duracion-base` y `--duracion-panel` a `0ms`, `--duracion-resaltado` a `2000ms`, `--duracion-resaltado-salida` a `0ms` y `--animate-giro` a `none`; sin el bloque `prefers-color-scheme: dark`. Verificar: `npm run build` termina sin errores y el CSS generado en `.next/` contiene `--color-primary`, `--spacing-alto-control`, `color-scheme: light` y `prefers-reduced-motion`, y no contiene `--color-zinc-50` ni `--spacing:`.
- [x] 1.2 Sonda de utilidades: archivo temporal `src/app/sonda-utilidades.tsx` que usa las clases de las dos columnas de design.md → Decisión 3 (incluidas las "a confirmar"); `npm run build`; buscar cada clase en el CSS de `.next/`. Actualizar la tabla de design.md con el resultado real y borrar la sonda. Verificar: `git status` solo muestra `design.md` y `globals.css` modificados.
- [x] 1.3 En `src/app/layout.tsx`, sustituir Geist por `IBM_Plex_Sans` y `Source_Serif_4` según design.md → Decisión 2, ajustar `--font-interfaz`/`--font-titulo` en `globals.css`, y cambiar `lang="en"` por `lang="es"` en `<html>`. Verificar: `npm run build` sin errores y `npm run dev` sirve `/` con `<html lang="es">`, las clases de las dos variables en `<html>` y la familia computada del `body` empieza por IBM Plex Sans (inspección en el navegador).
- [x] 1.4 Añadir en `AGENTS.md` → Convenciones la línea: "SÍ: los estilos usan solo los tokens definidos en `docs/diseno/sistema/` (punto de entrada: `README.md`). NO: ningún valor visual literal." Verificar: `git diff AGENTS.md` muestra solo esa línea.
- [x] 1.5 Cierre del grupo: `npm run lint`, `npm run typecheck` y `npm run test:run` en verde.

## 2. Importe

### formatea un ingreso como +$25,50
- [x] 2.1 RED: en `src/components/ui/Importe.test.tsx`, test `formatea un ingreso como +$25,50` (`formatearImporte('25.50', 'ingreso')`). Verificar: falla porque `formatearImporte` no existe.
- [x] 2.2 GREEN: crear `src/components/ui/Importe.tsx` con `formatearImporte` mínimo. Verificar: el test pasa.
- [x] 2.3 REFACTOR. Verificar: el archivo sigue en verde.

### formatea un gasto como −$25,50 con el signo U+2212
- [x] 2.4 RED: test `formatea un gasto como −$25,50 con el signo U+2212` (compara con `'−$25,50'`). Verificar: falla por el signo.
- [x] 2.5 GREEN: signo U+2212 para `gasto` en `Importe.tsx`. Verificar: el archivo pasa.
- [x] 2.6 REFACTOR. Verificar: el archivo sigue en verde.

### formatea un saldo positivo como $1.234,50
- [x] 2.7 RED: test `formatea un saldo positivo como $1.234,50` (`'1234.50'`, `'saldo'`). Verificar: falla por el formato o el signo.
- [x] 2.8 GREEN: caso `saldo` sin signo en `Importe.tsx`. Verificar: el archivo pasa.
- [x] 2.9 REFACTOR. Verificar: el archivo sigue en verde.

### formatea un saldo negativo como −$120,00
- [x] 2.10 RED: test `formatea un saldo negativo como −$120,00` (`'-120.00'`, `'saldo'`). Verificar: falla porque sale `$-120,00` o sin signo.
- [x] 2.11 GREEN: detectar el signo en el texto, formatear el valor absoluto y anteponer U+2212. Verificar: el archivo pasa.
- [x] 2.12 REFACTOR. Verificar: el archivo sigue en verde.

### formatea el cero como $0,00 sin signo
- [x] 2.13 RED: test `formatea el cero como $0,00 sin signo` (`'0.00'` y `'-0.00'`, `'saldo'`). Verificar: falla con `'-0.00'`.
- [x] 2.14 GREEN: el cero nunca lleva signo. Verificar: el archivo pasa.
- [x] 2.15 REFACTOR. Verificar: el archivo sigue en verde.

### formatea sin convertir el valor a number
- [x] 2.16 RED: test `formatea sin convertir el valor a number` con `'12345678901234567.89'` → `$12.345.678.901.234.567,89`. Si pasa sin cambios (la implementación ya no usa `number`), detenerse y proponer cómo forzar el RED según la guía de apply. Verificar: falla por pérdida de precisión.
- [x] 2.17 GREEN: pasar el texto a `format` tipado como `Intl.StringNumericLiteral`. Verificar: el archivo pasa.
- [x] 2.18 REFACTOR. Verificar: el archivo sigue en verde.

### Importe incluye Ingreso o Gasto solo para lectores de pantalla
- [x] 2.19 RED: test `Importe incluye Ingreso o Gasto solo para lectores de pantalla`: renderiza `<Importe valor="25.50" tipo="ingreso" />` y `tipo="gasto"`; el texto "Ingreso"/"Gasto" está en un elemento con clase `sr-only` y el importe visible es `+$25,50`/`−$25,50`; `saldo` no añade texto oculto. Verificar: falla porque el componente no existe.
- [x] 2.20 GREEN: componente `Importe` en `Importe.tsx`. Verificar: el archivo pasa.
- [x] 2.21 REFACTOR. Verificar: el archivo sigue en verde.

### Importe aplica el color de su caso
- [x] 2.22 RED: test `Importe aplica el color de su caso`: `text-ingreso`, `text-gasto`, `text-negativo` (saldo negativo), `text-muted-foreground` (cero), `text-foreground` (saldo positivo). Verificar: falla por la clase ausente.
- [x] 2.23 GREEN: clase de color según el caso. Verificar: el archivo pasa.
- [x] 2.24 REFACTOR. Verificar: el archivo sigue en verde.

### Importe aplica el tamaño indicado
- [ ] 2.25 RED: test `Importe aplica el tamaño indicado`: `text-cuerpo` por defecto, `text-importe-resumen` y `text-importe-principal`. Verificar: falla por la clase ausente.
- [ ] 2.26 GREEN: prop `tamano`. Verificar: el archivo pasa.
- [ ] 2.27 REFACTOR. Verificar: el archivo pasa y la suite completa (`npm run test:run`) está en verde.

## 3. Button y Campo

### Button aplica las clases de su variante
- [ ] 3.1 RED: en `src/components/ui/Button.test.tsx`, test `Button aplica las clases de su variante`: `primario` (por defecto) → `bg-primary text-primary-foreground`; `secundario` → `bg-secondary border-input`; `terciario` → `text-primary`; `destructivo` → `bg-destructive text-destructive-foreground`. Verificar: falla porque `Button` no existe.
- [ ] 3.2 GREEN: `src/components/ui/Button.tsx` con las cuatro variantes y las medidas de componentes.md 7.1 (solo clases de tokens). Verificar: el archivo pasa.
- [ ] 3.3 REFACTOR. Verificar: el archivo sigue en verde.

### Button en carga tiene aria-busy, está deshabilitado y conserva su ancho
- [ ] 3.4 RED: test `Button en carga tiene aria-busy, está deshabilitado y conserva su ancho`: con `cargando`, `aria-busy="true"`, `disabled`, la etiqueta sigue en el DOM con `invisible`, el indicador está en una capa `absolute` con `animate-giro` y "Guardando…" en `sr-only`. Verificar: falla por `aria-busy` ausente.
- [ ] 3.5 GREEN: estado de carga según design.md → Decisión 5. Verificar: el archivo pasa.
- [ ] 3.6 REFACTOR. Verificar: el archivo sigue en verde.

### Campo enlaza la etiqueta y la ayuda con el control
- [ ] 3.7 RED: en `src/components/ui/Campo.test.tsx`, test `Campo enlaza la etiqueta y la ayuda con el control`: `getByLabelText(etiqueta)` devuelve el input y su `aria-describedby` apunta al texto de ayuda; con `opcional` la etiqueta termina en "(opcional)". Verificar: falla porque `Campo` no existe.
- [ ] 3.8 GREEN: `src/components/ui/Campo.tsx` según design.md → Decisión 6. Verificar: el archivo pasa.
- [ ] 3.9 REFACTOR. Verificar: el archivo sigue en verde.

### Campo con error tiene aria-invalid y el mensaje enlazado con aria-describedby
- [ ] 3.10 RED: test `Campo con error tiene aria-invalid y el mensaje enlazado con aria-describedby`: `aria-invalid="true"`, `aria-describedby` incluye los ids de ayuda y error, el mensaje se muestra y el input tiene `border-destructive`; sin error no hay `aria-invalid`. Verificar: falla por `aria-invalid` ausente.
- [ ] 3.11 GREEN: estado de error con icono SVG en línea. Verificar: el archivo pasa.
- [ ] 3.12 REFACTOR. Verificar: el archivo sigue en verde.

### Campo de monto muestra el prefijo $ y usa inputmode decimal
- [ ] 3.13 RED: test `Campo de monto muestra el prefijo $ y usa inputmode decimal`: con `monto`, el input tiene `inputmode="decimal"` y `text-importe-campo`, y hay un "$" fuera del input. Verificar: falla por `inputmode` ausente.
- [ ] 3.14 GREEN: variante de monto. Verificar: el archivo pasa.
- [ ] 3.15 REFACTOR. Verificar: el archivo pasa y la suite completa está en verde.

### Página de muestra
- [ ] 3.16 Crear `src/app/diseno/page.tsx` (temporal; se elimina al cerrar el change 2) con: los cinco casos de Importe en los tres tamaños; "111,11" y "888,88" en líneas separadas para medir; las cuatro variantes de Button, una deshabilitada y una en carga; Campo normal, opcional, con ayuda, con error y de monto; un `h1` y un `h2`. Solo clases de tokens. Verificar: `npm run build` sin errores y `npm run dev` sirve `/diseno`.

## 4. [HUMANO] Revisión visual y validación final

- [ ] 4.1 [HUMANO] En `/diseno`, "111,11" y "888,88" miden lo mismo (DevTools → ancho del elemento). Si no, la carga de IBM Plex no aplica `tnum`: corregir antes de seguir.
- [ ] 4.2 [HUMANO] Aspecto general frente a los mockups: fuentes, colores, alturas de control y campo en móvil y en escritorio (≥ 768 px), foco visible con teclado, el botón en carga no cambia de ancho.
- [ ] 4.3 Validación final: `npm run lint`, `npm run typecheck`, `npm run test:run` y `openspec validate base-diseno-minima --strict` sin errores.
