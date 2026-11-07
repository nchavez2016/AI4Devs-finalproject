# Despliegue de Cuadre (Vercel + Neon)

Guía para publicar la app y comprobar la integración continua. Los pasos de este documento los
hace una persona: crean cuentas y cargan secretos en paneles externos.

## Requisitos

- Node 24.x (`engines` de `package.json`; Vercel lo toma de ahí).
- Cuenta en Neon, en Vercel y acceso al repositorio de GitHub.

## 1. Base de datos en Neon

1. Crea un proyecto en Neon con PostgreSQL 16.
2. Copia **dos** cadenas de conexión del panel (ambas con `sslmode=require`):
   - **Pooled** (el host lleva `-pooler`): es la que usa la app en Vercel.
   - **Directa** (sin `-pooler`): la usas desde tu máquina para migrar y sembrar.

## 2. Migraciones en producción (a mano)

Las migraciones **no** corren en el build de Vercel (también se construyen las previews y
migrarían producción). Se aplican desde tu máquina con la URL directa, exportada solo en esa
terminal (no la escribas en `.env`). En PowerShell:

```powershell
$env:DATABASE_URL = "<URL directa de Neon>"
```

```
npx prisma migrate deploy
```

Hazlo **antes** de subir una rama que incluya migraciones nuevas. `prisma.config.ts` toma la URL de
`DATABASE_URL`, por eso no hace falta otra variable.

## 3. Datos de demostración (seed)

Con la misma terminal (URL directa exportada), confirma el nombre de la base de Neon y siembra.
`AUTH_SECRET` también debe existir (cualquier valor de 32+ caracteres; el seed no firma sesiones):

```powershell
$env:AUTH_SECRET = "<32+ caracteres>"
$env:SEED_CONFIRMAR_BASE = "<nombre de la base de Neon, p. ej. neondb>"
```

```
npm run db:seed
```

Si `SEED_CONFIRMAR_BASE` falta o no coincide con el nombre de la base de la URL, el seed se
detiene sin tocar nada. Crea al usuario revisor:

| Campo | Valor |
|---|---|
| Email | `revisor@cuadre.test` |
| Contraseña | `Revisor2026!` |
| Negocio | `Negocio de prueba` |

**Importante:** los movimientos de ejemplo se fechan en el mes en curso (cuatro el día 1 y uno el
día 15 del mes anterior). **Vuelve a ejecutar el seed el día de la entrega** para que el panel, que
por defecto muestra el mes actual, tenga datos. Es idempotente: repetirlo restablece al revisor y
borra lo que haya creado, sin tocar a otros usuarios. El seed nunca corre en el build ni en los tests.

## 4. Vercel

1. Importa el repositorio en Vercel.
2. En *Settings → Git*, define `final-project-NCH` como **rama de producción**.
3. En *Settings → Environment Variables* (Production) carga:
   - `DATABASE_URL`: la URL **pooled** de Neon.
   - `AUTH_SECRET`: un secreto propio de 32+ caracteres
     (`node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`).
4. Comprueba que el proyecto usa Node 24.x. El comando de build es el de `package.json`
   (`prisma generate && next build`); no hay que cambiarlo.

Las dos variables deben estar cargadas **antes** del primer despliegue: `next build` valida la
configuración y falla si faltan.

## 5. Comprobación

1. `git push` de la rama `final-project-NCH`.
2. En GitHub → *Actions*: el workflow `CI` termina en verde; el informe de Playwright queda como
   artefacto `playwright-report`.
3. Abre la URL de Vercel, entra con el usuario revisor y verifica que el panel muestra datos.

## Integración continua

`.github/workflows/ci.yml` corre en cada push y pull request: Postgres 16 como servicio,
`npm ci`, `prisma generate`, lint, `typecheck`, `test:run`, instalación de Chromium y `test:e2e`
(el build de la app lo hace el `webServer` de Playwright; se reintenta 2 veces solo en CI). No
necesita secretos: usa una base y un `AUTH_SECRET` ficticios.
