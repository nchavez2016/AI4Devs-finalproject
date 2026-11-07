# Proposal

## Why

La entrega final exige Cuadre desplegado, accesible por URL y con integración continua. Hoy no
se puede: `npm run build` falla desde un clon limpio (`src/generated/` está ignorado y nadie
ejecuta `prisma generate`), no existe `.github/`, el revisor tiene que registrarse a mano y ve
un panel vacío, y el readme marca despliegue y CI como pendientes.

## What Changes

- `build` genera el cliente Prisma antes de `next build`; `package.json` declara
  `engines.node` `24.x`. Sin `postinstall`.
- Nuevo script `db:seed`: crea o restablece al usuario revisor `revisor@cuadre.test`
  (negocio "Negocio de prueba", contraseña de prueba documentada `Revisor2026!`) con cuentas,
  sus categorías por defecto y movimientos del mes en curso y del anterior. Idempotente, solo
  toca datos del revisor, exige confirmar el nombre de la base y nunca corre en build ni en
  tests.
- Nuevo `.github/workflows/ci.yml`: Postgres 16 como servicio, `npm ci`, `prisma generate`,
  lint, `tsc`, `test:run` y `test:e2e` en Chromium, con el informe de Playwright como artefacto.
- Playwright reintenta 2 veces solo cuando `CI` está definido.
- Guía de despliegue en Vercel + Neon (`docs/despliegue.md`) y readme actualizado
  (0.4, 1.4, 1.5, 2.4).

## Capabilities

### New Capabilities
- `despliegue`: build reproducible desde un repositorio limpio, versión de Node declarada y
  workflow de CI con los pasos obligatorios.
- `datos-de-demostracion`: seed del usuario revisor, idempotente, aislado y protegido contra
  bases no previstas.

### Modified Capabilities
- `pruebas-e2e`: se añade el requirement de reintentos solo en CI. Los requirements existentes
  no cambian.

## Impact

- Archivos: `package.json`, `playwright.config.ts`, `.github/workflows/ci.yml` (nuevo), módulo
  y repositorio del seed en `src/server/`, script de entrada en `scripts/`, `docs/despliegue.md`,
  `readme.md`, `.env.example`.
- Sin cambios de schema ni migraciones nuevas.
- Dependencias: ninguna de la lista aprobada se añade. Ejecutar el seed en TypeScript puede
  requerir `tsx` (devDependency), que **no** está en la lista aprobada de AGENTS.md: se decide
  en la tarea 0.5 antes de instalar nada.
- Sistemas externos (solo tareas [HUMANO]): Neon, Vercel y GitHub Actions.

## Fuera de alcance

Dominio propio, monitorización, caché, entornos de preview con base propia y cualquier cambio de
funcionalidad de la app.
