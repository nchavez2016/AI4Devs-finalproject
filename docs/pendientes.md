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
- Componentes que faltan: selector de tipo, tarjeta, lista y tabla de movimientos, "Totales con etiqueta" de Importe.
- Formulario: reformateo del monto al salir, validación al enviar y foco al primer campo inválido.
- Antigravity en Windows pide permiso para comandos con argumentos aunque su prefijo esté en la lista y en el hook (git log, git diff, npx vitest run...). Usar Claude Code para ciclos largos de apply. Revisar si una versión futura respeta el allow del hook.
- Cabecera compartida de la app (marca, navegación, cerrar sesión) y retirar el nav provisional del panel; "Por dónde empezar" es estático y lo sustituye el dashboard.

## Producto
- Editar y eliminar movimientos (HU-005).
- Interfaz de subcategorías, si no cabe en el plazo.
- Posible migración de Auth.js a Better Auth (Auth.js está en modo de mantenimiento).

## Entrega final
- Playwright (E2E), GitHub Actions, despliegue en Vercel + Neon y `prompts.md`.

## Guardia
- Permitir que el agente cree migraciones nuevas en prisma/migrations/ y bloquear solo editar las existentes (hoy las crea el humano).

## Despliegue
- Comprobar que la extensión `citext` (nombres de categoría sin distinguir mayúsculas) esté disponible en Neon antes de migrar.
