# Design

## Context

El schema ya tiene `Cuenta` y `Categoria`. Este change solo cambia el tipo de su columna
`nombre` y añade índices únicos (decisión c). Se siguen los patrones de
`esquema-y-autenticacion`:

- Resultado discriminado `{ ok, errores }` (`registro.ts`).
- Server Action con `useActionState` (`acciones.ts`, `FormularioRegistro.tsx`).
- Carga de la página en el servidor + componente de presentación probado con props
  (`panel.ts`, `ContenidoPanel.tsx`).
- Base `cuadre_test` para los `*.int.test.ts`. La estrategia de tests de datos ya está
  decidida; no se reabre.

## Goals / Non-Goals

**Goals:** casos de uso que reciben el `usuarioId` como parámetro, para probarlos contra la
base sin simular la sesión; montos que nunca pasan por `number`; nombres únicos que la base
garantiza aunque lleguen envíos simultáneos; pantallas cuyos cuatro estados se pueden probar
con Testing Library.

**Non-Goals:** saldo calculado, igualar nombres que solo difieren en tildes, componente
genérico de "lista" o de "aviso" (se extraerá cuando haya un tercer uso).

## Decisions

**a) Capas.** Cada dominio tiene su carpeta, `src/server/cuentas/` y `src/server/categorias/`,
con estos archivos:

- `esquemas.ts`: Zod.
- `cuentas.ts` / `categorias.ts`: casos de uso `crear*`, `listar*` y `obtenerCuenta`, que
  reciben `usuarioId`.
- `acciones.ts`: `'use server'`.
- `pantalla.ts`: carga de la página.

Los repositorios `cuentaRepository` y `categoriaRepository` exigen `usuarioId` en todas sus
firmas. `obtenerCuenta` filtra con `findFirst({ where: { id, usuarioId } })`, así que una
cuenta ajena es indistinguible de una inexistente. `src/server/auth/sesion.ts` añade
`exigirUsuarioId()` (`auth()` + `redirect('/login')`). `cargarPanel` no se toca.

*Alternativa descartada:* leer la sesión dentro del caso de uso. Obligaría a simular `auth`
en los tests de integración.

**b) Montos.** El esquema Zod recibe texto, quita los espacios y acepta
`^-?\d{1,12}([.,]\d{1,2})?$`. Si recibe `""`, lo normaliza a `"0.00"`; si trae coma, la
cambia por punto. El repositorio construye el `Prisma.Decimal` a partir de ese texto. Hacia
fuera, el caso de uso devuelve `saldo: string` con `toFixed(2)`, por dos razones: `Decimal`
no se puede pasar a un Client Component, e `Importe` recibe texto. El campo se llama `saldo`
y no `saldoInicial`: registrar-transaccion cambiará solo cómo se calcula, no la forma de los
datos.

**c) Nombres únicos en la base (`citext`).** Decisión del humano (2026-10-05): la unicidad
debe resistir envíos simultáneos, así que la garantiza la base y no el código.

- `nombre` pasa a `String @db.Citext` en `Cuenta` y `Categoria`. `citext` guarda el texto
  tal cual y lo compara sin distinguir mayúsculas.
- Índices únicos:
  - `Cuenta`: `@@unique([usuarioId, nombre])`. Las cuentas salen todas juntas en el
    selector de registrar-transaccion, sea cual sea su tipo.
  - `Categoria`: `@@unique([usuarioId, tipo, nombre])`.
- Los `@@index([usuarioId])` existentes se mantienen. Quitarlos queda fuera del alcance.
- Dos migraciones, una por tabla, para que cada GREEN solo introduzca lo que exige su RED:
  - `nombre-unico-cuentas`: se crea con `--create-only` y se le añade a mano
    `CREATE EXTENSION IF NOT EXISTS citext;` al principio.
  - `nombre-unico-categorias`: la extensión ya existe.

  Después de cada una, `prisma generate`.

  `citext` es una extensión *trusted* (PostgreSQL 13 o posterior): la crea el dueño de la
  base sin ser superusuario, también en `cuadre_test` con `migrate deploy`. Las 7 categorías
  por defecto ya son distintas entre sí, así que la migración no choca con los datos.
- No hay comprobación previa en el caso de uso. El repositorio traduce el error P2002 a
  `NombreDuplicadoError`, igual que `EmailDuplicadoError` en `usuarioRepository`, y el caso
  de uso devuelve el error en el campo nombre: "Ya tienes una cuenta con ese nombre" o
  "Ya tienes una categoría de {ingreso|gasto} con ese nombre".
- Zod quita los espacios del inicio y del final y exige entre 1 y 150 caracteres. La base no
  tiene `CHECK` de longitud: toda escritura pasa por los casos de uso.

*Alternativas descartadas:*
- Comprobación en el caso de uso: dos envíos simultáneos pueden pasarla a la vez.
- Índice funcional `lower(nombre)` o *collation* ICU no determinista: Prisma no los
  representa en el schema, así que `migrate dev` los vería como deriva.
- Columna `nombre_normalizado`: guarda un dato derivado, contradice la nota de 3FN del
  readme y obliga a tocar el registro.

**d) Errores por campo.** `agruparErroresPorCampo`, hoy privada en `registro.ts`, se mueve a
`src/server/validacion.ts` en un REFACTOR, con los tests de registro en verde.

**e) Acciones.**
- Leen solo las claves esperadas del `FormData`. El `usuarioId` sale de `exigirUsuarioId()`,
  que se llama fuera del `try`, porque `redirect` lanza.
- Si el caso de uso lanza un error inesperado, devuelven `{ mensaje, valores }`.
- Si tienen éxito, llaman a `revalidatePath` y devuelven `{ exito, idCreado }`.

React 19 vacía el formulario después de cada acción. Por eso el formulario usa
`defaultValue` desde `estado.valores` y una `key` que cambia con cada respuesta, para que lo
escrito se conserve cuando hay error.

**f) Pantallas.** Cada pantalla tiene estos archivos:

- `page.tsx`: llama a `cargar*()` (`pantalla.ts`).
- `Contenido*.tsx`: componente cliente. Recibe la lista por props, tiene el `useActionState`
  y resalta con `animate-resaltado` la fila del `idCreado`. El estado de la acción vive en
  el cliente y la lista llega del servidor tras `revalidatePath`, así que solo un componente
  que tenga las dos cosas puede resaltar la fila nueva.
- `Formulario*.tsx`: presentación, recibe `estado`, `accion` y `pendiente`. Contiene la
  región `aria-live` y el aviso `role="alert"`.
- `loading.tsx`: el esqueleto.
- `error.tsx`: cliente, con `retry()` de Next 16.2.

Los componentes no importan nada de `@/generated/prisma`. Los tipos de cuenta llegan como
literales `'BANCO' | 'EFECTIVO' | 'DIGITAL'`, y sus etiquetas ("Banco", "Efectivo",
"Billetera digital") viven en el componente. El botón del estado vacío enfoca el campo nombre.

**g) Esqueleto con retardo.** `loading.tsx` aparece al instante, pero estados.md 9.2 pide no
mostrar nada antes de 400 ms. Se añaden a `globals.css` y a `tokens.md`:

- `--duracion-espera-esqueleto: 400ms`
- `--animate-esqueleto`: el fotograma `esqueleto` pasa de `opacity: 0` a `1` sin duración y
  con retardo `var(--duracion-espera-esqueleto)`. No hay pulso ni brillo.

**h) Orden.** Las cuentas se ordenan por `creadoEn` ascendente. Las categorías se ordenan por
nombre con `localeCompare('es')` en el caso de uso, porque la collation de Postgres depende
de la instalación.

**i) Navegación y guía.** `/cuentas` y `/categorias` muestran bajo el `h1` una frase concreta
que dice para qué sirve la pantalla (`text-cuerpo`, `muted-foreground`; tono de estados.md) y,
antes del `h1`, un `Link` terciario "← Volver al panel" a `/panel` (componentes.md). La flecha
lleva `aria-hidden` para que el nombre accesible sea "Volver al panel". No se extrae un
componente compartido: son dos usos, y la regla del change es extraer al tercero. No añade
requisitos a las specs: es navegación y texto de apoyo, sin comportamiento de dominio.

**j) Armazón de página.** Decisión del humano: se crea `src/components/EncabezadoPagina.tsx`
(título, frase de propósito, enlace opcional "← Volver al panel" y acción opcional), aunque
solo hay dos pantallas. Esto reemplaza la parte de design i que dejaba el enlace sin extraer.
- El orden se mantiene: enlace, `h1` y la frase como hermano siguiente del `h1`, para que los
  tests del grupo 4 sigan en verde sin cambios.
- `accion` es un `ReactNode` que pasa quien lo usa. Cuentas y categorías **no** la usan:
  componentes.md permite un solo botón primario por vista, y cada una ya tiene el de su
  formulario.
- Anchos: el contenido va en `max-w-contenido` centrado y cada formulario en
  `max-w-formulario` (tokens `--container-*` de tokens.md 3.3.4). `loading.tsx` y
  `error.tsx` no se tocan.
- Sin dependencias nuevas ni cambios en las specs: es presentación.

## Risks / Trade-offs

- [Prisma 7.10 no está comprobado con `@db.Citext` en este proyecto] → La primera tarea de
  la migración ejecuta `npx prisma validate`. Si lo rechaza, el agente se detiene y consulta.
- [`citext` distingue tildes: "Telefono" ≠ "Teléfono"] → Comportamiento aceptado.
- [Los RED de unicidad entre tipos y entre usuarios pasarán solos una vez exista el índice]
  → Se fuerzan por mutación en `cuadre_test`: con `psql` se sustituye temporalmente el
  índice por uno sin `tipo` o sin `usuario_id`, se ve fallar el test y se restaura.
- [El retardo del esqueleto no se puede comprobar en jsdom] → El test comprueba la estructura
  y `aria-busy`. El retardo se verifica en la prueba manual del grupo 4.
- [Un saldo negativo tecleado por error] → `Importe` lo muestra en rojo y con "−". La
  corrección llegará con editar cuenta.
- [Un nombre de 150 caracteres no cabe en una fila] → La fila lo trunca a una línea
  (componentes.md).
