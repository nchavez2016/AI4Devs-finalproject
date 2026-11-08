# Pendientes (no se hacen hasta después de la entrega 2)

## Configuración
- Fijar la versión de Node (`engines` en package.json) cuando se decida el despliegue.
- Documentar el riesgo aceptado de `npm audit` (deepmerge-ts y mysql2 vienen de la CLI de Prisma; no usar `npm audit fix --force`).
- Aprobar de forma controlada los scripts de instalación de Prisma (`npm approve-scripts`).
- Antigravity: que el agente use `git commit -F <archivo ignorado>` para no pedir permiso en cada commit.
- Antigravity: los workflows se retiran el 1-nov-2026; tras esa fecha, revisar qué genera `openspec update` y usar las skills `openspec-*`.
- Decisión neutra `ask` del adaptador de Antigravity: si genera demasiadas confirmaciones, evaluar cambiarla.
- Valorar eliminar `progress.md` y dejar `tasks.md` + `git log` como memoria.
- Valorar proteger `.husky/` de ediciones del agente.
- Aviso de Vite (configLoader native): importar ./src/test/bd/url con extensión o convertirlo a .mjs.
## Diseño
- Guardián automático de clases del tema por defecto en el pre-commit.
- Test automático de contraste de los tokens.
- Skill `ux-cuadre` y subagente revisor de UX (y comprobación de sincronía si se duplican skills propias).
- Componentes que faltan: tarjeta, "Totales con etiqueta" de Importe.
- Formulario: reformateo del monto al salir, validación al enviar y foco al primer campo inválido.
- Los `input type="date"` (formulario de transacciones y filtros) muestran mm/dd/yyyy según el idioma del navegador, y el checklist pide fechas en formato `es-EC` (checklist.md, línea 69). Valorar un campo de fecha propio o fijar el idioma del control.
- Antigravity en Windows pide permiso para comandos con argumentos aunque su prefijo esté en la lista y en el hook (git log, git diff, npx vitest run...). Usar Claude Code para ciclos largos de apply. Revisar si una versión futura respeta el allow del hook.
- `FiltrosMovimientos.tsx` importa `contarFiltrosActivos`/`hayFiltrosActivos` desde `@/app/(privado)/transacciones/filtros`: mover a `src/server/transacciones/` o `src/components/` (requiere autorizar la modificación de los tests que importan `filtros.ts`).
- `aria-controls="grupo-filtros"` en `FiltrosMovimientos.tsx` usa un id fijo: usar `useId()` si el componente se reutiliza.
- ContenidoPanel: rangoPeriodo quedó opcional, aunque DatosDashboard lo exige. Hacerlo obligatorio en las props.

## Producto
- Editar y eliminar movimientos (HU-005).
- Interfaz de subcategorías, si no cabe en el plazo.
- Filtro de movimientos con `desde` posterior a `hasta`: hoy devuelve una lista vacía sin aviso.
- Descripción truncada en la tabla de movimientos (transacciones): el texto completo no se puede leer en ningún sitio hasta que exista la vista de edición (HU-005). Valorar mostrar hasta 2 líneas o una vista de detalle.
- Sección 7 del readme y casilla del PR de TK-002: esta entrega no abre Pull Request (se entrega la rama y el formulario de Typeform). Corregirlo en la fase de documentación final.
- Posible migración de Auth.js a Better Auth (Auth.js está en modo de mantenimiento).

## Entrega final
- Playwright (E2E), GitHub Actions, despliegue en Vercel + Neon y `prompts.md`.

## Guardia
- Permitir que el agente cree migraciones nuevas en prisma/migrations/ y bloquear solo editar las existentes (hoy las crea el humano).

## Despliegue
- Comprobar que la extensión `citext` (nombres de categoría sin distinguir mayúsculas) esté disponible en Neon antes de migrar.
- (verify de despliegue-y-ci) `AGENTS.md` (definición de terminado), `openspec/config.yaml` (guía de archivar) y `scripts/agents/antigravity-adapter.mjs` (lista de comandos permitidos) mencionan `npx tsc --noEmit` suelto, que en un clon limpio falla porque `LayoutProps` necesita `.next/types`. Cambiarlos a `npm run typecheck` (que ya ejecuta `next typegen`).
- (verify de despliegue-y-ci) `src/server/semilla/destino.ts`: quitar la rama de confirmación vacía no rompe ningún test, porque la comparación siguiente también falla y solo cambia el mensaje. Hacer que el test "El seed se niega a correr sin confirmar la base" compruebe que el mensaje menciona `SEED_CONFIRMAR_BASE`.
- (verify de despliegue-y-ci) El escenario "El typecheck genera los tipos de rutas antes de tsc" habla de un clon sin `.next/`, pero su test solo lee `package.json`; la prueba real fue el CI (tarea 18.4). Valorar un test que ejecute el typecheck sin `.next/`.
