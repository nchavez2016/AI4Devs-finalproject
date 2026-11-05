# prompts.md — Registro de uso de IA · Proyecto Cuadre

Este documento registra cómo se usó la inteligencia artificial en el desarrollo
de Cuadre, según lo pide la guía del Proyecto Final de AI4Devs (LIDR). Se
actualiza en cada entrega.

- **Entrega 1:** documentación del producto (ver [Anexo A](#anexo-a--entrega-1-documentación)).
- **Entrega 2 (este registro):** scaffold, arnés de agentes, autenticación,
  cuentas y categorías funcionando de extremo a extremo.

---

## 1. Herramientas utilizadas

| Herramienta | Versión | Rol en el proyecto |
|---|---|---|
| **Claude (chat)** | — | Razonamiento, documentación (PRD, readme) y tutoría basada en el material del curso. No escribe en el repositorio. |
| **Claude Code** | 2.1.317 | Agente de terminal para el trabajo pesado: proponer changes, ciclos largos de `apply` en TDD, refactors. |
| **Google Antigravity (IDE)** | — | Entorno de trabajo diario: leer código, ediciones puntuales, revisión visual de lo que produce Claude Code. Sustituye a Cursor manteniendo el mismo proceso del máster. |
| **OpenSpec** | 1.13.2 | Spec-Driven Development: cada funcionalidad nace como un *change* (proposal, specs, tasks) antes de escribir código. |
| **Husky + guardia propia** | — | Hooks que bloquean commits inseguros y acciones peligrosas de los agentes (ver sección 3). |

**Regla de reparto:** lo pesado y autónomo va a Claude Code; lo puntual y de
precisión se hace en Antigravity, con el desarrollador al control.

---

## 2. Modelos utilizados por fase

| Fase | Herramienta | Modelo | Estado |
|---|---|---|---|
| Proponer el change (spec / SDD) | Claude Code | Claude Opus 5.5 (razonamiento) | `CONFIRMADO` |
| Implementar (`/opsx:apply`, TDD) | Claude Code | Claude Sonnet 5 (rápido) | `CONFIRMADO` |
| Revisar / verificar (`/opsx:verify`) | Claude Code | Claude Sonnet 5 | `CONFIRMADO` |
| Lectura y ediciones puntuales | Antigravity | Gemini | `CONFIRMADO` |

**Cómo se elige:** el modelo no está fijado en la configuración del repositorio;
se selecciona manualmente al abrir cada sesión. El criterio sigue el patrón del
curso: modelo de razonamiento para "llenar las lagunas" antes de codear, modelo
rápido para ejecutar una spec ya clara. Este reparto es una decisión de trabajo,
no una recomendación oficial de los proveedores.

---

## 3. Arnés: reglas, skills, comandos y hooks

| Pieza | Ubicación | Qué hace |
|---|---|---|
| Reglas del proyecto | `AGENTS.md` | Fuente única de reglas para cualquier agente: stack, TDD, límites, convenciones. |
| Puente para Claude Code | `CLAUDE.md` | Contiene solo `@AGENTS.md`, para no duplicar reglas. |
| Reglas de OpenSpec | `openspec/config.yaml` | Contexto y reglas que se inyectan al proponer/aplicar changes. |
| Comandos SDD | `.claude/commands/opsx/` y workflows de Antigravity | `/opsx:propose`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`. |
| Skill de diseño | `ux-cuadre` (referenciada en `AGENTS.md`) | Aplica el sistema de diseño "Libro de caja" (`docs/diseno/`). |
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
| `cuentas-y-categorias` | Crear/listar cuentas y categorías, nombres únicos por usuario (citext), aislamiento, 7 categorías por defecto | archivado / en cierre) |

---

## 5. Prompts clave de la Entrega 2

### 5.1. Proponer un change desde una historia
Objetivo: convertir HU-002/HU-004 en un change con escenarios verificables.
Solicite generar un plan para cubriri la necesidad del las HU-002/HU-004 , una por una se 
pidio y se pego el pedido tal como se trabaja en la etapa 1 para crear el requerimiento.
ejemplo
**Como** persona que gestiona las finanzas de mi negocio
**quiero** crear y administrar mis cuentas de dinero (banco, efectivo, billetera
digital)
**para** saber cuánto tengo disponible en cada una y a dónde asignar cada
movimiento.

> Implementado hasta la Entrega 2: crear y listar cuentas, con nombre único por
> usuario y aislamiento entre usuarios. El saldo mostrado es el saldo inicial;
> el escenario "Ver el saldo actualizado de una cuenta" de abajo depende de las
> transacciones, todavía pendientes.

**Prioridad:** Must-have
**Criterios de aceptación:**

```gherkin
Scenario: Crear una cuenta nueva
  Given estoy autenticado
  When creo una cuenta con nombre "Banco Pichincha", tipo "banco" y
       saldo inicial 500.00
  Then la cuenta aparece en mi lista de cuentas
  And su saldo actual es 500.00

Scenario: Ver el saldo actualizado de una cuenta
  Given tengo una cuenta con saldo inicial 500.00
  When registro un ingreso de 200.00 y un gasto de 50.00 en esa cuenta
  Then el saldo actual de la cuenta es 650.00

Scenario: Evitar el acceso a cuentas de otro usuario
  Given estoy autenticado como usuario A
  When intento consultar o modificar una cuenta que pertenece al usuario B
  Then el sistema no me permite verla ni modificarla
```


Ajuste humano: no se creo ajuste

### 5.2. Implementar en TDD estricto
Objetivo: que el agente avance una subtarea a la vez, con el test primero.

Ajuste humano: no se creo ajuste

### 5.3. Construir la guardia del arnés
Objetivo: bloquear acciones peligrosas de los agentes de forma *fail-closed*.

Ajuste humano: la guardia la revisa y la edita solo el autor.

---

## 6. Decisiones y ajustes humanos (Entrega 2)

> Revisar que cada punto refleje una decisión propia.

- **Fuente única de reglas:** `AGENTS.md`; `CLAUDE.md` solo lo referencia. No se
  usa `@ruta` dentro de `AGENTS.md` porque Antigravity lo interpreta distinto.
- **Agentes sin acceso al arnés:** `.claude/` y `scripts/agents/` quedan fuera de
  su alcance; `git push` lo hace solo el autor.
- **TDD adaptado al hook:** RED + GREEN en un solo commit, en lugar de saltarse
  el pre-commit.
- **Herramienta según la tarea:** ciclos largos de `apply` en Claude Code, porque
  Antigravity en Windows pide permiso para cada comando con argumentos.
- **Sin seed ni usuario demo:** cada revisor se registra y recibe sus 7
  categorías por defecto.
- **Nombres únicos sin distinguir mayúsculas** con `citext`, decidido en la base
  y no solo en la validación.
- **Versiones exactas** de Prisma (7.10.0) y next-auth (5.0.0-beta.32) para
  evitar cambios inesperados en una beta.
- **Datos no verificables** (cifras de productividad citadas en clase) no se
  usan en los entregables.
- **Correcciones al output de la IA:** sin ajuste
- **decisiones y criterio humano** El hook de protección bloqueó un comando del agente que apuntaba a .claude/ y encadenaba órdenes. 
	El agente se detuvo y avisó, como exige AGENTS.md, y se reanudó con instrucciones más acotadas
---

## 7. Pendiente para la entrega final

- Registro automático de prompts: hook `UserPromptSubmit` de Claude Code que
  anexe a `docs/ia/registro-prompts.jsonl` (fuera de git). Diseñado, no instalado.
- Documentar los prompts de transacciones, dashboard, E2E y despliegue.
- Métricas: qué generó bien la IA a la primera y qué requirió corrección.

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
