# Tasks

Leyenda: **[HUMANO]** = lo hace la persona; el agente se detiene antes.
Tests de pantalla: unitarios (jsdom) en `src/app/(privado)/transacciones/transacciones.test.tsx`
(salvo que se indique otro archivo), con los simulados que ya tiene. jsdom no aplica Tailwind:
el diseño responsive se comprueba por clases y por orden del DOM (design, Context).
"Si pasa sin cambios": detenerse y proponer cómo forzar el RED (config.yaml).
Pantallas: cargar antes la skill `ux-cuadre`. Sin migraciones ni dependencias nuevas.

## 0. Decisiones previas

- [x] 0.1 [HUMANO] Autorizar la modificación del test existente "Pantalla de transacciones muestra los movimientos y el formulario en dos columnas": hoy exige los movimientos antes de la tarjeta y pasará a exigir lo contrario y la colocación en escritorio (spec, mismo escenario). Verificación: autorización registrada en progress.md.
- [x] 0.2 [HUMANO] Aceptar el orden de foco en escritorio de design a (formulario a la derecha recibe el foco antes que los movimientos de la izquierda). Verificación: design a indica que se aceptó.
- [x] 0.3 [HUMANO] Commitear o descartar el cambio pendiente de `vitest.config.mts` antes de aplicar. Verificación: `git status` limpio.

## 1. Caracterización

- [x] 1.1 CARACTERIZACIÓN — ejecutar `transacciones.test.tsx`, `estados.test.tsx` de transacciones y `src/server/transacciones/pantalla.test.ts` en verde, y anotar en progress.md el número de tests de cada uno, antes de tocar `ContenidoTransacciones.tsx`, `FormularioTransaccion.tsx`, `FiltrosMovimientos.tsx` o `ListaMovimientos.tsx`.

## 2. Formulario primero en el documento

- [x] 2.1 RED — modificar (autorizado en 0.1) el test "Pantalla de transacciones muestra los movimientos y el formulario en dos columnas": la tarjeta precede a la región "Movimientos" y su contenedor tiene `escritorio:col-start-2` y `escritorio:row-start-1`, y la región `escritorio:col-start-1` y `escritorio:row-start-1`. Debe fallar porque hoy los movimientos van primero.
- [x] 2.2 GREEN — `ContenidoTransacciones.tsx`: mover el contenedor de la tarjeta antes de la sección y añadir las clases de design a. Test en verde y el resto del archivo también.
- [x] 2.3 REFACTOR — `transacciones.test.tsx` en verde.

## 3. Espacio bajo el encabezado

- [x] 3.1 RED — test "La región de avisos vacía no añade espacio bajo el encabezado": el contenedor `animate-entrada` tiene dos hijos y la región `aria-live="polite"` está dentro del primero, después del `h1`. Debe fallar porque hoy la región es un hijo más del contenedor.
- [x] 3.2 GREEN — `ContenidoTransacciones.tsx`: agrupar `EncabezadoPagina` y la región en un `div` `flex flex-col gap-entre-campos` (design f). Test en verde, y "Transacción registrada se anuncia y se resalta en el listado" también.
- [x] 3.3 REFACTOR — `transacciones.test.tsx` en verde.

## 4. Formulario: selector de tipo y foco al cargar

- [x] 4.1 CARACTERIZACIÓN — test "Los iconos del selector de tipo son decorativos": cada opción contiene un `svg` con `aria-hidden="true"` (clase de lucide `lucide-minus` en Gasto y `lucide-plus` en Ingreso) y los radios se llaman exactamente "Gasto" e "Ingreso". Pasa con el código actual; verificar por mutación (quitar `aria-hidden` en `SelectorTipo.tsx`, ver el fallo, restaurar) sin commit del cambio mutado.
- [x] 4.2 CARACTERIZACIÓN — test "Abrir la pantalla de transacciones no mueve el foco": tras `mostrarPantalla`, `document.activeElement` es `document.body` y ningún elemento tiene `autofocus`. Pasa con el código actual; verificar por mutación (`autoFocus` en el monto, ver el fallo, restaurar).

## 5. Botón Guardar fijo en móvil

- [x] 5.0a RED — `src/app/estilos.test.ts`, test "La animación de entrada no deja transform ni filter aplicados al terminar": lee `src/app/globals.css` como texto y exige que, si el fotograma `entrada` usa `transform` o `filter`, `--animate-entrada` no tenga fill-mode `forwards` ni `both`. Falla hoy a propósito (el fotograma usa `transform` y el token, `both`; design c, "Animación de entrada"): anotar el fallo en progress.md y seguir con 5.0b.
- [x] 5.0b GREEN — `globals.css`: `--animate-entrada` con `backwards`; tokens.md 3.3.8 actualizado (design c). Test en verde, y "La entrada de página se anima solo en el contenedor" también.
- [x] 5.1 RED — test "El botón Guardar transacción queda fijo abajo en móvil": el botón sigue dentro del `form`; su envoltorio tiene `fixed`, `inset-x-ninguno`, `bottom-ninguno`, `z-10`, `pb-relleno-barra-inferior` y `escritorio:static`; y el `main` tiene `pb-reserva-barra-segura` y `escritorio:pb-seccion`. Debe fallar porque no existe el envoltorio.
- [x] 5.2 GREEN — `globals.css` (tokens `--spacing-margen-seguro-inferior` con `env(safe-area-inset-bottom, 0px)`, `--spacing-relleno-barra-inferior` y `--spacing-reserva-barra-segura`; design c), `FormularioTransaccion.tsx` (envoltorio del botón) y `ContenidoTransacciones.tsx` (relleno del `main`). Sin cambios en `src/app/layout.tsx`. Test en verde; "Error al guardar la transacción conserva los datos escritos" sigue en verde (el aviso queda encima del envoltorio).
- [x] 5.3 REFACTOR — documentar los tres tokens en tokens.md 3.3.4; `transacciones.test.tsx` en verde.
- [x] 5.4 RED — `src/app/estilos.test.ts`, test "El botón fijo no tapa el campo enfocado": lee `src/app/globals.css` como texto y exige `scroll-padding-bottom: var(--spacing-reserva-barra-inferior)` sobre `html` y su anulación dentro de la variante `escritorio`. Debe fallar porque la regla no existe.
- [x] 5.5 GREEN — `globals.css`, `@layer base` (design d). Test en verde.
- [x] 5.6 REFACTOR — test en verde.

## 6. Cabecera "Hoy" en la lista móvil

- [x] 6.1 RED — test "La cabecera del día de hoy en la lista móvil empieza por Hoy": con `hoy: '2026-11-06'` y gastos del 2026-11-06 y 2026-11-05, los `h3` son "Hoy · vie, 6 nov" y "jue, 5 nov". Debe fallar porque hoy falta "Hoy · ".
- [x] 6.2 GREEN — `ListaMovimientos.tsx` recibe `hoy` y `ContenidoTransacciones.tsx` se lo pasa (design e). Test en verde, y "Listado muestra cada movimiento con su categoría, cuenta e importe con signo" también.
- [x] 6.3 REFACTOR — `transacciones.test.tsx` en verde.

## 7. Filtros plegables en móvil

- [x] 7.1 RED — test "Los filtros empiezan plegados en móvil y se despliegan con el botón Filtros": botón "Filtros" con `aria-expanded="false"`, `aria-controls` igual al id del grupo "Filtros", clase `escritorio:hidden`; el grupo con `hidden` y `escritorio:grid`; tras un clic `aria-expanded="true"` y el grupo sin `hidden`; tras otro, como al principio. Debe fallar porque no existe el botón.
- [x] 7.2 GREEN — `FiltrosMovimientos.tsx`: estado `abierto`, botón y clases de design b. Test en verde, y "La región de movimientos tiene un título de nivel 2 que la nombra" y "Cambiar un filtro actualiza la URL y conserva los datos mientras carga" también.
- [x] 7.3 REFACTOR — `transacciones.test.tsx` en verde.
- [x] 7.4 RED — test "El botón Filtros indica cuántos filtros hay activos": "Filtros", "Filtros (2)" y "Filtros (4)". Debe fallar porque el botón no muestra el número.
- [x] 7.5 GREEN — `filtros.ts`: `contarFiltrosActivos`; `FiltrosMovimientos.tsx` lo usa. Test en verde.
- [x] 7.6 REFACTOR — `hayFiltrosActivos` puede apoyarse en `contarFiltrosActivos`; `transacciones.test.tsx` en verde.
- [x] 7.7 RED — test "Quitar filtros y Actualizando siguen visibles con los filtros plegados": el botón "Quitar filtros" y la región `aria-live` de "Actualizando…" no están dentro del grupo "Filtros". Debe fallar porque hoy están dentro.
- [x] 7.8 GREEN — `FiltrosMovimientos.tsx`: sacar esa fila del grupo plegable. Test en verde, y "Quitar filtros solo aparece con un filtro activo" y "Filtros sin resultados muestran el vacío por filtro" también.
- [x] 7.9 REFACTOR — `transacciones.test.tsx` en verde.

## 8. Documentación del sistema de diseño

- [x] 8.1 `.agents/skills/ux-cuadre/SKILL.md`, "Composición lista + formulario": regla "En pantallas de registro frecuente (transacciones), el formulario va primero en móvil, también en el DOM; en el resto, la lista primero", más filtros plegables y botón fijo en móvil. Verificación: el texto aparece en la skill. Avisar a la persona de que copie la skill a `.claude/skills/`.
- [x] 8.2 `docs/diseno/sistema/componentes.md`: 7.2 (formulario antes de la lista en móvil; el monto solo recibe el foco en un registro abierto a propósito, nunca al cargar la página; icono −/+ decorativo con nombre "Gasto"/"Ingreso"), 7.4 (ejemplo "Hoy · vie, 6 nov"; filtros plegados en móvil tras "Filtros (n)"). Verificación: secciones actualizadas sin valores literales.
- [x] 8.3 `docs/diseno/sistema/tokens.md` 3.3.7b y `checklist.md`: orden de columnas en móvil según la regla de 8.1. Verificación: ambos textos coinciden con la skill.

## 9. Cierre

- [x] 9.1 [HUMANO] Revisión manual a 360 px y 1280 px: formulario primero en móvil, filtros plegados, botón fijo sin tapar el campo enfocado con el teclado abierto, cabecera "Hoy" y sin hueco bajo el encabezado; en escritorio, dos columnas con el formulario a la derecha. Con el formulario desplazado, al guardar, comprobar si el aviso de éxito queda visible; si no, anotarlo en `docs/pendientes.md`.
- [x] 9.2 Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run test:run` y `openspec validate transacciones-movil --strict`, todos sin errores.
