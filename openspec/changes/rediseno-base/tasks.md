# Tasks: rediseno-base

## 0. Aprobaciones previas [HUMANO]

- [x] 0.1 [HUMANO] Confirmar qué se hace con los tests existentes que contradicen el diseño (design.md, Risks): retirar "EncabezadoPagina muestra el enlace al panel solo si se pide", "Pantalla de cuentas enlaza de vuelta al panel", "Pantalla de categorías enlaza de vuelta al panel" y "El panel muestra por dónde empezar"; y añadir a "Pantalla de cuentas sin cuentas muestra el estado vacío" la comprobación de que el botón es secundario. Se verifica con la respuesta anotada en progress.md. El agente se detiene hasta tenerla.
- [x] 0.2 [HUMANO] Aprobar las dependencias de design.md D1 (`lucide-react`, `@radix-ui/react-dialog`, `clsx`) y que este change solo instale Sheet. Se verifica con la aprobación anotada en progress.md. Sin ella no se ejecuta el grupo 3.

## 1. Sistema de diseño (documentación y tokens)

- [x] 1.1 Actualizar `docs/diseno/brief.md` (criterios anti-IA: lo que se relaja y lo que se mantiene) y registrar en `docs/diseno/sistema/decisiones.md` la decisión del 5-nov-2026 con su porqué. Se verifica releyendo que ninguna prohibición relajada sigue en el brief.
- [x] 1.2 Añadir a `docs/diseno/sistema/tokens.md` (3.3) y a `src/app/globals.css` los tokens de design.md D3, incluida la variante con movimiento reducido. Calcular por script (en el scratchpad, no en el repo) el ratio de cada color o par nuevo y añadirlo a la tabla 3.4. Se verifica con `npm run build` y con cada par nuevo en 3.4 en "Cumple".
- [x] 1.3 Actualizar `componentes.md` (tarjeta con elevación, contenedor de icono, selector de tipo, tabla con barra de filtros, diálogo, cabecera; campo de monto con el "$" dentro del borde), `movimiento.md` (animación de entrada; sin `tw-animate-css`), `estados.md` (el botón del estado vacío pasa a secundario porque la vista ya tiene un primario) y `checklist.md` (retirar las prohibiciones relajadas). Se verifica con una búsqueda de "sombra de tarjeta", "círculos" y "animación de entrada" en checklist.md: no debe quedar ninguna prohibición relajada.

## 2. Comprobación de clases del tema por defecto (tokens.md 3.2)

- [x] 2.1 RED — `scripts/diseno/comprobar-clases.test.mjs`: "detecta clases del tema por defecto en cadenas sueltas", "admite la sintaxis de variable de tema" y "detecta clases por defecto en @apply". Fallan porque el script no existe.
- [x] 2.2 GREEN — `scripts/diseno/comprobar-clases.mjs` (design.md D2), con salida de archivo, línea y clase. Tests en verde.
- [x] 2.3 REFACTOR — Pasar el script sobre `src/` completo: sin falsos positivos ni clases por defecto en el código actual.
- [x] 2.4 Añadir el script a `.husky/pre-commit` antes de lint. Si el hook de protección bloquea la edición, se detiene y la tarea se marca [HUMANO]. Se verifica con un commit de prueba que contenga `p-4`, que debe bloquearse, y deshaciéndolo después.

## 3. Dependencias y Sheet (requiere 0.2)

- [x] 3.1 Instalar las dependencias aprobadas con versión exacta y justificarlas en este design.md. Se verifica con `npm run build` y `npm run typecheck`.
- [x] 3.2 Copiar Sheet a `src/components/ui/sheet.tsx` y crear `cn()` en `src/lib/cn.ts` (solo `clsx`), adaptados a los tokens. Se verifica con `node scripts/diseno/comprobar-clases.mjs src/components/ui/sheet.tsx` sin hallazgos.

## 4. Escenario: La cabecera muestra la marca y la navegación principal

- [x] 4.1 RED — `src/components/navegacion/CabeceraPrivada.test.tsx`: "La cabecera muestra la marca y la navegación principal".
- [x] 4.2 GREEN — `src/components/navegacion/CabeceraPrivada.tsx`, `NavegacionPrincipal.tsx` y `src/app/(privado)/layout.tsx`.
- [x] 4.3 REFACTOR

## 5. Escenario: La cabecera marca la sección activa

- [x] 5.1 RED — `src/components/navegacion/secciones.test.ts`: "La cabecera marca la sección activa".
- [x] 5.2 GREEN — `src/components/navegacion/secciones.ts` (`seccionActiva`) y `aria-current` en `NavegacionPrincipal.tsx`.
- [x] 5.3 REFACTOR

## 6. Escenario: Una subruta mantiene activa su sección

- [x] 6.1 RED — `src/components/navegacion/secciones.test.ts`: "Una subruta mantiene activa su sección".
- [x] 6.2 GREEN — `src/components/navegacion/secciones.ts`.
- [x] 6.3 REFACTOR

## 7. Escenario: La cabecera ofrece cerrar sesión en cada pantalla privada

- [x] 7.1 CARACTERIZACIÓN — Ejecutar `src/app/(privado)/panel/panel.test.tsx` y `src/server/auth/acciones.test.ts` ("Cierre de sesión termina la sesión y redirige al login") en verde antes de mover el botón.
- [x] 7.2 RED — `src/components/navegacion/CabeceraPrivada.test.tsx`: "La cabecera ofrece cerrar sesión en cada pantalla privada".
- [x] 7.3 GREEN — Formulario de `cerrarSesion` en `CabeceraPrivada.tsx`; quitar el botón de `src/app/(privado)/panel/ContenidoPanel.tsx`. El `nav` provisional se retira en 12.2: "El panel enlaza a cuentas y categorías" depende de él hasta que lo sustituyan las tarjetas.
- [x] 7.4 REFACTOR

## 8. Escenario: El menú móvil muestra la navegación y el cierre de sesión

- [x] 8.1 RED — `src/components/navegacion/MenuMovil.test.tsx`: "El menú móvil muestra la navegación y el cierre de sesión".
- [x] 8.2 GREEN — `src/components/navegacion/MenuMovil.tsx` con Sheet, visible solo por debajo de `escritorio`.
- [x] 8.3 REFACTOR

## 9. Escenario: Escape cierra el menú móvil y devuelve el foco

- [x] 9.1 RED — `src/components/navegacion/MenuMovil.test.tsx`: "Escape cierra el menú móvil y devuelve el foco".
- [x] 9.2 GREEN — `src/components/navegacion/MenuMovil.tsx`: sin cambios de código, el comportamiento lo da Radix Dialog (RED forzado con una mutación temporal que ignoraba Escape).
- [x] 9.3 REFACTOR

## 10. Escenario: Elegir una sección cierra el menú móvil

- [x] 10.1 RED — `src/components/navegacion/MenuMovil.test.tsx`: "Elegir una sección cierra el menú móvil".
- [x] 10.2 GREEN — `src/components/navegacion/MenuMovil.tsx`.
- [x] 10.3 REFACTOR

## 11. Escenario: Las pantallas privadas no enlazan de vuelta al panel (requiere 0.1)

- [x] 11.1 CARACTERIZACIÓN — Ejecutar `src/components/EncabezadoPagina.test.tsx`, `cuentas.test.tsx` y `categorias.test.tsx` en verde.
- [x] 11.2 RED — `src/app/(privado)/navegacion.test.tsx`: "Las pantallas privadas no enlazan de vuelta al panel".
- [x] 11.3 GREEN — Retirar `volverAlPanel` de `src/components/EncabezadoPagina.tsx`, `ContenidoCuentas.tsx` y `ContenidoCategorias.tsx`, y los tests confirmados en 0.1.
- [x] 11.4 REFACTOR

## 12. Escenario: Las tarjetas de acceso del panel tienen un solo enlace (requiere 0.1)

- [x] 12.1 RED — `src/app/(privado)/panel/panel.test.tsx`: "Las tarjetas de acceso del panel tienen un solo enlace".
- [x] 12.2 GREEN — `src/components/ui/Tarjeta.tsx` (clicable, con elevación y contenedor de icono) y tarjetas en `ContenidoPanel.tsx`; retirar el `nav` provisional y "Por dónde empezar" y su test según 0.1. "El panel enlaza a cuentas y categorías" sigue en verde.
- [x] 12.3 REFACTOR

## 13. Escenario: El campo de monto muestra el prefijo dentro del control

- [x] 13.1 CARACTERIZACIÓN — Ejecutar `src/components/ui/Campo.test.tsx` en verde.
- [x] 13.2 RED — `src/components/ui/Campo.test.tsx`: "El campo de monto muestra el prefijo dentro del control".
- [x] 13.3 GREEN — `src/components/ui/Campo.tsx`: borde en el contenedor con `focus-within` (design.md D5).
- [x] 13.4 REFACTOR

## 14. Escenario: El campo de monto con error marca el control completo

- [x] 14.1 RED — `src/components/ui/Campo.test.tsx`: "El campo de monto con error marca el control completo".
- [x] 14.2 GREEN — `src/components/ui/Campo.tsx`.
- [x] 14.3 REFACTOR

## 15. Escenario: Los formularios desactivan la validación nativa del navegador

- [x] 15.1 CARACTERIZACIÓN — Ejecutar `FormularioLogin.test.tsx` y `FormularioRegistro.test.tsx` en verde.
- [x] 15.2 RED — `src/components/formularios/formularios.test.tsx`: "Los formularios desactivan la validación nativa del navegador".
- [x] 15.3 GREEN — `noValidate` en `FormularioCuenta.tsx`, `FormularioCategoria.tsx`, `FormularioRegistro.tsx` y `FormularioLogin.tsx`.
- [x] 15.4 REFACTOR

## 16. Escenario: Escribir en un formulario no muestra errores antes de enviarlo

- [x] 16.1 RED — `src/app/(privado)/cuentas/FormularioCuenta.test.tsx`: "Escribir en un formulario no muestra errores antes de enviarlo". Si pasa sin cambios (RED no observable), se detiene y propone cómo forzarlo.
- [x] 16.2 GREEN — `src/app/(privado)/cuentas/FormularioCuenta.tsx`, si hace falta: sin cambios, el formulario ya no valida mientras se escribe (RED forzado con una mutación temporal que mostraba un error por defecto).
- [x] 16.3 REFACTOR

## 17. Escenario: Un envío con errores lleva el foco al primer campo inválido

- [x] 17.1 RED — `src/app/(privado)/cuentas/FormularioCuenta.test.tsx`: "Un envío con errores lleva el foco al primer campo inválido".
- [x] 17.2 GREEN — `src/components/formularios/useFocoPrimerError.ts` y su uso en `FormularioCuenta.tsx`.
- [x] 17.3 REFACTOR

## 18. Escenario: Si solo falla un campo posterior, el foco va a ese campo

- [x] 18.1 RED — `src/app/(privado)/cuentas/FormularioCuenta.test.tsx`: "Si solo falla un campo posterior, el foco va a ese campo".
- [x] 18.2 GREEN — `src/components/formularios/useFocoPrimerError.ts`: sin cambios, el hook de 17.2 ya enfoca el primer inválido (RED forzado con una mutación temporal que enfocaba el primer input).
- [x] 18.3 REFACTOR

## 19. Escenario: Un error general sin errores de campo no mueve el foco

- [x] 19.1 RED — `src/app/(privado)/cuentas/FormularioCuenta.test.tsx`: "Un error general sin errores de campo no mueve el foco".
- [x] 19.2 GREEN — `src/components/formularios/useFocoPrimerError.ts`: sin cambios, el hook solo enfoca un campo con `aria-invalid` (RED forzado con una mutación temporal que enfocaba el primer input como respaldo).
- [x] 19.3 REFACTOR

## 20. Escenario: El formulario de categoría enfoca el nombre con error

- [x] 20.1 RED — `src/app/(privado)/categorias/FormularioCategoria.test.tsx`: "El formulario de categoría enfoca el nombre con error".
- [x] 20.2 GREEN — `useFocoPrimerError` en `FormularioCategoria.tsx`.
- [x] 20.3 REFACTOR

## 21. Escenario: El formulario de registro enfoca el primer campo con error

- [x] 21.1 RED — `src/app/registro/FormularioRegistro.test.tsx`: "El formulario de registro enfoca el primer campo con error".
- [x] 21.2 GREEN — `useFocoPrimerError` en `FormularioRegistro.tsx`.
- [x] 21.3 REFACTOR

## 22. Escenario: Pantalla de cuentas muestra la lista y el formulario en dos columnas

- [x] 22.1 CARACTERIZACIÓN — Ejecutar `cuentas.test.tsx` y `estados.test.tsx` de cuentas en verde.
- [x] 22.2 RED — `src/app/(privado)/cuentas/cuentas.test.tsx`: "Pantalla de cuentas muestra la lista y el formulario en dos columnas".
- [x] 22.3 GREEN — Rejilla con `--columnas-lista-formulario` y tarjeta "Nueva cuenta" en `ContenidoCuentas.tsx`, con `max-w-formulario` conservado. Animación de entrada en el contenedor de la página.
- [x] 22.4 REFACTOR

## 23. Escenario: Pantalla de cuentas sin cuentas muestra el estado vacío (requiere 0.1)

- [ ] 23.1 RED — Con la ampliación confirmada en 0.1, `cuentas.test.tsx`: "Pantalla de cuentas sin cuentas muestra el estado vacío" comprueba que el botón es secundario.
- [ ] 23.2 GREEN — `variante="secundario"` en el botón del estado vacío de `ContenidoCuentas.tsx`.
- [ ] 23.3 REFACTOR

## 24. Escenario: Pantalla de categorías muestra las listas y el formulario en dos columnas

- [ ] 24.1 CARACTERIZACIÓN — Ejecutar `categorias.test.tsx` y `estados.test.tsx` de categorías en verde.
- [ ] 24.2 RED — `src/app/(privado)/categorias/categorias.test.tsx`: "Pantalla de categorías muestra las listas y el formulario en dos columnas".
- [ ] 24.3 GREEN — `ContenidoCategorias.tsx`, con la tarjeta "Nueva categoría".
- [ ] 24.4 REFACTOR

## 25. Escenario: El inicio de sesión se muestra en una tarjeta con la marca

- [ ] 25.1 CARACTERIZACIÓN — `src/app/login/page.test.tsx`: "La página de inicio de sesión muestra su título y su formulario" (comportamiento actual).
- [ ] 25.2 RED — `src/app/login/page.test.tsx`: "El inicio de sesión se muestra en una tarjeta con la marca".
- [ ] 25.3 GREEN — `src/components/MarcaCuadre.tsx` y `src/app/login/page.tsx`.
- [ ] 25.4 REFACTOR

## 26. Escenario: El registro se muestra en una tarjeta con la marca

- [ ] 26.1 CARACTERIZACIÓN — `src/app/registro/page.test.tsx`: "La página de registro muestra su título y su formulario" (comportamiento actual).
- [ ] 26.2 RED — `src/app/registro/page.test.tsx`: "El registro se muestra en una tarjeta con la marca".
- [ ] 26.3 GREEN — `src/app/registro/page.tsx`.
- [ ] 26.4 REFACTOR

## 27. Skill y cierre

- [ ] 27.1 Actualizar `.agents/skills/ux-cuadre/SKILL.md` (cabecera, composición en dos columnas, elevación, iconos, animación de entrada y referencias a los .md) y avisar al humano para que la copie a `.claude/skills/`. Se verifica releyendo que ya no prohíbe lo relajado ni pide "← Volver".
- [ ] 27.2 Revisar cuentas, categorías, panel, login y registro a 360 px y a 1280 px con checklist.md, y anotar los hallazgos en progress.md.
- [ ] 27.3 Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run test:run` y `openspec validate rediseno-base --strict`, todo sin errores.
