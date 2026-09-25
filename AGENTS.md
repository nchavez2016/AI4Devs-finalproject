Este archivo sigue el estándar abierto AGENTS.md y da contexto y reglas a los agentes de IA del IDE (Antigravity y compatibles). Su contenido está alineado con CLAUDE.md; si editas las reglas, actualiza ambos archivos para mantenerlos coherentes.

1. Qué es este proyecto

Cuadre es una aplicación web de control de gastos e ingresos. El usuario registra el dinero que entra y sale, lo clasifica por categorías, y ve en un dashboard su saldo por cuenta, el balance del período y sus mayores gastos.

Es el proyecto final del curso AI4Devs, en fase de MVP acotado. Respeta ese alcance: no agregues módulos ni funcionalidades fuera de los listados abajo.

2. Stack tecnológico (no cambiar sin autorización)
Framework: Next.js (App Router) con TypeScript.
Estilos: Tailwind CSS + shadcn/ui.
ORM: Prisma.
Base de datos: PostgreSQL (local vía Docker en desarrollo; Neon en producción).
Autenticación: Auth.js (NextAuth) con credenciales propias. Contraseñas con hash.
Validación: Zod en el servidor.
Gráficos: Recharts.
Tests: Vitest (unitarios/integración) y Playwright (E2E).
Despliegue: Vercel (app) + Neon (base de datos).

Proyecto monolítico full-stack: frontend y backend en el mismo proyecto Next.js. NO crear carpetas separadas frontend/ y backend/.

3. Alcance del MVP (lo único que se construye ahora)

Must-have:

HU-001 Registrar transacción (ingreso/gasto) con monto, fecha, cuenta, categoría.
HU-002 Gestionar cuentas (crear, listar; saldo por cuenta).
HU-003 Dashboard: saldo, ingresos/gastos del período, principales gastos.
HU-004 Categorizar transacciones (categorías y subcategorías).

Should-have (solo si el núcleo está estable):

HU-005 Editar y eliminar transacciones.

Transversal:

Registro e inicio de sesión (Auth.js). En el registro, el usuario indica el nombre de su negocio o actividad (campo del usuario).

Fuera de alcance (NO construir): ahorros, presupuestos, préstamos/deudas, tarjetas de crédito, suscripciones, asistente de IA.

4. Modelo de datos (4 entidades)
Usuario: id, nombre, nombre_negocio, email (único), password_hash, creado_en.
Cuenta: id, usuario_id (FK), nombre, tipo, saldo_inicial, creado_en.
Categoria: id, usuario_id (FK), categoria_padre_id (FK nullable), nombre, tipo (ingreso/gasto), creado_en.
Transaccion: id, usuario_id (FK), cuenta_id (FK), categoria_id (FK), tipo (INGRESO/GASTO), monto (decimal), fecha, descripcion (nullable), creado_en.

Reglas:

Normalizado a 3FN. No almacenar datos derivados (la transacción guarda cuenta_id, no el nombre de la cuenta).
El saldo de una cuenta se calcula (saldo_inicial + ingresos − gastos); no se almacena.
5. Arquitectura y organización del código
Patrón repositorio: el acceso a datos pasa por repositorios que encapsulan Prisma (ej. TransaccionRepository). La lógica de negocio nunca llama a Prisma directamente.
Aislamiento por usuario: toda consulta se filtra por el usuario autenticado. Un usuario nunca accede a datos de otro. Es la regla de seguridad principal.
Carpetas:
app/ — páginas y app/api/ (endpoints).
components/ — UI reutilizable.
server/ — lógica de negocio; server/repositories/ — acceso a datos.
lib/ — utilidades (Prisma, Auth.js).
prisma/ — schema y migraciones.
6. Cómo trabajar (rol del IDE Antigravity)

Antigravity se usa para el trabajo fino y de precisión: entender el código, ediciones puntuales, ajustes, revisión de lo que produce Claude Code. Para tareas grandes y autónomas (crear módulos completos, scaffold) se usa Claude Code.

Disciplina:

Una tarea a la vez. No adelantar módulos futuros ni añadir extras.
Explicar antes de cambios grandes que toquen varios archivos.
Mostrar cómo probar lo implementado.
Tests: acompañar la lógica con pruebas; no alterar tests para forzar que pasen sin autorización.
No tocar .env ni credenciales; documentar variables en .env.example.
Nombres del dominio en español (Usuario, Cuenta, Transaccion).
Commits pequeños y descriptivos.
7. Definición de "terminado"
Cumple los criterios de aceptación de la historia.
Respeta aislamiento por usuario y valida con Zod.
Tiene pruebas del caso feliz y de errores principales.
Se explicó cómo probarlo.
No rompe lo existente.