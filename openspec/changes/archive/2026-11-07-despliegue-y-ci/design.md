# Design

## Contexto

Prisma 7 genera el cliente en `src/generated/` (ignorado por git) y no lo hace solo; la URL de la
CLI sale de `prisma.config.ts` (`env("DATABASE_URL")`, que falla si la variable falta) y la app
usa `@prisma/adapter-pg` con `env.DATABASE_URL`. Playwright ya arranca la app con
`npm run build && next start` contra `cuadre_e2e_test`. Los tests de integración crean y migran
`cuadre_test` solos. No existe `.github/`.

## Decisiones cerradas

- **Build**: `"build": "prisma generate && next build"`. Sin `postinstall`: con el cliente en el
  build basta, y así `npm ci` no depende de `DATABASE_URL`. `engines.node: "24.x"` (Vercel lo usa
  para elegir Node; npm local solo avisa con Node 26).
- **Capas del seed**: las escrituras en `src/server/repositories/semillaRepository.ts`
  (Prisma solo ahí); la orquestación y los datos fijos en `src/server/semilla/` (recibe la fecha
  de referencia para que los tests sean deterministas); el hash con `hashear()` de
  `src/server/auth/password.ts`; la entrada CLI en `scripts/db-seed.ts`, que solo comprueba el
  destino y llama a la orquestación.
- **Idempotencia**: en una transacción, `upsert` del revisor por email (restablece nombre,
  negocio y hash) y, filtrando por su `usuarioId`, borrar sus movimientos, cuentas y categorías y
  recrearlos. El estado final es siempre el mismo y nunca se tocan filas de otro usuario.
- **Neon**: `DATABASE_URL` en Vercel = URL *pooled* (`-pooler`, `sslmode=require`). Para
  `migrate deploy` y `db:seed` desde la máquina del humano se usa la URL *directa*, exportada solo
  en esa sesión de terminal (no en `.env`). No se añade `DIRECT_URL`: `prisma.config.ts` no
  cambia.
- **CI**: un job en `ubuntu-latest`, Node 24 con caché npm, servicio `postgres:16` con
  usuario/clave/base `cuadre`. `DATABASE_URL` a nivel de job (la necesita `prisma generate`);
  `AUTH_SECRET` ficticio. Disparadores: push y pull_request. `retries` se calcula con una función
  pura `reintentosE2E(env)` para poder testearla sin arrancar Playwright.
- **Tests de CI y build**: tests unitarios que leen `package.json` y `ci.yml` como texto (sin
  parser YAML nuevo) y comprueban pasos y orden.

## Decisiones abiertas (las cierra el humano en el grupo 0)

| | Alternativas | Recomendación |
|---|---|---|
| **(a) Migraciones en producción** | 1) A mano: `npx prisma migrate deploy` con la URL directa, antes del push que las necesita. 2) En el build de Vercel (`prisma migrate deploy && …`). | **1.** El build de Vercel corre también en previews y migraría producción; además exigiría la URL directa en Vercel. Con un solo humano y pocas migraciones, a mano es más seguro. |
| **(b) Datos del seed** | 1) Mínimo: 2 cuentas, 5 movimientos (4 del mes, 1 del anterior). 2) Amplio: ~3 meses y ~30 movimientos. | **1.** Llena todas las secciones del panel, los importes son verificables a mano y el test es legible. Montos y fechas en la spec. |
| **(c) Build en el E2E de CI** | 1) Mantener `webServer` con `npm run build && next start`: el E2E es también la prueba de build. 2) Paso `npm run build` aparte y `webServer` solo con `start`. | **1.** Un solo build, sin cambiar `playwright.config.ts` más allá de los reintentos. El fallo de build se ve en el log del webServer. |
| **(d) Proteger la base del seed** | 1) Confirmación `SEED_CONFIRMAR_BASE=<nombre>` igual a la base de la URL. 2) Lista de hosts permitidos. 3) Pregunta interactiva. | **1.** Funciona igual en local y contra Neon, es testeable como función pura y obliga a escribir el nombre de la base. |
| **(e) Ejecutar `db-seed.ts`** | 1) `tsx` como devDependency (no aprobada). 2) Node 24 con *type stripping*: no resuelve el alias `@/` ni los imports del cliente generado. 3) Seed en JavaScript sin reutilizar `hashear()`. | **1**, si el humano la aprueba: reutiliza repositorios y hash sin duplicar código. Si no, 3 duplicando el hash (riesgo de divergencia). |

## Decisiones tomadas por el humano (grupo 0)

- **(a)** Migraciones en producción: a mano con `migrate deploy` y la URL directa de Neon.
- **(b)** Seed mínimo: 2 cuentas y 5 movimientos de la spec.
- **(c)** El E2E de CI compila dentro del `webServer` de Playwright (sin paso de build aparte).
- **(d)** `SEED_CONFIRMAR_BASE` debe ser igual al nombre de la base de la URL.
- **(e)** `tsx` aprobado como devDependency con versión exacta (añadido a la lista de AGENTS.md).
- **Ajustes**: la fecha de referencia del seed sale de `hoyEnEcuador()`; `db:seed` carga `.env`
  con `--env-file-if-exists` (contra Neon la URL se exporta en la terminal); el proyecto
  `integracion` de Vitest sube `testTimeout` y `hookTimeout` a 15000; los movimientos son del mes
  en curso, así que el seed se vuelve a ejecutar el día de la entrega (documentado en
  `docs/despliegue.md` y readme 1.4); `ci.yml` ejecuta `npx playwright install --with-deps
  chromium` antes de `test:e2e`.

## Riesgos

- `next build` importa `src/config/env.ts`: si falta `AUTH_SECRET` o `DATABASE_URL` en Vercel
  el build falla (es lo deseado, pero hay que cargarlas antes del primer deploy).
- La contraseña del revisor es pública: cualquiera puede entrar como revisor y el siguiente seed
  borra lo que haya hecho. Aceptado para una demo.
- Postgres de CI necesita la extensión `citext`; la imagen oficial la trae.
- **Hallazgo del primer CI**: `tsc` fallaba en un clon limpio porque `LayoutProps` (en
  `src/app/layout.tsx`) es un tipo global que Next genera en `.next/types`. Solución:
  `typecheck` pasa a `next typegen && tsc --noEmit`. Dependen de `npm run typecheck` y quedan
  cubiertos `ci.yml`, `.husky/pre-commit` y `.husky/pre-merge-commit`. **No** quedan cubiertas las
  menciones a `npx tsc --noEmit` suelto en `AGENTS.md` (definición de terminado),
  `openspec/config.yaml` (guía de archivar) y `scripts/agents/antigravity-adapter.mjs` (lista de
  comandos permitidos): en un clon limpio fallarían igual; conviene cambiarlas a
  `npm run typecheck` en otro change (no se tocan aquí).
- E2E en CI tarda (build + 2 proyectos); los reintentos pueden ocultar inestabilidad: el informe
  marca los tests *flaky*.
