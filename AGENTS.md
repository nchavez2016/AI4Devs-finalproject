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

## Trabajo con OpenSpec
- No implementes nada sin un change aprobado en `openspec/changes/`.
- Una tarea a la vez. No adelantes funcionalidades ni agregues extras no pedidos.

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

## Fuera de alcance (NO construir)
Ahorros, presupuestos, préstamos/deudas, tarjetas de crédito, suscripciones, asistente de IA.

## Restricciones
- Nunca leer, modificar ni commitear `.env` o secretos. Documentar variables en `.env.example`.
- No editar migraciones ya aplicadas en `prisma/migrations/`.
- No instalar dependencias nuevas sin preguntar.
- No modificar tests para que pasen sin autorización.
- No hacer commit ni push sin orden explícita.
- Commits: solo en la rama dev (o en la rama del change, si existe), nunca en main. Uno por subtarea, formato Conventional Commits. Merge a main y push: solo el humano.
