<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Cuadre — reglas para agentes

App web de control de gastos e ingresos (proyecto final AI4Devs). Solo se construye el MVP
descrito en `readme.md`. Entorno de desarrollo: Windows.

## Comandos
- `docker compose up -d` — levanta PostgreSQL local (contenedor `cuadre-db`, puerto 5432).
- `npm run dev` — app en http://localhost:3000
- `npm run build` / `npm run lint`
- `npx prisma migrate dev --name <nombre>` — nueva migración.
- `npx prisma generate` — ejecutar SIEMPRE después de migrar o cambiar el schema
  (Prisma 7 no lo hace solo).
- Tests: pendiente de configurar (Vitest + Playwright).

## Ciclo de trabajo (OpenSpec)
- No implementes nada sin un change aprobado en `openspec/changes/`.
- Ciclo: proponer → revisión humana de tasks.md → aplicar → verificar → archivar.
  En Claude Code los comandos son `/opsx:*`; en Antigravity, `/opsx-*`.
- Una subtarea a la vez. No adelantes funcionalidades ni agregues extras no pedidos.

## TDD
- Ningún código de producción sin un test que haya fallado antes por la razón esperada.
- Cada escenario GIVEN/WHEN/THEN de una spec tiene un test con su nombre exacto.
- Código existente sin tests: primero tests de caracterización, después cambios.

## Definición de terminado
- `npm run lint` y `npx tsc --noEmit` sin errores.
- Tests en verde (cuando exista la infraestructura de tests).
- `openspec validate --strict` sin errores.

## Convenciones (sí / no)
- SÍ: Prisma solo dentro de `src/server/repositories/`. NO: importar Prisma en componentes,
  páginas o route handlers.
- SÍ: toda consulta filtra por el `usuarioId` del usuario autenticado. Nunca devolver datos de
  otro usuario.
- SÍ: validar toda entrada en el servidor con Zod.
- SÍ: dinero como `Decimal`. NO: usar `float`/`number` para montos.
- SÍ: el saldo de una cuenta se calcula (saldo inicial + ingresos − gastos). NO: guardarlo.
- SÍ: nombres del dominio en español (Usuario, Cuenta, Categoria, Transaccion); camelCase en
  TypeScript y snake_case en la BD con `@map`.

## Gotchas del stack
- Prisma fijado en 7.10.0 exacta. NO actualizar a Prisma 8.
- El cliente Prisma se genera en `src/generated/prisma` (importar desde ahí, no desde
  `@prisma/client`).
- La URL de la BD está en `prisma.config.ts`, no en `schema.prisma`. El `.env` se carga con
  `process.loadEnvFile()` (no usar dotenv).
- Next.js 16: las APIs de request (`cookies()`, `headers()`, `params`) son asíncronas y
  `middleware.ts` ahora se llama `proxy.ts`.
- Windows no distingue mayúsculas en nombres de archivo: NO crear `README.md` (ya existe `readme.md`).

## Dependencias
- Aprobadas para el MVP: Zod, Auth.js, shadcn/ui, Recharts, Vitest, Testing Library, jsdom,
  Playwright.
- Cada una se instala dentro del change que la necesita y se justifica en su `design.md`.
- Cualquier otra dependencia: preguntar antes.
- NO ejecutar `npm audit fix --force`: bajaría Prisma a la versión 6.

## Commits y ramas
- Se trabaja en la rama de la entrega actual (`feature/entrega-N-NCH`). Nunca en `main`
  (lo bloquea el hook de pre-commit).
- Durante la aplicación de un change: un commit por subtarea, formato Conventional Commits.
  Fuera de eso: solo con orden explícita.
- Nunca push, merge ni cambio de rama: los hace el humano.

## Fuera de alcance (NO construir)
Ahorros, presupuestos, préstamos/deudas, tarjetas de crédito, suscripciones, asistente de IA.

## Restricciones
- Nunca leer, modificar ni commitear `.env` o secretos. Documentar variables en `.env.example`.
- No editar migraciones ya aplicadas en `prisma/migrations/`.
- No modificar tests para que pasen sin autorización.
- No encadenar comandos con `;` o `&&`: un comando por ejecución.
- No leer carpetas completas cuando basta un archivo concreto.