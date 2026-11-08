# prompts.md — Registro de uso de IA · Proyecto Cuadre

Este documento registra cómo se usó la inteligencia artificial en el desarrollo
de Cuadre, según lo pide la guía del Proyecto Final de AI4Devs (LIDR). Se
actualiza en cada entrega.

- **Entrega 1:** documentación del producto (ver [Anexo A](#anexo-a--entrega-1-documentación)).
- **Entrega 2:** scaffold, arnés de agentes, autenticación, cuentas y categorías
  funcionando de extremo a extremo.
- **Entrega final (11 de noviembre de 2026):** rediseño, transacciones, dashboard,
  pruebas E2E, integración continua y despliegue en Vercel + Neon. Las fichas por
  change están en `docs/ia/fichas/`.

---

## 1. Herramientas utilizadas

| Herramienta | Versión | Rol en el proyecto |
|---|---|---|
| **Claude (chat)** | — | Razonamiento, documentación (PRD, readme) y tutoría basada en el material del curso. No escribe en el repositorio. |
| **Claude Code** | 2.1.317 | Agente de terminal para el trabajo pesado: proponer changes, ciclos largos de `apply` en TDD, refactors. |
| **Google Antigravity (IDE)** | Información faltante | Entorno de trabajo diario: leer código, ediciones puntuales, revisión visual de lo que produce Claude Code. Sustituye a Cursor manteniendo el mismo proceso del máster. |
| **OpenSpec** | 1.13.2 | Spec-Driven Development: cada funcionalidad nace como un *change* (proposal, specs, tasks) antes de escribir código. |
| **Husky + guardia propia** | — | Hooks que bloquean commits inseguros y acciones peligrosas de los agentes (ver sección 3). |

**Regla de reparto:** lo pesado y autónomo va a Claude Code; lo puntual y de
precisión se hace en Antigravity, con el desarrollador al control.

---

## 2. Modelos utilizados por fase

| Fase | Herramienta | Modelo | Estado |
|---|---|---|---|
| Proponer y actualizar el change (`/opsx:propose`, `/opsx:update`) | Claude Code 2.1.317 | Claude Opus 5.5 (`claude-opus-5-5`) | `CONFIRMADO` |
| Implementar (`/opsx:apply`, TDD) | Claude Code 2.1.317 | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | `CONFIRMADO` |
| Revisar / verificar (`/opsx:verify`) | Claude Code 2.1.317 | Claude Sonnet 5.5; en `transacciones-movil`, Claude Opus 5.5 | `CONFIRMADO` |
| Archivar (`/opsx:archive`) | Claude Code 2.1.317 | Claude Sonnet 5.5 | `CONFIRMADO` |
| Implementar en bloque cambios acotados (`/opsx-apply`): `registro-ia`, `transacciones-movil`, `dashboard-ajustes` | Antigravity | Gemini 3.8 Flash, nivel High (modelId no registrado) | `CONFIRMADO` |

Fuente: las fichas de `docs/ia/fichas/`. Los modelId de Claude Code se tomaron del
contexto de la sesión; los del Antigravity no quedan registrados.

**Cómo se elige:** el modelo no está fijado en la configuración del repositorio;
se selecciona manualmente al abrir cada sesión. En Claude Code se propone con Opus
y se cambia a Sonnet con `/model` a mitad de la sesión, al empezar `/opsx:apply`.
El criterio sigue el patrón del curso: modelo de razonamiento para "llenar las
lagunas" antes de codear, modelo rápido para ejecutar una spec ya clara. Este
reparto es una decisión de trabajo, no una recomendación oficial de los
proveedores.

---

## 3. Arnés: reglas, skills, comandos y hooks

| Pieza | Ubicación | Qué hace |
|---|---|---|
| Reglas del proyecto | `AGENTS.md` | Fuente única de reglas para cualquier agente: stack, TDD, límites, convenciones. |
| Puente para Claude Code | `CLAUDE.md` | Contiene solo `@AGENTS.md`, para no duplicar reglas. |
| Reglas de OpenSpec | `openspec/config.yaml` | Contexto y reglas que se inyectan al proponer/aplicar changes. |
| Comandos SDD | `.claude/commands/opsx/` y workflows de Antigravity | `/opsx:propose`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`. |
| Skill de diseño | `ux-cuadre` (referenciada en `AGENTS.md`) | Aplica el sistema de diseño "Libro de caja" (`docs/diseno/`). |
| Skill del dashboard | `dashboard-cuadre` | Métricas, períodos, saldos, top de categorías y estado vacío del dashboard (HU-003). |
| Comando de revisión del change | `/opsx:update` | Revisa los artefactos de un change ya propuesto y los mantiene coherentes antes de aplicarlo. |
| Hook de clases de diseño | `scripts/diseno/comprobar-clases.mjs` (en el pre-commit) | Rechaza clases del tema por defecto que no existen en el sistema de diseño. |
| Registro de prompts | `scripts/ia/registrar-prompt.mjs` (hook `UserPromptSubmit` de Claude Code) | Anexa cada prompt de la sesión, con `session_id` y `prompt_id`, a `docs/ia/registro-prompts.jsonl` (fuera de git). No se dispara en Antigravity: allí el registro es manual. |
| Fichas de IA | `docs/ia/fichas/<change>.md` (plantilla en `docs/ia/plantilla-ficha.md`) | Una ficha por change archivado: herramienta y modelo por fase, prompt clave, resultado, ajuste humano y métricas de tests. |
| Hook pre-commit | `.husky/pre-commit` | Bloquea commits en `main`/`master`; corre lint, typecheck y toda la suite de tests. |
| Hook pre-merge-commit | `.husky/pre-merge-commit` | Mismas garantías en merges locales. |
| Guardia de agentes | `scripts/agents/guard-core.mjs` + adaptadores | *Fail-closed*. Bloquea `.env*`, `.claude/`, `scripts/agents/`, `.agents/hooks.json`, migraciones aplicadas, `git push/reset/clean/checkout/switch/merge/rebase`, `--no-verify` y `npm audit fix`. |
| Adaptador Claude Code | `scripts/agents/claude-adapter.mjs` | Devuelve exit 2 para bloquear. |
| Adaptador Antigravity | `scripts/agents/antigravity-adapter.mjs` | Responde `deny/ask/allow`; revisa cada tramo del comando y fuerza `ask` ante `$(`, `${` o backticks. 14 tests. |
| Parking-lot | `docs/pendientes.md` | Deuda y decisiones aplazadas, para que el agente no las "arregle" por su cuenta. |

**Límite deliberado:** los agentes no pueden editar `.claude/` ni
`scripts/agents/`. El arnés solo lo modifica el autor, a mano.

---

## 4. Flujo de trabajo (SDD + TDD)

```
Historia (readme §5) → /opsx:propose → revisión humana del change
  → /opsx:apply (subtarea a subtarea: RED → GREEN → REFACTOR)
  → /opsx:verify → /opsx:archive → commit
```

- Cada escenario Given/When/Then de la spec exige un test con su nombre exacto.
- RED y GREEN se commitean juntos: el pre-commit corre toda la suite y no
  admite un test en rojo. Nunca se usa `--no-verify`.
- `progress.md` y `tasks.md` del change son el traspaso entre herramientas.

**Changes de la Entrega 2:**

| Change | Resultado | Estado |
|---|---|---|
| `esquema-y-autenticacion` | Prisma + PostgreSQL, registro, login, sesión JWT, `proxy.ts` | Archivado 2026-10-01 |
| `cuentas-y-categorias` | Crear/listar cuentas y categorías, nombres únicos por usuario (citext), aislamiento, 7 categorías por defecto | Archivado 2026-10-22 |

**Changes de la entrega final** (resultados tomados de sus fichas):

| Change | Resultado | Estado |
|---|---|---|
| `rediseno-base` | 91 tareas: cabecera compartida con menú móvil, tarjetas, campo de monto, foco en el primer error y script de pre-commit contra clases del tema por defecto | Archivado 2026-11-05 |
| `registro-ia` | Registro automático de prompts (`scripts/ia/registrar-prompt.mjs`), 7 tests nuevos | Archivado 2026-11-05 |
| `transacciones` | 142 tareas: registro y listado con filtros por URL, saldo calculado, 51 escenarios con test | Archivado 2026-11-06 |
| `transacciones-movil` | 37 tareas: registro móvil primero, filtros plegables, botón Guardar fijo | Archivado 2026-11-06 |
| `dashboard` | 102 tareas: totales por período, saldos, top 5 de categorías (Recharts), estado vacío | Archivado 2026-11-07 |
| `dashboard-ajustes` | 35 tareas: rango del período en fechas de Ecuador y subtítulo de saldos | Archivado 2026-11-07 |
| `e2e-playwright` | 30 tareas: Playwright 1.65.0, 3 specs (6 tests en escritorio y móvil) | Archivado 2026-11-07 |
| `despliegue-y-ci` | 60 tareas: seed del revisor, CI en GitHub Actions, guía Vercel + Neon; app publicada | Archivado 2026-11-07 |

---

## 5. Prompts clave de la entrega final

Cuatro prompts de la entrega final, uno por change de mayor peso. Cada uno se
resume (no se pega completo) y se puede rastrear con su `session_id` y `prompt_id`
en `docs/ia/registro-prompts.jsonl` (fuera de git; los identificadores coinciden con
los de las fichas de `docs/ia/fichas/`). Todos son `/opsx:propose` en Claude Code con
Opus 5.5. El apartado "Ajuste humano" de cada uno es un **BORRADOR (humano valida)**
tomado de las fichas.

### 5.1. `transacciones` — registrar y listar movimientos (HU-001)
- **session_id:** `9feb4320-9c87-4b70-94dc-a185bc61fb11`
- **prompt_id:** `ff17a050-bb41-403a-8021-7ce10b307fe0`
- **Qué se pidió:** implementar HU-001 con sus 3 escenarios Gherkin como nombre
  exacto de test; Server Actions con el patrón de capas de cuentas (sin
  `/api/transacciones`); sin migración nueva; saldo = saldo inicial + ingresos −
  gastos, con una prueba de caracterización previa (0.00 + 100.00 − 25.50 = 74.50);
  cuenta y categoría del usuario de la sesión; plantear en `design.md` si el tipo de
  la transacción debe coincidir con el de la categoría. Fuera de alcance: editar y
  eliminar, subcategorías y dashboard.
- **Qué salió:** 142 tareas en TDD; registro y listado con filtros por URL, saldo
  calculado, pantalla `/transacciones` con estados vacío, carga, error y éxito.
  51 escenarios, cada uno con su test.
- **Ajuste humano (BORRADOR, humano valida):** reorientó el change tras archivar
  `rediseno-base` y aprobó la opción A (el tipo de la transacción es el de la
  categoría); mandó parar ante los timeouts del pre-commit; su revisión manual halló
  la tabla desbordada, la fecha en tres líneas y faltaba un título "Movimientos".

### 5.2. `dashboard` — panel financiero (HU-003)
- **session_id:** `943dbdf7-77d6-4fb0-b200-0793d4aa9dba`
- **prompt_id:** `f76dffab-3a49-400c-8bbd-8a54eaca44a9` (propose); `0430a1e1-62fc-43cc-b9c3-3b1bd1dca16c` (apply)
- **Qué se pidió:** `/opsx:propose dashboard` con lectura previa, sin modificar nada,
  de `AGENTS.md`, las skills `dashboard-cuadre` y `ux-cuadre` y los docs de diseño; las
  decisiones 1–4 abiertas como tareas `[HUMANO]`; sin código ni commits.
- **Qué salió:** 102 tareas; el panel pasó a dashboard con totales por período,
  saldos por cuenta, top 5 de categorías de gasto (Recharts 3.10.1) y estados; 284
  tests y 29 escenarios.
- **Ajuste humano (BORRADOR, humano valida):** eligió la opción recomendada en las
  decisiones 0.1–0.6 y autorizó retirar `panel.ts` y los tests de tarjetas (0.7);
  pidió una mutación `float` para forzar el RED de 2.13; su revisión manual halló una
  etiqueta `$120,00` cortada a 360 px.

### 5.3. `e2e-playwright` — pruebas de extremo a extremo
- **session_id:** `d481590a-2929-49e8-816f-407a0b6a0c37`
- **prompt_id:** `0c7e220f-9617-43ca-82e8-98a3f7f14e98` (propose); `7d415fed-a146-44d1-9c05-ecd7905c8866` (apply con las decisiones 0.1 a 0.4)
- **Qué se pidió:** `/opsx:propose e2e-playwright` con la lista de archivos permitidos
  y las reglas: Playwright en versión exacta, base de datos `_test` con guarda,
  `getByRole`/`getByLabel`/`getByTestId`, sin `waitForTimeout`, correo único, `trace`
  `on-first-retry` y 3 ejecuciones sin flakiness; cuatro decisiones abiertas como
  tareas `[HUMANO]` sin resolverlas.
- **Qué salió:** 30 tareas; Playwright 1.65.0, build + start en el puerto 3100, base
  `cuadre_e2e_test` y 3 specs (6 tests en escritorio y móvil a 360 px). 3 ejecuciones
  seguidas 6/6.
- **Ajuste humano (BORRADOR, humano valida):** pidió editar `global-setup.ts`
  directamente con `migraciones.ts` compartido y anotar el desvío de D1; añadió con
  `/opsx:update` las capturas `only-on-failure`, la tarea 6.4 de evidencias con
  `E2E_EVIDENCIA=1` y la decisión D5 (capturas commiteadas a mano).

### 5.4. `despliegue-y-ci` — CI, seed y despliegue
- **session_id:** `c23e7fe9-56e1-4a7f-a86f-1a520623d2cb`
- **prompt_id:** `9086a387-9178-4f21-88b5-6e335a1f4e2b` (propose); `4bc63d9a-62d8-4f85-8b13-4a75c3d4f7b8` (apply con las decisiones 0.1 a 0.5); `dbdaaea3-02e5-437a-988e-3b272ca00370` (fallo de CI en typecheck)
- **Qué se pidió:** `/opsx:propose despliegue-y-ci` con la lista de archivos
  permitidos y el alcance: build reproducible, seed idempotente del revisor, CI en
  GitHub Actions y guía de Vercel + Neon; cuatro decisiones abiertas como tareas
  `[HUMANO]` sin resolverlas.
- **Qué salió:** 60 tareas; build con `prisma generate`, `npm run db:seed` con la
  guarda `SEED_CONFIRMAR_BASE`, workflow de CI, `docs/despliegue.md` y typecheck con
  `next typegen`; 313 tests en verde y E2E 6/6; app publicada en Vercel + Neon.
- **Ajuste humano (BORRADOR, humano valida):** cerró las decisiones 0.1 a 0.5
  (migraciones a mano, seed mínimo, build en el `webServer`, `SEED_CONFIRMAR_BASE`,
  `tsx` exacto) y añadió 5 ajustes; tras un bloqueo del hook pidió seguir solo con
  Edit, un comando por ejecución; el primer CI falló en typecheck (`LayoutProps` sin
  `.next/types`) y pidió el grupo 18 con TDD.

Prompts de `transacciones-movil` y `dashboard-ajustes`: se aplicaron en Antigravity
y no tienen `session_id` ni `prompt_id`: el hook de registro no se dispara en
Antigravity (Información faltante).

---

## 6. Decisiones y ajustes humanos

- **Fuente única de reglas:** `AGENTS.md`; `CLAUDE.md` solo lo referencia. No se
  usa `@ruta` dentro de `AGENTS.md` porque Antigravity lo interpreta distinto.
- **Agentes sin acceso al arnés:** `.claude/` y `scripts/agents/` quedan fuera de
  su alcance; `git push` lo hace solo el autor.
- **TDD adaptado al hook:** RED + GREEN en un solo commit, en lugar de saltarse
  el pre-commit.
- **Herramienta según la tarea:** ciclos largos de `apply` en Claude Code, porque
  Antigravity en Windows pide permiso para cada comando con argumentos.
- **Seed idempotente del usuario revisor** (`npm run db:seed`, Entrega final): deja
  `revisor@cuadre.test` con 2 cuentas y 5 movimientos, y solo corre a mano con la
  guarda `SEED_CONFIRMAR_BASE`. Sin seed, cada revisor puede registrarse y recibe
  sus 7 categorías por defecto.
- **Nombres únicos sin distinguir mayúsculas** con `citext`, decidido en la base
  y no solo en la validación.
- **Versiones exactas** de Prisma (7.10.0) y next-auth (5.0.0-beta.32) para
  evitar cambios inesperados en una beta.
- **Datos no verificables** (cifras de productividad citadas en clase) no se
  usan en los entregables.
- **Correcciones al output de la IA en la entrega final** (BORRADOR, humano valida;
  fuente: fichas):
  - Selectores ambiguos en el E2E ("Crear cuenta", "Cuenta") y Playwright que no
    cargaba el cliente Prisma por `import.meta`.
  - El primer CI falló en typecheck por tipos de rutas sin generar; se corrigió con
    `next typegen`.
  - Tres divergencias de texto entre specs y código halladas en `/opsx:verify` de
    `rediseno-base`, y tres fallos de maquetación en la revisión manual de
    `transacciones`.
- **Decisiones y criterio humano:** el hook de protección bloqueó un comando del
  agente que apuntaba a `.claude/` y encadenaba órdenes. El agente se detuvo y avisó,
  como exige `AGENTS.md`, y se reanudó con instrucciones más acotadas.

---

## 7. Métricas de la entrega final

Tomadas de las fichas de `docs/ia/fichas/` ("Tests: iteraciones hasta pasar" y
"Salió bien a la primera"). Tests en verde = total de Vitest al cerrar el change.

| Change | Tareas | Tests en verde | Iteraciones hasta pasar | ¿A la primera? |
|---|---|---|---|---|
| `rediseno-base` | 91 | Información faltante | 1 por tarea; 4 RED forzados por mutación; 2 commits rechazados por el hook | No |
| `registro-ia` | Información faltante | 168 (7 nuevos) | Todos pasaron tras cada GREEN | Información faltante |
| `transacciones` | 142 | Información faltante | 1 por tarea; 10 RED forzados por mutación; 4 commits rechazados por el hook | No |
| `transacciones-movil` | 37 | 255 | 1 salvo un test, que necesitó una segunda | Sí, salvo un test |
| `dashboard` | 102 | 284 | 2 en el RED de 2.13; 1 fallo transitorio por timeout | No |
| `dashboard-ajustes` | 35 | 293 | 1 en todos | Sí |
| `e2e-playwright` | 30 | 296 (E2E 6/6) | Flujo principal en 3 iteraciones | No |
| `despliegue-y-ci` | 60 | 313 (E2E 6/6) | 1 por escenario; el test 14.1 necesitó una segunda | No |

**Lectura.** De las 8 fichas, 2 salieron bien a la primera (`transacciones-movil`,
con una excepción, y `dashboard-ajustes`), 5 no y 1 no registra el dato. Las dos que
salieron bien fueron cambios acotados, aplicados en Antigravity. Los cambios grandes
necesitaron correcciones por tres causas que se repiten: tests que ya pasaban y hubo
que forzar en RED con mutación, commits rechazados por el pre-commit (timeouts o
tipos) y hallazgos de la revisión manual a 360 y 1280 px.
El hook de registro (`UserPromptSubmit`) está instalado en Claude Code; en
Antigravity el registro es manual.

---

## Anexo A — Entrega 1 (documentación)

### A.1. Definición y recorte del MVP
> Prompt (resumen): "Contrasta el alcance de mi sistema contra la guía del
> proyecto final. Ayúdame a recortar a un MVP de 3-5 historias must-have que
> demuestre un flujo end-to-end, y deja el resto documentado como roadmap. No
> inventes requisitos que no estén en la guía."

Ajuste humano: la decisión de qué entra al MVP (cuentas, transacciones,
categorías, dashboard, auth) y qué queda como visión futura la tomó el autor.

### A.2. Modelo de datos en 3FN
> Prompt (resumen): "Diseña el modelo de datos del MVP y justifica que cumple la
> Tercera Forma Normal. Señala cualquier redundancia."

Ajuste humano: se verificó que no se guardan datos derivados (la transacción
guarda `cuenta_id`, no el nombre de la cuenta).

### A.3. Historias con Given/When/Then
> Prompt (resumen): "Para esta historia, escribe criterios de aceptación en
> Given/When/Then. Incluye casos de error y de aislamiento entre usuarios, no
> solo el camino feliz."

Ajuste humano: cada criterio se contrastó con la lógica real (cálculo de saldo).

### A.4. Patrón Repository
> Prompt (resumen): "Analiza los proyectos de ejemplo del curso con mi stack y
> dime qué patrón de acceso a datos usan. Evalúa si conviene adoptarlo para mi
> MVP sin sobredimensionar."

Ajuste humano: se adoptó con implementación simple.

### A.5. Estructura del readme y refinamiento del alcance
Se replicó la estructura 0-7 de los ejemplos del curso, descartando secciones
que no aplicaban. Decisiones del autor: usuario genérico, etiquetas
[MVP]/[DOCUMENTADO], `nombre_negocio` en el usuario, Neon para producción,
pgvector descartado y seguridad con Zod, Prisma parametrizado y escape de React.

### A.6. Ajustes humanos (Entrega 1)
- Recorte de alcance impuesto por el autor frente a propuestas demasiado amplias.
- Nombre, stack y prioridades decididos por el autor; la IA ofreció opciones.
- 3FN y criterios de aceptación revisados manualmente.
