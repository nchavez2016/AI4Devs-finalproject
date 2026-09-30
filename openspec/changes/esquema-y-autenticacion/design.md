# Design

## Context

Motivación: ver proposal.md. Hoy existen el schema y la migración `init`, pero no hay
cliente Prisma en la app, ni `src/config`, ni infraestructura de tests con base de datos.
`vitest.config.mts` corre todo en jsdom. No hay cambio de schema: `Usuario.passwordHash` y
`Categoria` ya cubren lo que se necesita.

## Goals / Non-Goals

**Goals:** capas limpias (página/acción → caso de uso en `src/server/` → repositorio) y tests
de integración reales contra PostgreSQL.
**Non-Goals:** endurecer el login (límite de intentos, bloqueo), sesiones en base de datos.

## Decisions

**a) Dependencias (verificado en node_modules y en el registro npm).**
| Paquete | ¿Aprobado? | Motivo |
|---|---|---|
| `next-auth@5.0.0-beta.32` (exacta) | Sí (Auth.js) | Es la v5, la versión de Auth.js; acepta `next ^16`. `latest` es 4.24.15 (NextAuth v4), descartada por estar orientada a `middleware.ts`. |
| `zod` | Sí | Hoy solo llega transitivamente (4.6.5, vía eslint); se declara directa. |
| `@prisma/adapter-pg@7.10.0` (exacta) | **No** | El `PrismaClient` de Prisma 7 exige `adapter` o `accelerateUrl` (`@prisma/client/runtime/client.d.ts`, tipos del constructor). Trae `pg` y `@types/pg` como dependencias propias: no se instalan aparte. |
Cada `npm install` es una tarea con parada previa para pedir autorización; las versiones
exactas se instalan con `--save-exact` (sin `^` en package.json).

**b) Hash: `scrypt` de `node:crypto`.** Formato guardado `scrypt$N$r$p$salBase64$hashBase64`,
sal aleatoria de 16 bytes, clave de 64 bytes y comparación con `timingSafeEqual`. Frente a
`bcrypt`/`bcryptjs`: sin dependencia, es memory-hard y OWASP lo admite; bcrypt, además,
trunca a 72 bytes. Guardar los parámetros permite subirlos más adelante sin migrar datos.

**c) Auth.js v5 con Credentials → sesión JWT.** Auth.js solo admite `strategy: "jwt"` con el
proveedor Credentials. **No está verificado localmente** (el paquete aún no está instalado),
así que una tarea lo comprueba en `node_modules/@auth/core` después de instalar. El JWT
guarda `id`, `nombre` y `nombreNegocio`, así que el panel no consulta la base de datos.
`authorize` delega en el caso de uso `verificarCredenciales` (Zod + repositorio + scrypt).
Next 16 ejecuta `proxy.ts` en Node.js (guía `authentication.md`) y solo hace una
comprobación optimista de la cookie. La autorización real está en el servidor: `auth()` en
la página privada. La redirección se decide en una función pura
(`src/server/auth/rutas.ts`) que se prueba de forma unitaria.

**d) Tests de datos: base de prueba separada `cuadre_test`** en el contenedor `cuadre-db`.
- A favor: prueba de verdad las restricciones (email único, transacción, FKs), como pide
  readme.md 2.6. En contra: requiere Docker levantado y es más lenta.
- Repositorios simulados: son rápidos, pero no detectan errores de SQL ni de atomicidad.
  Descartados para repositorios y casos de uso.
- URL: `TEST_DATABASE_URL` (en el entorno o en `.env`, documentada en `.env.example`), con
  valor por defecto la base local de `docker-compose.yml` en `cuadre_test`. La lee
  `vitest.config.mts` tras `process.loadEnvFile()`, igual que hace `prisma.config.ts`. En CI
  basta con definir la variable.
- Reproducible: un `globalSetup` crea la base si no existe (se conecta a la base `postgres`
  del mismo servidor con `PrismaPg`, sin dependencia nueva, porque no está verificado que
  `migrate deploy` la cree solo) y ejecuta `prisma migrate deploy` con `DATABASE_URL`
  apuntando a ella. Como `process.loadEnvFile` no sobrescribe variables ya definidas
  (comprobado con Node 26.3), no toca la base de desarrollo.
- Barrera: `exigirBaseDePrueba(url)` aborta si el nombre de la base no termina en `_test`.
  La usan el `globalSetup` y `limpiarBD` antes de conectar, y tiene su propio test.
- Los tests de integración (`*.int.test.ts`) van en un proyecto de Vitest aparte: entorno
  Node, archivos en serie y `limpiarBD` (`TRUNCATE ... CASCADE`) en `beforeEach`.
  `src/test/bd/` es infraestructura de tests: es la única excepción a "Prisma solo en
  repositories" y el código de la app nunca la importa.

**e) Montos.** Este módulo no maneja montos. Queda establecido para los siguientes: viajan
como texto desde el formulario hasta el servidor y se convierten a `Decimal` solo en el
servidor, tras validarlos con Zod.

**Categorías por defecto.** El flujo principal (HU-001) exige una categoría y el usuario nuevo
no tiene ninguna, así que se crean en el mismo `prisma.$transaction` que el usuario. La lista
es una constante en `src/server/` y puede editarse. Si falla, no queda un usuario sin
categorías.

**Configuración.** `src/config/env.ts` valida con Zod `DATABASE_URL` y `AUTH_SECRET`
(mínimo 32 caracteres) al importarse; es el único archivo que lee `process.env`. El error
nombra la variable, sin mostrar su valor. Como valida al importarse, cualquier test que
importe el módulo (directa o indirectamente) necesita esas dos variables ya definidas;
`vitest.config.mts` las fija con valores ficticios en `test.env` para que los tests
unitarios no dependan de un `.env` real. La tarea 1.14 reorganiza este `test.env` por
proyecto (`unidad` mantiene estos valores ficticios; `integracion` usa la URL real de
`TEST_DATABASE_URL`).

**Validación de registro** (esquema Zod en `src/server/auth/esquemas.ts`, con un mensaje en
español por campo):
- `nombre` y `nombreNegocio`: `trim` y al menos 1 carácter.
- `email`: `trim`, minúsculas y formato de email válido.
- `password`: al menos 8 caracteres, sin `trim`.

El email duplicado se detecta por el error de unicidad de Prisma (P2002) dentro del
repositorio.

**Tests de páginas.** La guía de Next (`02-guides/testing/vitest.md`) indica que Vitest no
soporta los componentes de servidor `async` y recomienda E2E; los síncronos sí admiten
tests unitarios.
- `src/app/page.tsx` es síncrona: el test invoca `Page()` con `redirect` simulado.
- El panel separa una función async corriente (`cargarPanel` en `src/server/panel.ts`) y un
  componente síncrono (`ContenidoPanel`). El test del escenario renderiza
  `<ContenidoPanel {...await cargarPanel()} />`.
- La página async, que solo une esas dos piezas, se verifica en la prueba manual del grupo 5.

**Rutas.** Son públicas `/login` y `/registro`; lo privado se agrupa en `src/app/(privado)/`.
`/` redirige a `/panel`. Las acciones de registro, login y logout son Server Actions.

## Risks / Trade-offs

- [v5 en beta] → versión exacta fijada; una tarea verifica la estrategia JWT tras instalar.
- [Tests de integración requieren Docker] → el `globalSetup` falla con un mensaje claro si no
  conecta.
- [Un JWT no se revoca en el servidor al cerrar sesión] → aceptable en el MVP: el logout
  borra la cookie.
- [Truncar o migrar la base equivocada] → barrera por el sufijo `_test` antes de conectar,
  con su propio test.
