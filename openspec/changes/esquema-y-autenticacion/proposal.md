# Proposal

## Why

El esquema de Prisma y la migración `init` ya existen, pero nadie puede entrar a la app:
no hay registro, ni inicio de sesión, ni protección de rutas. Toda historia del MVP
(HU-001 a HU-005) depende de conocer al usuario autenticado para filtrar por `usuarioId`.
Este change cierra TK-001 (readme.md, sección 6) y la capacidad transversal de
autenticación (sección 5).

## What Changes

- Registro con nombre, nombre del negocio, email y contraseña (guardada con hash scrypt).
- Categorías por defecto creadas en la misma transacción que el usuario.
- Inicio y cierre de sesión con Auth.js v5 (proveedor de credenciales, sesión JWT).
- `proxy.ts` que redirige a `/login` las rutas privadas sin sesión.
- `src/config/env.ts`: valida con Zod `DATABASE_URL` y `AUTH_SECRET` al arrancar.
- Primer cliente Prisma de la app (con driver adapter de PostgreSQL) y primer repositorio.
- Base de datos de prueba `cuadre_test` en el mismo contenedor, para tests de integración.
- Pantallas `/registro`, `/login` y una página privada mínima `/panel` con el nombre del negocio.
- `src/app/page.tsx` pasa a redirigir a `/panel`. **BREAKING** (solo interno): se elimina
  la página temporal `src/app/diseno/`.
- `.env.example` documenta `AUTH_SECRET` y `TEST_DATABASE_URL`.

## Capabilities

### New Capabilities
- `autenticacion`: registro, credenciales, sesión, protección de rutas privadas, cierre de
  sesión y categorías iniciales del usuario nuevo.

### Modified Capabilities
Ninguna. `openspec/specs/` está vacío, así que no se ve afectada ninguna spec existente.

## Impact

- Código nuevo: `src/config/`, `src/server/` (casos de uso, validación, cliente Prisma),
  `src/server/repositories/`, `src/auth.ts`, `proxy.ts`, rutas de `src/app/`.
- Tests: aparecen tests de integración con base de datos (proyecto de Vitest aparte, en Node).
- Dependencias nuevas (se instala cada una solo con autorización):
  - `next-auth@5.0.0-beta.32` (Auth.js): **aprobada**.
  - `zod`: **aprobada** (hoy solo llega de forma transitiva por eslint; pasa a ser directa).
  - `@prisma/adapter-pg@7.10.0`: **NO está en la lista aprobada**. Prisma 7 la exige
    (ver design.md). Arrastra `pg` y `@types/pg` como dependencias propias.
- El hash de contraseñas usa `node:crypto` (scrypt): no añade dependencias.

## Fuera de alcance

- Cuentas, transacciones, dashboard y gestión de categorías (otros changes).
- shadcn/ui, Playwright y E2E.
- Recuperación de contraseña, verificación de email, OAuth y límite de intentos.
- Cambios de schema: se usa el modelo `Usuario` tal como está.
