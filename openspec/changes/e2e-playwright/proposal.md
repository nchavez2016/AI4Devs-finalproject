# Proposal: e2e-playwright

## Why

Las specs de autenticación, cuentas, transacciones y dashboard están cubiertas por tests de
unidad, componentes e integración, pero ninguno recorre la app real en un navegador. Hoy nada
garantiza que el flujo principal —registrarse, crear una cuenta, registrar un movimiento y
verlo reflejado en `/panel`— funcione de extremo a extremo antes de la entrega.

## What Changes

- Se instala Playwright (`@playwright/test`, versión exacta) y se configura una suite E2E en
  `e2e/*.spec.ts`, ejecutable con un script nuevo `test:e2e`, separado de `test:run` y del
  hook de pre-commit.
- La suite corre contra la app real y una base de datos de prueba propia cuyo nombre termina en
  `_test`; antes de arrancar comprueba ese sufijo y se niega a correr si no se cumple.
- Cada ejecución crea un usuario con correo único: no depende de datos previos.
- Test del flujo principal: registro → crear cuenta → registrar un gasto → `/panel` muestra
  totales del período, saldo de la cuenta y la categoría en el top.
- Según la decisión humana 3 (ver design.md), tests de redirect sin sesión y de aislamiento
  entre usuarios en el navegador.
- Configuración: `trace: 'on-first-retry'`, selectores solo por rol, etiqueta o `data-testid`,
  sin esperas fijas. Criterio de estabilidad: 3 ejecuciones seguidas en verde.

## Capabilities

### New Capabilities
- `pruebas-e2e`: verificación de extremo a extremo del flujo principal de Cuadre en un
  navegador real, con su guarda de base de datos de prueba y el aislamiento de datos por
  ejecución.

### Modified Capabilities
Ninguna. `autenticacion`, `cuentas`, `transacciones` y `dashboard` se ejercitan, no cambian.

## Impact

- **Dependencias:** `@playwright/test` (Playwright está en la lista aprobada de AGENTS.md).
  Requiere descargar el navegador Chromium (y otros, según la decisión 2). Ninguna otra
  dependencia prevista.
- **Archivos nuevos:** `playwright.config.ts`, `e2e/*.spec.ts`, soporte de la suite (guarda de
  base de datos, correo único, preparación de la base) y sus tests de unidad.
- **Archivos modificados:** `package.json` (script `test:e2e`, dependencia), `.gitignore`
  (informes y trazas de Playwright), `.env.example` si hiciera falta documentar alguna variable.
- **Base de datos:** base de prueba propia para E2E con las migraciones existentes; ninguna nueva.
- **Código de producción:** sin cambios previstos, salvo posibles `data-testid`.

## Fuera de alcance

Despliegue, integración continua (solo se diseña), seed de datos del revisor, pruebas visuales
y de rendimiento, y cualquier flujo distinto del principal salvo lo que decida la tarea 0.3.
