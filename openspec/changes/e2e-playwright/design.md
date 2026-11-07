# Design: e2e-playwright

## Context

- Vitest ya prepara una base de prueba para integración: `src/test/bd/global-setup.ts` crea la
  base si no existe (vía la base `postgres`) y ejecuta `prisma migrate deploy` con el CLI local;
  `exigirBaseDePrueba` (en `guardia.ts`) y `urlBaseDePrueba` (en `url.ts`) deciden y protegen la
  URL. **No se leyeron `guardia.ts` ni `url.ts`** (fuera de la lista permitida): se asume que
  `exigirBaseDePrueba` rechaza nombres sin `_test` y devuelve el nombre, como sugiere su uso.
- La integración vacía su base entre tests y corre en serie; compartirla con E2E en paralelo
  produciría borrados cruzados.
- La app necesita `DATABASE_URL` y `AUTH_SECRET` al arrancar (lo valida `src/config/env.ts`
  según `vitest.config.mts`); los tests ya usan secretos ficticios en la config.
- `npm run dev` usa el puerto 3000 contra la base de desarrollo.

## Goals / Non-Goals

**Goals:** suite reproducible localmente en Windows, que no pueda tocar la base de desarrollo y
pase 3 veces seguidas sin reintentos. **Non-Goals:** CI implementado, pruebas visuales, seed.

## Decisions

**D1. Base E2E propia y guarda reutilizada.** Base `cuadre_e2e_test` (nombre a confirmar en
0.1), distinta de la de integración. El `globalSetup` de Playwright llama a la guarda antes de
crear/migrar la base y la app se arranca después, con `DATABASE_URL` apuntando a esa base y un
`AUTH_SECRET` ficticio en `webServer.env` (sin leer `.env`). Se reutilizan `exigirBaseDePrueba`
y la lógica de creación/migración de `global-setup.ts`, extrayéndola a una función compartida si
hace falta (con caracterización previa). Alternativa descartada: guarda propia duplicada.

**Desvío de D1 (grupo 5).** La base E2E la crea `prisma migrate deploy`, no `global-setup.ts`
(comprobado: sobre una base inexistente la crea y aplica las 3 migraciones). Motivo: Playwright
carga la configuración y el `globalSetup` como CommonJS, y el cliente Prisma generado
(`src/generated/prisma`) usa `import.meta`, por lo que no puede importarse. Consecuencias:
`aplicarMigraciones` pasó a `src/test/bd/migraciones.ts` (sin cliente Prisma, compartido por
Vitest y Playwright); `global-setup.ts` conserva `crearBaseSiNoExiste` solo para Vitest;
`preparar-base-e2e.ts` aplica la guarda y luego migra. La guarda también se ejecuta al cargar
`playwright.config.ts`, porque el `webServer` arranca antes que el `globalSetup`.

**D2. Puerto propio y sin reutilizar servidor.** `webServer` en el puerto 3100 con
`reuseExistingServer: false`, para no conectarse por error a un `next dev` en 3000 apuntando a
la base de desarrollo.

**D3. Selectores y esperas.** `getByRole`/`getByLabel` con los textos de las specs; `data-testid`
solo donde no haya nombre accesible único (p. ej. la fila de una cuenta en el panel). Esperas con
aserciones web-first (`toHaveURL`, `toBeVisible`, `toHaveText`).

**D4. Datos únicos.** Correo `e2e-<marca de tiempo>-<aleatorio>@e2e.cuadre.test` generado por
test; la base no se vacía entre ejecuciones. `trace: 'on-first-retry'`; `retries` 0 en local
para que la flakiness no quede oculta. `screenshot: 'only-on-failure'` deja una captura en
`test-results/` (ignorada por git) solo cuando un test falla.

**D5. Evidencias de pantalla opcionales.** Con `E2E_EVIDENCIA=1`, el flujo principal guarda al
final capturas de `/panel` a 360 px y 1280 px en `docs/evidencias/e2e/` (`panel-360.png`,
`panel-1280.png`); sin la variable no escribe nada. Las capturas **se commitean a mano**, cuando
la persona decide documentar un hito, y **no en cada ejecución**: ni `test:e2e` ni el hook de
pre-commit las generan o añaden, para no ensuciar el historial con binarios que cambian a cada
corrida. El fallo de una captura se avisa pero no cambia el resultado del test. No son pruebas
visuales (no hay comparación con una imagen de referencia), por lo que no contradicen el fuera
de alcance del change. Alternativa descartada: guardarlas siempre en `test-results/`, que no
sirve como evidencia versionada.

### Decisiones tomadas por la persona (tareas 0.1 a 0.4)

- **0.1:** `next build` + `next start` en `webServer`; la base se crea y migra en el `globalSetup`
  de Playwright (`migrate deploy`). Base `cuadre_e2e_test`, puerto 3100.
- **0.2:** solo Chromium, con dos proyectos: escritorio y móvil 360 px.
- **0.3:** se prueban también el redirect sin sesión y el aislamiento entre usuarios (grupos 7 y 8).
- **0.4:** diseño de CI aprobado (fila 0.4 de la tabla); no se implementa en este change.

**Versión instalada (tarea 1.1):** `@playwright/test` 1.65.0, exacta. Única dependencia nueva.

### Hallazgos de código previos a la tarea 2.1

Leídos `guardia.ts`, `url.ts` y `global-setup.ts` (no se leyó `.env`):

- `exigirBaseDePrueba(url)` solo analiza la URL, no conecta: toma el nombre de la base del
  `pathname`; si no termina en `_test` lanza `Se niega a actuar sobre "<base>": el nombre de la
  base debe terminar en "_test".`, y si termina, lo devuelve. Confirma el supuesto previo.
- `urlBaseDePrueba()` devuelve `process.env.TEST_DATABASE_URL`, y si no existe, la URL local de
  `docker-compose.yml` escrita en el propio archivo (`cuadre:cuadre@localhost:5432/cuadre_test`,
  credenciales del contenedor local, no un secreto). `vitest.config.mts` carga `.env` con
  `process.loadEnvFile()` (Node en tiempo de ejecución) antes de llamarla.
- `global-setup.ts` usa esa URL para crear la base (conectando a `/postgres`) y migrar con el CLI
  de Prisma, y vuelve a pasar la guarda en ambos pasos.
- **Cómo llegarán las credenciales al `globalSetup` de Playwright:** `playwright.config.ts` hará
  el mismo `try { process.loadEnvFile() } catch {}` y derivará la URL E2E de `urlBaseDePrueba()`
  cambiando solo el nombre de la base a `cuadre_e2e_test` (mismo servidor y credenciales que la
  integración). Esa URL se pasa a `webServer.env` y al `globalSetup`. Nadie (ni el agente) lee el
  contenido de `.env`: solo lo carga Node al ejecutar. Sin `.env`, se usa el valor por defecto
  local. No hace falta variable nueva; la tarea 5.2 solo documentaría una `E2E_DATABASE_URL`
  opcional si la persona prefiere definir la URL completa.

### Decisiones abiertas (grupo 0, [HUMANO]) — resueltas arriba

| # | Decisión | Alternativas | Recomendación |
|---|---|---|---|
| 0.1 | Arranque de la app y migración | a) `next dev` en `webServer`; b) `next build` + `next start`; migración en `globalSetup` (`migrate deploy`) o script previo | **b + `globalSetup`**: build de producción es más fiel y estable (sin compilación bajo demanda que provoque timeouts); `globalSetup` reutiliza lo existente. Coste: build de ~1–2 min por ejecución. Si molesta, a) para desarrollo local. |
| 0.2 | Navegadores y viewports | a) Chromium escritorio; b) Chromium escritorio + móvil 360 px; c) Chromium + Firefox + WebKit | **b**: el formulario de transacciones cambia en móvil (botón fijo, filtros plegados); una sola descarga de navegador. |
| 0.3 | Alcance | a) solo flujo principal; b) + redirect sin sesión + aislamiento | **b**: son baratos y la regla de config exige un escenario de aislamiento en capacidades con datos de usuario. Si se elige a), retirar el requisito "Acceso y aislamiento…" con `/opsx:update` antes de aplicar. |
| 0.4 | CI (solo diseño) | a) GitHub Actions con servicio `postgres` y `npx playwright install --with-deps chromium`; b) manual antes de cada entrega | **a**, en un change posterior: `DATABASE_URL` del servicio terminada en `_test`, `AUTH_SECRET` como secreto del repo, `retries: 2` solo en CI y artefacto con el informe y trazas. |

## Risks / Trade-offs

- [El flujo pasa a la primera y el RED no se observa] → verificar por mutación (alterar
  temporalmente un importe esperado) y detenerse a proponerlo, según la guía de apply.
- [Tras registrarse la app puede no abrir sesión; textos exactos de etiquetas y botones de
  registro/login no constan en las specs leídas] → se confirman en el RED; el test inicia sesión
  explícitamente si el registro lleva a `/login`.
- [Auth.js en `next start` puede exigir `AUTH_TRUST_HOST`/`AUTH_URL`] → añadirlo en
  `webServer.env` y documentarlo en `.env.example` si se elige 0.1 b.
- [Cambio de mes o de día durante la ejecución] → el gasto usa la fecha propuesta por el
  formulario y se comprueba en la misma ejecución; riesgo residual solo a medianoche de Ecuador.
- [Formato del balance negativo "−$25,50" deducido de la spec de cuentas] → confirmar en el RED.
- [La base E2E crece con cada ejecución] → aceptable en local; se puede borrar y se recrea sola.
