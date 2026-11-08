# despliegue Specification

## Purpose

Garantiza que Cuadre se construye desde un repositorio limpio con la versión de Node prevista y
que cada cambio subido pasa automáticamente lint, tipos, tests unitarios, de integración y E2E.

## Requirements

### Requirement: Build reproducible desde un repositorio limpio
El script `build` SHALL generar el cliente Prisma antes de compilar la app, de modo que funcione
en un clon sin `src/generated/`. El proyecto SHALL declarar la versión de Node `24.x` como motor
requerido.

#### Scenario: El build genera el cliente Prisma antes de compilar
- **GIVEN** el `package.json` del proyecto
- **WHEN** se lee el script "build"
- **THEN** ejecuta "prisma generate" y después "next build"

#### Scenario: El typecheck genera los tipos de rutas antes de tsc
- **GIVEN** el `package.json` del proyecto y un clon sin la carpeta `.next/`
- **WHEN** se lee el script "typecheck"
- **THEN** ejecuta "next typegen" y después "tsc --noEmit"

#### Scenario: El proyecto declara Node 24
- **GIVEN** el `package.json` del proyecto
- **WHEN** se lee el campo "engines"
- **THEN** "node" es "24.x"

### Requirement: Integración continua en GitHub Actions
El repositorio SHALL tener un workflow de GitHub Actions que, en cada push y pull request, use
Node 24 y un servicio PostgreSQL 16, y ejecute en este orden: `npm ci`, `prisma generate`, lint,
comprobación de tipos, `test:run`, instalación de Chromium de Playwright con sus dependencias y
`test:e2e`. El informe HTML de Playwright SHALL subirse como artefacto aunque los tests fallen.

#### Scenario: El workflow de CI ejecuta los pasos obligatorios en orden
- **GIVEN** el archivo ".github/workflows/ci.yml"
- **WHEN** se leen sus pasos
- **THEN** aparecen en orden "npm ci", "prisma generate", "npm run lint", "npm run typecheck", "npm run test:run", "playwright install --with-deps chromium" y "npm run test:e2e"

#### Scenario: El workflow de CI usa Node 24 y PostgreSQL 16
- **GIVEN** el archivo ".github/workflows/ci.yml"
- **WHEN** se leen su servicio de base de datos y su versión de Node
- **THEN** el servicio usa la imagen "postgres:16" y Node es "24"

#### Scenario: El workflow de CI publica el informe de Playwright siempre
- **GIVEN** el archivo ".github/workflows/ci.yml"
- **WHEN** se lee el paso que sube el informe
- **THEN** sube "playwright-report" como artefacto con la condición "always()"
