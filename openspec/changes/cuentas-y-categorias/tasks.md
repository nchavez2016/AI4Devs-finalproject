# Tasks

Leyenda: **[HUMANO]** = lo hace la persona; el agente se detiene antes.
Los `*.int.test.ts` corren contra `cuadre_test`. Los tests de acciones y pantallas son
unitarios (jsdom) y simulan `@/auth`, `next/navigation`, `next/cache` y el caso de uso.
"Si pasa sin cambios": detenerse y proponer cómo forzar el RED (config.yaml).
"Mutación del índice": con `docker exec cuadre-db psql -U cuadre -d cuadre_test`, sustituir
temporalmente el índice único por la variante indicada, ver fallar el test y restaurar el
índice original (design.md, riesgos). Sin commit.

## 1. Cuentas: repositorio, caso de uso y acción

- [x] 1.1 RED — `src/server/cuentas/cuentas.int.test.ts`, test "Crear una cuenta con saldo inicial 500.00". Debe fallar porque `crearCuenta` no existe.
- [x] 1.2 GREEN — `src/server/cuentas/esquemas.ts` (Zod: nombre, tipo, saldo inicial en texto), `src/server/repositories/cuentaRepository.ts` (`crear`, `listar` por `usuarioId`, construye el `Prisma.Decimal`) y `src/server/cuentas/cuentas.ts` (`crearCuenta(usuarioId, datos)`, `listarCuentas(usuarioId)` → `saldo: string`, design b). Test en verde.
- [x] 1.3 REFACTOR — test en verde.
- [x] 1.4 RED — mismo archivo, test "Crear una cuenta sin saldo inicial la deja en 0.00".
- [x] 1.5 GREEN — `esquemas.ts`: `""` → `"0.00"`. Test en verde.
- [x] 1.6 REFACTOR — test en verde.
- [x] 1.7 RED — mismo archivo, test "Crear una cuenta con saldo inicial negativo". Si pasa sin cambios, forzar el RED.
- [x] 1.8 GREEN — `esquemas.ts`: signo opcional. Test en verde.
- [x] 1.9 REFACTOR — test en verde.
- [x] 1.10 RED — mismo archivo, test "Saldo inicial con coma decimal se acepta".
- [x] 1.11 GREEN — `esquemas.ts`: quitar espacios y cambiar coma por punto. Test en verde.
- [x] 1.12 REFACTOR — test en verde.
- [x] 1.13 RED — mismo archivo, test "Crear cuenta rechazada por nombre vacío".
- [x] 1.14 GREEN — `esquemas.ts`: el nombre se recorta y exige al menos 1 carácter; `cuentas.ts` devuelve `{ ok: false, errores }` agrupados por campo. Test en verde.
- [x] 1.15 REFACTOR — mover `agruparErroresPorCampo` de `registro.ts` a `src/server/validacion.ts` y usarla en los dos casos de uso (design d). Verde este test y también `src/server/auth/registro.int.test.ts`.
- [x] 1.16 RED — mismo archivo, test "Longitud máxima del nombre de cuenta es 150 caracteres".
- [x] 1.17 GREEN — `esquemas.ts`: máximo 150 caracteres después de recortar, con el mensaje "El nombre puede tener como máximo 150 caracteres". Test en verde.
- [x] 1.18 REFACTOR — test en verde.
- [x] 1.19 RED — mismo archivo, test "Crear cuenta rechazada por saldo inicial inválido" (`"abc"`, `"10.555"`, `"1.000,00"`, `"1000000000000.00"`).
- [x] 1.20 GREEN — `esquemas.ts`: regex de design b y mensaje "Escribe un saldo con hasta 2 decimales, por ejemplo 500.00". Test en verde. Verificar por mutación cada parte de la regex que el test no haya exigido.
- [x] 1.21 REFACTOR — test en verde.
- [x] 1.22 RED — mismo archivo, test "Crear cuenta rechazada por tipo inválido".
- [x] 1.23 GREEN — `esquemas.ts`: `z.enum(['BANCO','EFECTIVO','DIGITAL'])` con el mensaje "Elige un tipo de cuenta". Test en verde.
- [x] 1.24 REFACTOR — test en verde.
- [x] 1.25 RED — mismo archivo, test "Crear cuenta rechazada por nombre duplicado". Debe fallar porque se crea una segunda cuenta.
- [x] 1.26 GREEN — design c, en este orden:
  - (1) En `prisma/schema.prisma`, `Cuenta.nombre` pasa a `@db.Citext` y se añade `@@unique([usuarioId, nombre])`. Ejecutar `npx prisma validate`; si lo rechaza, detenerse y consultar.
  - (2) `npx prisma migrate dev --name nombre-unico-cuentas --create-only`.
  - (3) Añadir `CREATE EXTENSION IF NOT EXISTS citext;` al principio del SQL generado.
  - (4) `npx prisma migrate dev`.
  - (5) `npx prisma generate`.
  - (6) `cuentaRepository.crear` traduce P2002 a `NombreDuplicadoError`.
  - (7) `crearCuenta` devuelve "Ya tienes una cuenta con ese nombre" en `nombre`.

  Test en verde, y `docker exec cuadre-db psql -U cuadre -d cuadre_test -c "\d cuentas"` muestra `nombre` como `citext` y el índice único.
- [x] 1.27 REFACTOR — test en verde.
- [x] 1.28 RED — mismo archivo, test "Cuentas duplicadas rechazadas aunque se envíen a la vez" (`Promise.all` de las dos creaciones). Pasará gracias al índice: forzar el RED con la mutación del índice (borrarlo).
- [x] 1.29 GREEN — sin cambios si el índice de 1.26 ya lo cumple. Test en verde.
- [x] 1.30 REFACTOR — test en verde.
- [x] 1.31 RED — mismo archivo, test "Consultar una cuenta propia por su identificador". Debe fallar porque `obtenerCuenta` no existe.
- [x] 1.32 GREEN — `cuentaRepository.buscarPorId(usuarioId, id)` con `findFirst({ where: { id, usuarioId } })`, y `obtenerCuenta(usuarioId, id)` en `cuentas.ts`. Test en verde.
- [x] 1.33 REFACTOR — test en verde.
- [x] 1.34 RED — mismo archivo, test "Un usuario no ve las cuentas de otro en su lista". Si pasa sin cambios, forzar el RED quitando `usuarioId` del filtro de `listar`, y restaurar.
- [x] 1.35 GREEN — corregir el filtro si hace falta. Test en verde.
- [x] 1.36 REFACTOR — test en verde.
- [x] 1.37 RED — mismo archivo, test "Una cuenta de otro usuario se trata como inexistente". Si pasa sin cambios, forzar el RED quitando `usuarioId` de `buscarPorId`, y restaurar.
- [x] 1.38 GREEN — un único resultado de "no encontrada" para la cuenta ajena y la inexistente. Test en verde.
- [x] 1.39 REFACTOR — test en verde.
- [x] 1.40 RED — mismo archivo, test "El nombre de una cuenta de otro usuario no cuenta como duplicado". Pasará gracias al índice: forzar el RED con la mutación del índice (variante sin `usuario_id`).
- [x] 1.41 GREEN — sin cambios si el índice ya lo cumple. Test en verde.
- [x] 1.42 REFACTOR — test en verde.
- [x] 1.43 RED — `src/server/cuentas/acciones.test.ts`, test "La cuenta se crea siempre para el usuario de la sesión": con la sesión de A y un `usuarioId` de B en el `FormData`, `crearCuenta` se llama con el id de A. Debe fallar porque `acciones.ts` no existe.
- [x] 1.44 GREEN — `src/server/auth/sesion.ts` (`exigirUsuarioId`) y `src/server/cuentas/acciones.ts` (`'use server'`, `crearCuentaAccion`, que lee solo `nombre`, `tipo` y `saldoInicial`). Test en verde.
- [x] 1.45 REFACTOR — test en verde.
- [x] 1.46 RED — mismo archivo, test "Crear una cuenta sin sesión redirige al login": si `auth` devuelve `null`, se llama a `redirect('/login')` y no se llama a `crearCuenta`. Si pasa sin cambios, forzar el RED.
- [x] 1.47 GREEN — `exigirUsuarioId` fuera del `try` (design e). Test en verde.
- [x] 1.48 REFACTOR — test en verde; suite completa (cierre de grupo).

## 2. Categorías: repositorio, caso de uso y acción

- [x] 2.1 RED — `src/server/categorias/categorias.int.test.ts`, test "Usuario nuevo ve sus 7 categorías por defecto separadas por tipo" (el usuario se crea con `registrarUsuario`). Debe fallar porque `listarCategorias` no existe.
- [x] 2.2 GREEN — `src/server/repositories/categoriaRepository.ts` (`listar` de primer nivel por `usuarioId`) y `src/server/categorias/categorias.ts` (`listarCategorias` → `{ ingreso, gasto }` ordenadas con `localeCompare('es')`). Test en verde.
- [x] 2.3 REFACTOR — test en verde.
- [x] 2.4 RED — mismo archivo, test "Crear una categoría de gasto" (con "  Publicidad  "). Debe fallar porque `crearCategoria` no existe.
- [x] 2.5 GREEN — `src/server/categorias/esquemas.ts` (el nombre se recorta), `categoriaRepository.crear` y `crearCategoria(usuarioId, datos)`. Test en verde.
- [x] 2.6 REFACTOR — test en verde.
- [x] 2.7 RED — mismo archivo, test "Crear una categoría de ingreso". Si pasa sin cambios, forzar el RED.
- [x] 2.8 GREEN — ajustar si hace falta. Test en verde.
- [x] 2.9 REFACTOR — test en verde.
- [x] 2.10 RED — mismo archivo, test "Crear categoría rechazada por nombre vacío".
- [x] 2.11 GREEN — `esquemas.ts`: mínimo 1 carácter; errores con `agruparErroresPorCampo`. Test en verde.
- [x] 2.12 REFACTOR — test en verde.
- [x] 2.13 RED — mismo archivo, test "Longitud máxima del nombre de categoría es 150 caracteres".
- [x] 2.14 GREEN — `esquemas.ts`: máximo 150 caracteres con el mismo mensaje que cuentas. Test en verde.
- [x] 2.15 REFACTOR — test en verde; si el esquema del nombre es idéntico en los dos dominios, extraerlo a `src/server/validacion.ts`.
- [x] 2.16 RED — mismo archivo, test "Crear categoría rechazada por nombre duplicado en el mismo tipo". Debe fallar porque se crea la categoría duplicada.
- [x] 2.17 GREEN — design c, en este orden:
  - (1) En `prisma/schema.prisma`, `Categoria.nombre` pasa a `@db.Citext` y se añade `@@unique([usuarioId, tipo, nombre])`. Ejecutar `npx prisma validate`.
  - (2) `npx prisma migrate dev --name nombre-unico-categorias` (la extensión ya existe).
  - (3) `npx prisma generate`.
  - (4) `categoriaRepository.crear` traduce P2002 a `NombreDuplicadoError`.
  - (5) `crearCategoria` devuelve "Ya tienes una categoría de {ingreso|gasto} con ese nombre".

  Test en verde, y también `src/server/auth/registro.int.test.ts`, porque las categorías por defecto se insertan en la tabla modificada.
- [x] 2.18 REFACTOR — test en verde.
- [x] 2.19 RED — mismo archivo, test "Categorías duplicadas rechazadas aunque se envíen a la vez". Pasará gracias al índice: forzar el RED con la mutación del índice (borrarlo).
- [x] 2.20 GREEN — sin cambios si el índice ya lo cumple. Test en verde.
- [x] 2.21 REFACTOR — test en verde.
- [x] 2.22 RED — mismo archivo, test "Mismo nombre permitido en el otro tipo". Pasará gracias al índice: forzar el RED con la mutación del índice (variante sin `tipo`).
- [x] 2.23 GREEN — sin cambios si el índice ya lo cumple. Test en verde.
- [x] 2.24 REFACTOR — test en verde.
- [x] 2.25 RED — mismo archivo, test "Crear categoría rechazada por tipo inválido".
- [x] 2.26 GREEN — `z.enum(['INGRESO','GASTO'])` con el mensaje "Elige si es de ingreso o de gasto". Test en verde.
- [x] 2.27 REFACTOR — test en verde.
- [x] 2.28 RED — mismo archivo, test "Un usuario no ve las categorías de otro". Si pasa sin cambios, forzar el RED quitando `usuarioId` del filtro, y restaurar.
- [x] 2.29 GREEN — corregir si hace falta. Test en verde.
- [x] 2.30 REFACTOR — test en verde.
- [x] 2.31 RED — mismo archivo, test "El nombre de una categoría de otro usuario no cuenta como duplicado". Pasará gracias al índice: forzar el RED con la mutación del índice (variante sin `usuario_id`).
- [x] 2.32 GREEN — sin cambios si el índice ya lo cumple. Test en verde.
- [x] 2.33 REFACTOR — test en verde.
- [x] 2.34 RED — `src/server/categorias/acciones.test.ts`, test "La categoría se crea siempre para el usuario de la sesión". Debe fallar porque `acciones.ts` no existe.
- [x] 2.35 GREEN — `src/server/categorias/acciones.ts` (`crearCategoriaAccion`, que lee solo `nombre` y `tipo` y usa `exigirUsuarioId`). Test en verde.
- [x] 2.36 REFACTOR — test en verde.
- [x] 2.37 RED — mismo archivo, test "Crear una categoría sin sesión redirige al login". Si pasa sin cambios, forzar el RED.
- [x] 2.38 GREEN — ajustar si hace falta. Test en verde.
- [x] 2.39 REFACTOR — test en verde.
- [x] 2.40 Actualizar `readme.md`, sección 3.2: en CUENTA y CATEGORIA, `nombre` es `citext`, único por usuario (y por tipo en categorías) sin distinguir mayúsculas, sin espacios al inicio ni al final y con 150 caracteres como máximo. Verificar leyendo la sección. Suite completa (cierre de grupo).

## 3. Pantallas

- [x] 3.1 Añadir `--duracion-espera-esqueleto` y `--animate-esqueleto` (fotograma `esqueleto`) a `src/app/globals.css` y documentarlos en `docs/diseno/sistema/tokens.md` (design g). Verificar con `npm run build`, y que `tokens.md` los lista.
- [x] 3.2 RED — `src/app/(privado)/cuentas/cuentas.test.tsx`, test "Pantalla de cuentas muestra cada cuenta con su tipo y saldo": simula `@/auth` y `@/server/cuentas/cuentas`, llama a `cargarCuentas()` y pinta `ContenidoCuentas` (patrón de `panel.test.tsx`). Debe fallar porque no existen.
- [x] 3.3 GREEN — `src/server/cuentas/pantalla.ts` (`cargarCuentas`), `src/app/(privado)/cuentas/page.tsx`, `ContenidoCuentas.tsx` (cliente, design f) y `FormularioCuenta.tsx`, usando `Importe`, `Campo` y `Button`. Test en verde.
- [x] 3.4 REFACTOR — test en verde; solo tokens.
- [x] 3.5 RED — mismo archivo, test "Pantalla de cuentas sin cuentas muestra el estado vacío" (el botón enfoca el campo nombre).
- [x] 3.6 GREEN — estado vacío en `ContenidoCuentas.tsx`. Test en verde.
- [x] 3.7 REFACTOR — test en verde.
- [x] 3.8 RED — mismo archivo, test "Formulario de cuenta muestra el error junto a cada campo", y en `src/server/cuentas/acciones.test.ts` el test de apoyo "crearCuentaAccion devuelve los errores por campo del caso de uso".
- [x] 3.9 GREEN — `acciones.ts` devuelve `errores`, y `FormularioCuenta.tsx` los pasa a `Campo`. Tests en verde.
- [x] 3.10 REFACTOR — tests en verde.
- [x] 3.11 RED — mismo archivo, test "Error al guardar la cuenta conserva los datos escritos", y en `acciones.test.ts` el test de apoyo "crearCuentaAccion convierte un error inesperado en el aviso y conserva los valores".
- [x] 3.12 GREEN — `catch` en `acciones.ts` → `{ mensaje, valores }`; en `FormularioCuenta.tsx`, el aviso `role="alert"` (`negativo-fondo`, `destructive`) y `defaultValue` + `key` (design e). Tests en verde.
- [x] 3.13 REFACTOR — tests en verde.
- [x] 3.14 RED — mismo archivo, test "Cuenta creada se anuncia y se resalta en la lista", y en `acciones.test.ts` el test de apoyo "crearCuentaAccion revalida /cuentas y devuelve el id creado".
- [x] 3.15 GREEN — `revalidatePath('/cuentas')` + `{ exito, idCreado }`, la región `aria-live` y `animate-resaltado` en la fila. Tests en verde.
- [x] 3.16 REFACTOR — tests en verde.
- [x] 3.17 RED — `src/app/(privado)/cuentas/estados.test.tsx`, test "Pantalla de cuentas en carga muestra un esqueleto ocupado".
- [x] 3.18 GREEN — `src/app/(privado)/cuentas/loading.tsx` (filas `alto-fila` en `muted`, `aria-busy`, `animate-esqueleto`). Test en verde.
- [x] 3.19 REFACTOR — test en verde.
- [x] 3.20 RED — mismo archivo, test "Error al cargar las cuentas ofrece reintentar" (pulsar "Reintentar" llama a `retry`).
- [x] 3.21 GREEN — `src/app/(privado)/cuentas/error.tsx`. Test en verde.
- [x] 3.22 REFACTOR — test en verde.
- [x] 3.23 CARACTERIZACIÓN — ejecutar `src/app/(privado)/panel/panel.test.tsx` y confirmar que está en verde antes de tocar `ContenidoPanel.tsx`.
- [x] 3.24 RED — `src/app/(privado)/panel/panel.test.tsx`, test "El panel enlaza a cuentas y categorías".
- [x] 3.25 GREEN — dos `Link` en `ContenidoPanel.tsx`. Tests del panel en verde.
- [x] 3.26 REFACTOR — tests en verde.
- [x] 3.27 RED — `src/app/(privado)/categorias/categorias.test.tsx`, test "Pantalla de categorías muestra las de ingreso y las de gasto por separado" (patrón de 3.2). Debe fallar porque no existen.
- [x] 3.28 GREEN — `src/server/categorias/pantalla.ts` (`cargarCategorias`), `page.tsx`, `ContenidoCategorias.tsx` y `FormularioCategoria.tsx`. Test en verde.
- [x] 3.29 REFACTOR — test en verde; extraer piezas comunes con cuentas solo si se repiten de forma literal.
- [x] 3.30 RED — mismo archivo, test "Formulario de categoría muestra el error junto al nombre", y en `src/server/categorias/acciones.test.ts` el test de apoyo "crearCategoriaAccion devuelve los errores por campo del caso de uso".
- [x] 3.31 GREEN — errores por campo en la acción y en el formulario. Tests en verde.
- [x] 3.32 REFACTOR — tests en verde.
- [x] 3.33 RED — mismo archivo, test "Error al guardar la categoría conserva los datos escritos", y en `acciones.test.ts` el test de apoyo "crearCategoriaAccion convierte un error inesperado en el aviso y conserva los valores".
- [x] 3.34 GREEN — `catch` → `{ mensaje, valores }`, el aviso y conservar el nombre y el tipo. Tests en verde.
- [x] 3.35 REFACTOR — tests en verde.
- [x] 3.36 RED — mismo archivo, test "Categoría creada se anuncia y se resalta en la lista", y en `acciones.test.ts` el test de apoyo "crearCategoriaAccion revalida /categorias y devuelve el id creado".
- [x] 3.37 GREEN — `revalidatePath('/categorias')`, `aria-live` y resaltado. Tests en verde.
- [x] 3.38 REFACTOR — tests en verde.
- [x] 3.39 RED — `src/app/(privado)/categorias/estados.test.tsx`, test "Pantalla de categorías en carga muestra un esqueleto ocupado".
- [x] 3.40 GREEN — `src/app/(privado)/categorias/loading.tsx`. Test en verde.
- [x] 3.41 REFACTOR — test en verde.
- [x] 3.42 RED — mismo archivo, test "Error al cargar las categorías ofrece reintentar".
- [x] 3.43 GREEN — `src/app/(privado)/categorias/error.tsx`. Test en verde.
- [x] 3.44 REFACTOR — test en verde; suite completa (cierre de grupo).

## 4. Navegación y guía

- [x] 4.1 RED — `src/app/(privado)/cuentas/cuentas.test.tsx`, test "Pantalla de cuentas explica para qué sirve": bajo el `h1` aparece "Aquí registras dónde tienes tu dinero: bancos, efectivo y billeteras digitales.", también sin cuentas. Debe fallar porque el texto no existe.
- [x] 4.2 GREEN — `ContenidoCuentas.tsx`: `p` justo después del `h1` (`text-cuerpo`, `text-muted-foreground`). Test en verde.
- [x] 4.3 REFACTOR — test en verde; solo tokens.
- [x] 4.4 RED — mismo archivo, test "Pantalla de cuentas enlaza de vuelta al panel": hay un enlace de nombre accesible "Volver al panel" con `href="/panel"`, y al enfocarlo queda como `document.activeElement`. Debe fallar porque el enlace no existe.
- [x] 4.5 GREEN — `ContenidoCuentas.tsx`: `Link` de `next/link` antes del `h1`, con estilo terciario (`text-primary`, `hover:bg-muted`, `text-cuerpo`, `font-control`, `rounded-control`) y la flecha "←" con `aria-hidden`. Test en verde.
- [x] 4.6 REFACTOR — test en verde; solo tokens.
- [ ] 4.7 RED — `src/app/(privado)/categorias/categorias.test.tsx`, test "Pantalla de categorías explica para qué sirve": bajo el `h1` aparece "Aquí defines cómo clasificas tus ingresos y tus gastos.". Debe fallar porque el texto no existe.
- [ ] 4.8 GREEN — `ContenidoCategorias.tsx`: el mismo `p` que en 4.2. Test en verde.
- [ ] 4.9 REFACTOR — test en verde.
- [ ] 4.10 RED — mismo archivo, test "Pantalla de categorías enlaza de vuelta al panel" (mismas comprobaciones que 4.4).
- [ ] 4.11 GREEN — `ContenidoCategorias.tsx`: el mismo enlace que en 4.5. Test en verde.
- [ ] 4.12 REFACTOR — tests en verde; no se extrae un componente para el enlace (dos usos, design i); suite completa (cierre de grupo).

## 5. Prueba manual y verificación final

- [ ] 5.1 [HUMANO] Con `docker compose up -d` y `npm run dev`:
  - (a) Registrar a A y entrar a Cuentas desde el panel: ver el estado vacío y que "Crear cuenta" enfoca el nombre.
  - (b) Crear "  Banco Pichincha  " con 500.00: se guarda sin los espacios, se anuncia, se resalta y muestra $500,00.
  - (c) Intentar crear "banco PICHINCHA": error "Ya tienes una cuenta con ese nombre".
  - (d) Crear una cuenta con "-120.00" (sale en rojo con "−"), una con "1250,75" y una con el saldo vacío ($0,00).
  - (e) Probar el nombre vacío, un nombre de 151 caracteres y el saldo "10.555": errores junto a cada campo.
  - (f) Con la red limitada (DevTools, "Slow 4G"), ver el esqueleto solo a partir de unos 400 ms.
  - (g) Detener `cuadre-db` y recargar: ver "No se pudieron cargar tus cuentas." y que "Reintentar" funciona al volver a levantarla.
  - (h) Detener `cuadre-db` y enviar el formulario: ver el aviso y que los datos se conservan.
  - (i) En Categorías: ver las 7 por defecto, crear "Publicidad" (gasto), intentar "PUBLICIDAD" (gasto) y " ventas " (ingreso), y crear "Otros" (ingreso).
  - (j) Registrar a B: no ve nada de A y puede crear su propia cuenta "Banco Pichincha" y su categoría "Publicidad".
  - (k) En Cuentas y en Categorías: leer la frase bajo el título, y llegar con Tab a "← Volver al panel" y activarlo con Enter.
- [ ] 5.2 Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run test:run` y `openspec validate cuentas-y-categorias --strict`; todo sin errores.
