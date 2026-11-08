# Cuadre — Control de gastos e ingresos

[![CI](https://github.com/nchavez2016/AI4Devs-finalproject/actions/workflows/ci.yml/badge.svg?branch=final-project-NCH)](https://github.com/nchavez2016/AI4Devs-finalproject/actions/workflows/ci.yml?query=branch%3Afinal-project-NCH)

## Estado del proyecto (Entrega final, 11 de noviembre de 2026)

| Funcionalidad | Estado |
|---|---|
| Registro e inicio de sesión | ✅ Implementado |
| Gestión de cuentas | ✅ Implementado |
| Gestión de categorías | ✅ Implementado |
| Registro de transacciones | ✅ Implementado (alta, listado y filtros; sin editar ni eliminar) |
| Dashboard | ✅ Implementado (totales del período, saldos por cuenta y categorías de gasto) |
| Despliegue (Vercel + Neon) | ✅ Publicado en https://cuadre-ashy.vercel.app |
| Integración continua (GitHub Actions) | ✅ Lint, typecheck, tests unitarios, de integración y E2E en cada push |
| Pruebas E2E (Playwright) | ✅ Flujo principal, acceso sin sesión y aislamiento entre usuarios |

**Pendiente:** editar y eliminar transacciones (HU-005, should-have).

## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)
8. [Flujo de trabajo con IA y arnés](#8-flujo-de-trabajo-con-ia-y-arnés)

---

## 0. Ficha del proyecto

### 0.1. Tu nombre completo:
Napoleón Chávez

### 0.2. Nombre del proyecto:
Cuadre

### 0.3. Descripción breve del proyecto:
Cuadre es una aplicación web de control de gastos e ingresos para quien
necesita controlar el dinero que entra y sale de su negocio o actividad.
Reemplaza las hojas de cálculo por una herramienta simple: registrar un
movimiento toma segundos, y un panel muestra de un vistazo el saldo por cuenta,
el flujo del período y en qué se está yendo el dinero. El MVP cubre un flujo
financiero completo, con una arquitectura ordenada que deja espacio para crecer
en el futuro.

### 0.4. URL del proyecto:
https://cuadre-ashy.vercel.app

Credenciales de prueba y recorrido en [1.5](#15-cómo-probar-el-mvp).

Integración continua (rama `final-project-NCH`):
https://github.com/nchavez2016/AI4Devs-finalproject/actions/workflows/ci.yml?query=branch%3Afinal-project-NCH

### 0.5. URL o archivo comprimido del repositorio:
https://github.com/nchavez2016/AI4Devs-finalproject

---

## 1. Descripción general del producto

### 1.1. Objetivo:

Dar a quien necesita controlar sus gastos e ingresos una forma clara y
confiable de saber en qué se va su dinero. Hoy muchas personas y negocios
pequeños llevan sus movimientos en cuadernos o en hojas de Excel que se
descuadran con facilidad, y viven con la incertidumbre de no saber si realmente
ganan o pierden. Cuadre convierte ese desorden en algo entendible: registrar un
movimiento es rápido, y el usuario ve al instante su saldo por cuenta, cuánto
entró y salió en el período, y cuáles son sus mayores gastos.

El valor central es **claridad y control**: menos tiempo peleando con fórmulas y
más certeza para tomar decisiones. El usuario objetivo es cualquier persona que
gestiona el dinero de su negocio o actividad y necesita una herramienta más viva
y confiable que una hoja de cálculo, pero más simple que un sistema contable
completo.

### 1.2. Características y funcionalidades principales:

Cada funcionalidad se marca con una etiqueta de alcance: **[MVP]** si se
implementa en este proyecto, o **[DOCUMENTADO]** si se describe para dar contexto
del producto pero queda fuera del alcance de esta entrega. Dentro del MVP, el
estado real a fecha de la Entrega final, 11 de noviembre de 2026, se marca con
✅ (implementado) o ⏳ (pendiente).

- **[MVP] ✅ Registro y acceso de usuario.** El usuario crea una cuenta e inicia
  sesión; sus datos financieros son privados y solo él los ve. Al registrarse
  puede dar un nombre a su negocio o actividad, que identifica su espacio de
  trabajo.
- **[MVP] ✅ Gestión de cuentas.** El usuario crea y administra sus cuentas de
  dinero (por ejemplo banco, efectivo, billetera digital), para saber cuánto
  tiene disponible en cada una. El saldo se calcula: saldo inicial más ingresos
  menos gastos de esa cuenta.
- **[MVP] ✅ Registro de transacciones.** El usuario registra un ingreso o un
  gasto, asociándolo a una cuenta, una categoría, un monto y una fecha, y lista
  sus movimientos con filtros básicos (fechas, tipo y cuenta). Editar y eliminar
  movimientos (HU-005) queda pendiente.
- **[MVP] ✅ (parcial) Categorización.** El usuario ya puede crear y consultar
  sus categorías de ingreso y de gasto (de primer nivel; las subcategorías
  quedan fuera de esta entrega) y asignar una a cada transacción, que debe ser
  del mismo tipo que la transacción.
- **[MVP] ✅ Dashboard.** Una pantalla de resumen muestra el saldo actual de
  cada cuenta, el total de ingresos y gastos del período (hoy, semana o mes) y
  las principales categorías de gasto, todo calculado automáticamente a partir
  de las transacciones.

Estas funcionalidades corresponden a las historias de usuario priorizadas que se
detallan en la sección 5.

**Capacidades documentadas para versiones futuras.** Para mantener el MVP acotado
y bien ejecutado, las siguientes capacidades se dejan descritas como visión de
producto, pero no se implementan en esta entrega. La arquitectura se diseña sin
cerrarles la puerta:

- **[DOCUMENTADO]** Metas de ahorro, presupuestos con alertas, préstamos y
  deudas, y tarjetas de crédito.
- **[DOCUMENTADO]** Planes de suscripción y cobro.
- **[DOCUMENTADO]** Un asistente de IA que dé recomendaciones a partir de los
  datos del propio negocio.

### 1.3. Diseño y experiencia de usuario:

El flujo principal del usuario es directo: se registra e inicia sesión, crea al
menos una cuenta de dinero, registra sus primeros ingresos y gastos
clasificándolos por categoría, y a partir de ahí el dashboard le devuelve una
lectura inmediata de su situación —saldo por cuenta, balance del período y sus
mayores gastos.

La experiencia busca sentirse tan ágil como una hoja de cálculo pero sin su
fragilidad: capturar un movimiento debe tomar segundos, y los números del
resumen se actualizan solos sin fórmulas que se rompan.

Capturas del panel a la Entrega final, 11 de noviembre de 2026, generadas por la prueba E2E del flujo principal
(`E2E_EVIDENCIA=1 npm run test:e2e`, ver `.env.example`):

| Vista | Captura |
|---|---|
| Panel en móvil (360 px) | ![Panel a 360 px](docs/evidencias/e2e/panel-360.png) |
| Panel en escritorio (1280 px) | ![Panel a 1280 px](docs/evidencias/e2e/panel-1280.png) |

### 1.4. Instrucciones de instalación:

Pasos comprobados contra `package.json` y `docker-compose.yml`, coherentes con la
arquitectura de la sección 2:

1. **Requisitos previos:** Node.js 24.x (`engines` de `package.json`) y Docker instalados.
2. **Clonar el repositorio** (rama de la entrega final, `final-project-NCH`) e instalar dependencias:
   ```
   git clone --branch final-project-NCH https://github.com/nchavez2016/AI4Devs-finalproject.git
   cd AI4Devs-finalproject
   npm install
   ```
   El proyecto es una única aplicación Next.js (no hay carpetas de frontend y
   backend por separado).
3. **Levantar la base de datos local** con Docker:
   ```
   docker compose up -d
   ```
   Arranca un contenedor `cuadre-db` con PostgreSQL 16 en el puerto 5432
   (usuario, contraseña y base `cuadre`, definidos en `docker-compose.yml`).
4. **Configurar variables de entorno** copiando `.env.example` a `.env`:
   - `DATABASE_URL`: ya viene lista para la base local de Docker, no hace falta
     tocarla en desarrollo.
   - `AUTH_SECRET`: obligatorio, mínimo 32 caracteres. Se genera con:
     ```
     node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
     ```
5. **Aplicar las migraciones** con Prisma:
   ```
   npx prisma migrate deploy
   npx prisma generate
   ```
   `migrate deploy` aplica las migraciones existentes sin crear nuevas ni hacer
   preguntas; `migrate dev` queda para quien desarrolla cambios de esquema.
   Opcional: crea al usuario revisor con cuentas y movimientos de ejemplo (ver 1.5).
   El seed exige confirmar el nombre de la base. En PowerShell:
   ```
   $env:SEED_CONFIRMAR_BASE = "cuadre"
   npm run db:seed
   ```
   Sin seed, la base queda vacía y cada usuario se registra. El seed toma como
   referencia el día de hoy en Ecuador y crea 5 movimientos: 4 el día 1 del mes en
   curso y 1 ingreso de 800.00 el día 15 del mes anterior (este último solo cuenta
   para el saldo de la cuenta, no para el panel del mes). Por eso, **vuelve a
   ejecutarlo al empezar un mes nuevo** para que el panel, que por defecto muestra el
   mes actual, tenga datos. Es idempotente: repetirlo restablece al revisor y borra lo
   que haya creado, sin tocar a otros usuarios.
6. **Arrancar la aplicación:**
   ```
   npm run dev
   ```
   Queda disponible en `http://localhost:3000`.

En desarrollo se usa PostgreSQL local (vía Docker); en producción (Vercel + Neon,
ver `docs/despliegue.md`) la misma aplicación usa la URL *pooled* de Neon con
`sslmode=require` como `DATABASE_URL`, más su propio `AUTH_SECRET`. Las
migraciones de producción se aplican a mano con la URL directa de Neon; no corren
en el build.

**Verificaciones y tests** (verificado en `package.json`, `vitest.config.mts` y
`playwright.config.ts`). Con la base de Docker levantada:

```
npm run lint
```

```
npm run typecheck
```

```
npm run test:run
```

- `lint` ejecuta ESLint y `typecheck` genera los tipos de rutas de Next.js
  (`next typegen`) y ejecuta `tsc --noEmit`.
- `test:run` ejecuta **unitarios e integración** con Vitest. Las pruebas unitarias
  (`*.test.ts(x)`) corren con variables de entorno ficticias y no tocan una base de
  datos real. Las de integración (`*.int.test.ts`) necesitan una base PostgreSQL de
  prueba llamada por defecto `cuadre_test`, que se crea y migra sola; se puede
  apuntar a otra con la variable de entorno `TEST_DATABASE_URL` (debe terminar en
  `_test`).

**Tests E2E (Playwright).** La primera vez, instala el navegador:

```
npx playwright install chromium
```

```
npm run test:e2e
```

Playwright construye la app (`npm run build`), la arranca en el puerto 3100 contra
su propia base `cuadre_e2e_test` (se crea y migra sola, en el mismo servidor que
`TEST_DATABASE_URL`) y corre 3 escenarios —flujo principal, acceso sin sesión y
aislamiento entre usuarios— en escritorio y en móvil a 360 px. No necesita
variables nuevas: el `AUTH_SECRET` de la app E2E es ficticio y está en
`playwright.config.ts`. Con `E2E_EVIDENCIA=1` guarda capturas del panel en
`docs/evidencias/e2e/`.

Las mismas verificaciones corren en GitHub Actions en cada push y pull request
(`.github/workflows/ci.yml`); ver 2.4 y 2.6.

### 1.5. Cómo probar el MVP:

**Dónde probar.** La app está publicada en **https://cuadre-ashy.vercel.app**, con
el usuario revisor ya sembrado. Como alternativa, se puede correr en local
(`http://localhost:3000`, ver 1.4) después de ejecutar `npm run db:seed`.

**Credenciales de prueba** (usuario revisor creado por el seed):

| Campo | Valor |
|---|---|
| Email | `revisor@cuadre.test` |
| Contraseña | `Revisor2026!` |
| Nombre del negocio | `Negocio de prueba` |

El revisor tiene 2 cuentas (Banco Pichincha, saldo inicial 500.00; Caja chica,
saldo inicial 300.00), las 7 categorías por defecto (5 de gasto y 2 de ingreso) y 5
movimientos de ejemplo: 4 el día 1 del mes en curso y 1 el día 15 del mes anterior.
Volver a ejecutar el seed restablece estos datos y borra lo que haya creado el
revisor.

**Recorrido sugerido.** Los importes se muestran con formato local (por ejemplo,
`$1.200,00`).

*Acceso*

1. Abre https://cuadre-ashy.vercel.app e inicia sesión con las credenciales de
   arriba. Entras directo al **Panel**, con el nombre del negocio
   ("Negocio de prueba") y la navegación a Panel, Transacciones, Cuentas y
   Categorías.

*Panel (período "mes", el que se abre por defecto)*

2. Comprueba los totales del mes en curso: **ingresos 1200.00**, **gastos 571.00** y
   **balance 629.00**. El ingreso de 800.00 del mes anterior no cuenta aquí.
3. En **Saldos por cuenta**: **Banco Pichincha 2100.00** y **Caja chica 129.00**
   (saldo inicial más ingresos menos gastos de todas las fechas).
4. En **Categorías de gasto**: Arriendo 400.00, Insumos 150.75 y Transporte 20.25,
   de mayor a menor, con su tabla alternativa al gráfico.
5. Cambia el período a **hoy** o **semana**: los totales se recalculan y el período
   viaja en la URL (`/panel?periodo=semana`).

*Transacciones*

6. Entra a **Transacciones**. El listado muestra los 5 movimientos del revisor, del
   más reciente al más antiguo.
7. Registra un gasto: tipo gasto, monto `25.50`, categoría Insumos, cuenta Caja
   chica y la fecha que propone el formulario (hoy). Pulsa **Guardar transacción**:
   aparece el aviso de confirmación y el movimiento sale en el listado.
8. Intenta guardar otro con monto `0`: el formulario lo rechaza con un mensaje junto
   al campo y no crea nada.
9. Filtra por tipo **Gasto** o por la cuenta **Caja chica**: el listado y la URL
   reflejan el filtro.
10. Vuelve al **Panel**: los gastos del mes suben a 596.50, el balance baja a 603.50
    y Caja chica queda en 103.50.

*Cuentas y categorías*

11. Entra a **Cuentas** y crea una, por ejemplo "Cooperativa Andina", tipo banco,
    con saldo inicial 500.00. Intenta crear otra con el mismo nombre (sin distinguir
    mayúsculas): el formulario rechaza el duplicado con un mensaje junto al campo.
12. Entra a **Categorías** y confirma que existen las 7 por defecto (Arriendo,
    Insumos, Otros, Servicios básicos, Transporte, Otros ingresos, Ventas). Crea
    "Publicidad" de tipo gasto e intenta repetirla: se rechaza igual que con las
    cuentas.
13. Cierra sesión y confirma que vuelves al login. Abrir `/panel` sin sesión
    también lleva al login.

**Sin seed.** Si la base está vacía, entra a **Registro** y crea tu usuario: el
registro crea automáticamente tus 7 categorías por defecto y el panel muestra el
estado vacío, con una invitación a registrar la primera transacción.

---

## 2. Arquitectura del sistema

### 2.1. Diagrama de arquitectura:

Cuadre es una aplicación web construida sobre Next.js, que aloja en un solo
proyecto tanto la interfaz de usuario (frontend) como la lógica de servidor
(backend, vía API Routes / Server Actions). Los datos se guardan en una base de
datos PostgreSQL, a la que se accede mediante el ORM Prisma. La autenticación de
usuarios se gestiona con Auth.js (NextAuth). El despliegue es en Vercel, con la
base de datos alojada en Neon (PostgreSQL gestionado en la nube).

```mermaid
graph TB
    Usuario["👤 Usuario<br/>(navegador)"]

    subgraph Vercel["Vercel (hosting)"]
        subgraph NextApp["Aplicación Next.js"]
            UI["Frontend<br/>React + Tailwind + shadcn/ui"]
            API["Backend<br/>API Routes / Server Actions"]
            Auth["Auth.js (NextAuth)<br/>sesión y login"]
        end
    end

    subgraph Datos["Neon (PostgreSQL en la nube)"]
        Prisma["Prisma ORM"]
        DB[("Base de datos<br/>PostgreSQL")]
    end

    Usuario -->|HTTPS| UI
    UI -->|llamadas internas| API
    API --> Auth
    API --> Prisma
    Prisma --> DB
```

**Patrón arquitectónico.** Cuadre sigue una **arquitectura monolítica modular en
capas** dentro de un único proyecto Next.js (lo que se conoce como aplicación
full-stack "fullstack framework"). Se eligió este patrón, y no microservicios ni
un backend separado, por tres razones concretas para este proyecto:

- **Un solo desarrollador, plazo corto.** Mantener frontend y backend en un mismo
  proyecto reduce la cantidad de piezas que configurar, desplegar y depurar.
- **Menos superficie de error.** No hay que coordinar CORS, dos despliegues, ni
  contratos entre servicios separados; el frontend llama a su propio backend.
- **Capa gratuita de punta a punta.** Vercel + PostgreSQL gestionado permiten
  desplegar el MVP sin costo inicial mientras el uso sea bajo.

**Beneficios.** Velocidad de desarrollo, despliegue simple (cada push a la rama
de producción, `final-project-NCH`, se publica solo), y un stack muy documentado
que la IA conoce bien.

**Sacrificios / limitaciones asumidas.** Un monolito escala de forma menos
granular que los microservicios: si en el futuro un módulo (por ejemplo, un
agente de IA) necesitara escalar por separado, habría que extraerlo. Para el
alcance del MVP esta limitación no es relevante, y el diseño en capas facilita
esa extracción más adelante.

### 2.2. Descripción de componentes principales:

**Frontend (React + Tailwind CSS).** Es la capa que ve el usuario: las pantallas
de login, registro, panel, transacciones, cuentas y categorías, construidas con
componentes propios (`src/components/ui/`) y Tailwind para los estilos. De
shadcn/ui se incorporó solo el componente `Sheet` (`src/components/ui/sheet.tsx`,
sobre `@radix-ui/react-dialog`), adaptado a los tokens del sistema de diseño; lo
usa el menú de navegación en móvil.
El gráfico de categorías de gasto del dashboard se dibuja con Recharts (versión
exacta `3.10.1`) y siempre tiene una alternativa en tabla.

**Backend (Next.js API Routes / Server Actions).** Es la lógica de servidor:
recibe las peticiones del frontend, valida los datos, aplica las reglas de
negocio (por ejemplo, que una cuenta o categoría pertenezca al usuario
autenticado) y habla con la base de datos a través de Prisma. Aquí también se
calculan los totales y agregados que alimentan el dashboard.

**Autenticación (Auth.js / next-auth v5 beta, versión exacta `5.0.0-beta.32`).**
Gestiona el registro, el inicio de sesión y la sesión activa del usuario. Cada
petición al backend se asocia a un usuario autenticado, y ese identificador es
el que garantiza que cada persona solo vea sus propios datos.

**Capa de datos (Prisma + PostgreSQL).** Prisma es el traductor entre el código y
la base de datos: define el esquema (las tablas y relaciones) en un solo archivo
y genera las consultas de forma segura y tipada. PostgreSQL es el motor donde
viven realmente los datos (usuarios, cuentas, categorías, transacciones).

**Capa de repositorios (patrón Repository).** Entre la lógica de negocio y Prisma
se interpone una capa de repositorios: piezas cuya única responsabilidad es leer
y escribir datos (por ejemplo, `TransaccionRepository` con operaciones como
"crear", "listar por usuario", "sumar por categoría"). La lógica de negocio nunca
llama a Prisma directamente, sino que pide los datos al repositorio. Esto aporta
dos ventajas concretas: (1) si cambia el origen de datos —o se necesita un
repositorio simulado con datos de prueba para una demostración sin base de datos
real— solo cambia el repositorio, no el resto del sistema; y (2) facilita las
pruebas, porque se puede sustituir el repositorio real por uno de prueba sin
levantar una base de datos. Es el mismo patrón que emplean los proyectos de
referencia del curso con este stack.

### 2.3. Descripción de alto nivel del proyecto y estructura de ficheros:

El proyecto sigue la estructura estándar de una aplicación Next.js (App Router),
organizada por responsabilidad. Estructura actual, verificada con `git
ls-files` (solo directorios y archivos clave; se omiten tests y archivos
generados):

```
cuadre/
├── prisma/
│   ├── migrations/              # Migraciones aplicadas (no se editan a mano)
│   └── schema.prisma            # Definición del modelo de datos
├── src/
│   ├── app/
│   │   ├── (privado)/
│   │   │   ├── panel/           # Panel: dashboard financiero ✅
│   │   │   ├── transacciones/   # Registro y listado de transacciones ✅
│   │   │   ├── cuentas/         # Gestión de cuentas ✅
│   │   │   └── categorias/      # Gestión de categorías ✅
│   │   ├── login/                ✅
│   │   ├── registro/             ✅
│   │   └── api/auth/[...nextauth]/route.ts  ✅
│   ├── components/
│   │   ├── navegacion/           # Cabecera, navegación y menú móvil ✅
│   │   ├── formularios/          # Utilidades compartidas de formularios ✅
│   │   └── ui/                   # Button, Campo, Importe, Selector, Tarjeta, Sheet ✅
│   ├── config/env.ts            # Validación de variables de entorno ✅
│   ├── server/
│   │   ├── auth/                 ✅
│   │   ├── cuentas/               ✅
│   │   ├── categorias/            ✅
│   │   ├── transacciones/         ✅
│   │   ├── dashboard/             # Cálculos del panel ✅
│   │   ├── semilla/               # Datos y lógica del seed del revisor ✅
│   │   └── repositories/         # Acceso a datos: encapsula Prisma ✅
│   ├── test/                     # Fixtures y BD de prueba (Vitest y E2E) ✅
│   └── proxy.ts                  # Antes "middleware.ts" en Next.js 16 ✅
├── e2e/                          # Pruebas E2E con Playwright ✅
├── scripts/db-seed.ts            # Seed del usuario revisor (npm run db:seed) ✅
├── docs/
│   ├── despliegue.md             # Guía de despliegue en Vercel + Neon ✅
│   ├── evidencias/e2e/           # Capturas generadas por el E2E ✅
│   └── diseno/sistema/           # Tokens y sistema de diseño ✅
├── openspec/                     # Specs y changes (OpenSpec) ✅
├── .github/workflows/ci.yml      # Integración continua (GitHub Actions) ✅
├── playwright.config.ts          ✅
├── docker-compose.yml            ✅
├── .env.example                  ✅
└── readme.md
```

El dashboard vive en `panel/` (pantalla) y `server/dashboard/` (cálculos). La separación clave es: `app/` contiene las pantallas y
los endpoints; `server/` contiene la lógica de negocio y, dentro de
`server/repositories/`, la capa de acceso a datos que encapsula Prisma (patrón
Repository); `prisma/` define el modelo de datos. Esto mantiene la lógica
separada tanto de la presentación como del acceso a datos, de modo que una nueva
pantalla —o el reemplazo del origen de datos por uno simulado para pruebas— no
obliga a tocar el resto del sistema.

### 2.4. Infraestructura y despliegue:

```mermaid
graph LR
    Dev["Desarrollador"] -->|git push| GH["GitHub<br/>(repositorio)"]
    GH -->|CI: tests| Actions["GitHub Actions<br/>(ejecuta pruebas)"]
    GH -->|despliegue automático| Vercel["Vercel<br/>(app en producción)"]
    Vercel -->|conexión| DB[("PostgreSQL<br/>Neon")]
```

El flujo de despliegue es de integración y despliegue continuos (CI/CD): el
código vive en GitHub. (1) **GitHub Actions** corre en cada push y en cada pull
request, en cualquier rama: lint, typecheck, tests unitarios y de integración
contra un PostgreSQL 16 de servicio, y tests E2E con Playwright, cuyo informe queda
como artefacto (integración continua). (2) **Vercel** construye y publica la
aplicación cada vez que se sube la rama de producción, `final-project-NCH`
(despliegue continuo). La base de datos PostgreSQL está alojada en Neon (proveedor
gestionado en la nube) y la aplicación se conecta a ella mediante una variable de
entorno segura (`DATABASE_URL`, URL *pooled* con `sslmode=require`). Las
migraciones de producción no corren en el build: se aplican a mano antes de subir
una rama que las incluya (`docs/despliegue.md`). Este esquema cumple el requisito
de la entrega final de tener el proyecto desplegado y accesible por URL.

**Estado: GitHub Actions configurado (`.github/workflows/ci.yml`) y despliegue en
Vercel + Neon publicado en https://cuadre-ashy.vercel.app (guía en `docs/despliegue.md`).**


### 2.5. Seguridad:

Las prácticas de seguridad del MVP, apropiadas para una aplicación que maneja
datos financieros personales, son:

- **✅ Autenticación de usuarios.** El acceso requiere registro e inicio de
  sesión mediante Auth.js; las contraseñas se almacenan con hash (nunca en texto
  plano). Las rutas privadas exigen sesión iniciada.
- **✅ Aislamiento de datos por usuario.** Toda consulta al backend se filtra
  por el identificador del usuario autenticado (implementado en cuentas,
  categorías, transacciones y panel, y comprobado con pruebas de integración y con
  el E2E `e2e/aislamiento.spec.ts`), de modo que una persona nunca puede leer ni
  modificar datos de otra. Es el control de seguridad más importante del producto.
- **✅ Validación de entradas con Zod.** Cada dato que llega en el cuerpo de una
  petición (montos, nombres, tipos) se valida contra un esquema Zod en el
  servidor antes de aplicar la lógica de negocio, para rechazar datos corruptos o
  maliciosos.
- **✅ Protección contra inyección SQL.** El acceso a datos usa siempre consultas
  parametrizadas de Prisma; nunca se arma SQL concatenando texto del usuario.
- **✅ Protección contra XSS.** React escapa por defecto el contenido que se
  muestra, evitando la inyección de scripts en la interfaz.
- **✅ Variables sensibles fuera del código.** Credenciales de base de datos y
  claves de sesión se guardan como variables de entorno (`.env`, fuera del
  repositorio), y no se colocan datos sensibles en las URLs.
- **✅ Conexión cifrada en producción.** Vercel sirve la aplicación por HTTPS y la
  conexión con Neon exige TLS (`sslmode=require` en `DATABASE_URL`, ver
  `.env.example` y `docs/despliegue.md`).

### 2.6. Tests:

La estrategia de pruebas contempla tres niveles:

- **✅ Pruebas unitarias.** Verifican piezas aisladas de lógica de negocio y
  componentes (Vitest + Testing Library + jsdom), por ejemplo la validación de
  formularios y las acciones de cuentas y categorías.
- **✅ Pruebas de integración.** Verifican que las acciones del backend
  funcionen de extremo a extremo contra una base de datos PostgreSQL real de
  prueba (`*.int.test.ts`), por ejemplo crear una cuenta y comprobar su
  aislamiento por usuario.
- **✅ Pruebas de extremo a extremo (E2E).** Playwright (`@playwright/test`
  1.65.0, `playwright.config.ts`) contra la app construida en modo producción y una
  base propia `cuadre_e2e_test`. Tres escenarios en `e2e/`, cada uno en escritorio
  y en móvil a 360 px: el flujo principal (registro → cuenta → gasto → panel con
  totales, saldo y categorías), el acceso al panel sin sesión (lleva al login) y el
  aislamiento entre dos usuarios. Comando: `npm run test:e2e` (ver 1.4).

**✅ GitHub Actions.** `.github/workflows/ci.yml` corre en cada push y pull request:
`npm ci`, `prisma generate`, lint, typecheck, `test:run` y `test:e2e`, con
PostgreSQL 16 como servicio y el informe de Playwright como artefacto
`playwright-report` (ver 2.4). En local, el hook de pre-commit sigue corriendo
lint, typecheck y `test:run` antes de cada commit.

---

## 3. Modelo de datos

### 3.1. Diagrama del modelo de datos:

```mermaid
erDiagram
    USUARIO ||--o{ CUENTA : "posee"
    USUARIO ||--o{ CATEGORIA : "define"
    USUARIO ||--o{ TRANSACCION : "registra"
    CUENTA ||--o{ TRANSACCION : "agrupa"
    CATEGORIA ||--o{ CATEGORIA : "tiene subcategorías"
    CATEGORIA ||--o{ TRANSACCION : "clasifica"

    USUARIO {
        string id PK
        string nombre
        string nombre_negocio
        string email UK
        string password_hash
        datetime creado_en
    }

    CUENTA {
        string id PK
        string usuario_id FK
        string nombre
        string tipo
        decimal saldo_inicial
        datetime creado_en
    }

    CATEGORIA {
        string id PK
        string usuario_id FK
        string categoria_padre_id FK "nullable"
        string nombre
        string tipo
        datetime creado_en
    }

    TRANSACCION {
        string id PK
        string usuario_id FK
        string cuenta_id FK
        string categoria_id FK
        string tipo
        decimal monto
        date fecha
        string descripcion "nullable"
        datetime creado_en
    }
```

### 3.2. Descripción de entidades principales:

**USUARIO** — La persona dueña de los datos, que representa a su negocio o
actividad. Es la raíz de todo: cada cuenta, categoría y transacción pertenece a
un usuario.
- `id` (PK): identificador único del usuario.
- `nombre`: nombre de la persona. NOT NULL.
- `nombre_negocio`: nombre del negocio o actividad que el usuario gestiona (por
  ejemplo "Tienda Napo"). Da identidad de negocio al espacio de trabajo y se
  muestra en el dashboard. NOT NULL.
- `email` (UK): correo, único en el sistema. NOT NULL, UNIQUE.
- `password_hash`: contraseña almacenada como hash. NOT NULL.
- `creado_en`: fecha de alta. NOT NULL, DEFAULT ahora.
- Relaciones: 1:N con CUENTA, CATEGORIA y TRANSACCION.

> Decisión de modelo: en este MVP cada usuario representa un único negocio, y el
> nombre del negocio es un campo del propio usuario. No existe una entidad
> "Empresa" separada, lo que mantiene el modelo simple. El diseño permite
> introducir esa entidad en el futuro si se necesitara gestionar varios negocios,
> sin rehacer lo existente.

**CUENTA** — Un lugar donde el usuario tiene dinero (banco, efectivo, billetera
digital). Permite ver el saldo disponible por cada una.
- `id` (PK): identificador de la cuenta.
- `usuario_id` (FK → USUARIO): dueño de la cuenta. NOT NULL.
- `nombre`: nombre visible (por ejemplo "Banco Pichincha", "Efectivo"). NOT NULL,
  de tipo `citext` (sin distinguir mayúsculas), sin espacios al inicio ni al final,
  de 1 a 150 caracteres. ÚNICO por usuario: `(usuario_id, nombre)`.
- `tipo`: clasificación de la cuenta (por ejemplo banco, efectivo, digital).
- `saldo_inicial`: saldo con el que arranca la cuenta al crearla. DEFAULT 0. El
  saldo actual se calcula sumando este valor y todas sus transacciones.
- `creado_en`: fecha de creación. NOT NULL, DEFAULT ahora.
- Relaciones: N:1 con USUARIO; 1:N con TRANSACCION.

**CATEGORIA** — La clasificación de una transacción (por ejemplo "Ventas",
"Arriendo", "Servicios básicos"). Admite subcategorías mediante una relación
consigo misma (una categoría puede tener una categoría padre).
- `id` (PK): identificador de la categoría.
- `usuario_id` (FK → USUARIO): dueño de la categoría. NOT NULL.
- `categoria_padre_id` (FK → CATEGORIA): categoría padre, si es una subcategoría.
  NULLABLE (si es nulo, es una categoría de primer nivel).
- `nombre`: nombre de la categoría. NOT NULL, de tipo `citext` (sin distinguir
  mayúsculas), sin espacios al inicio ni al final, de 1 a 150 caracteres. ÚNICO por
  usuario y tipo: `(usuario_id, tipo, nombre)`.
- `tipo`: indica si aplica a ingresos o a gastos.
- `creado_en`: fecha de creación. NOT NULL, DEFAULT ahora.
- Relaciones: N:1 con USUARIO; auto-relación 1:N (subcategorías); 1:N con
  TRANSACCION.

**TRANSACCION** — El registro de un movimiento de dinero: el corazón del sistema.
Cada ingreso o gasto es una fila aquí, y de la suma de estas filas se calculan
todos los reportes y el dashboard.
- `id` (PK): identificador de la transacción.
- `usuario_id` (FK → USUARIO): dueño del movimiento. NOT NULL.
- `cuenta_id` (FK → CUENTA): cuenta afectada. NOT NULL.
- `categoria_id` (FK → CATEGORIA): categoría del movimiento. NOT NULL.
- `tipo`: INGRESO o GASTO. NOT NULL.
- `monto`: valor del movimiento, tipo decimal para precisión monetaria. NOT NULL,
  mayor que 0.
- `fecha`: fecha del movimiento. NOT NULL.
- `descripcion`: nota opcional. NULLABLE.
- `creado_en`: fecha de registro en el sistema. NOT NULL, DEFAULT ahora.
- Relaciones: N:1 con USUARIO, con CUENTA y con CATEGORIA.

**Nota de diseño.** El modelo está normalizado hasta la Tercera Forma Normal
(3FN): no hay grupos repetidos, todas las tablas tienen clave primaria simple (por
lo que no hay dependencias parciales), y no se almacenan datos derivados de otros
campos no clave (por ejemplo, la transacción guarda `cuenta_id`, no el nombre de
la cuenta), evitando redundancia y problemas de integridad. Además, el diseño deja
espacio para crecer sin rediseño: el campo `tipo` en la transacción permite añadir
más adelante valores como TRANSFERENCIA sin romper lo existente.

---

## 4. Especificación de la API

Las operaciones de transacciones no se exponen como endpoints REST: el frontend las
invoca como **Server Actions** de Next.js y la pantalla carga sus datos en el servidor,
con la misma separación en capas que cuentas y categorías (repositorio, esquemas Zod,
caso de uso, acción y pantalla). Todas exigen que el usuario esté autenticado y se
restringen a los datos del usuario de la sesión: el dueño nunca se toma de los datos
enviados. Sin sesión, la acción redirige a `/login`. El dashboard sigue la misma vía
(Consulta 3, abajo).

### Acción 1 — Registrar transacción

`registrarTransaccionAccion(estadoPrevio, formData)` en
`src/server/transacciones/acciones.ts`. Registra un nuevo ingreso o gasto del usuario
autenticado.

| Campo del formulario | Regla (validada con Zod en el servidor) |
|---|---|
| `tipo` | `INGRESO` o `GASTO`. Debe coincidir con el tipo de la categoría. |
| `monto` | Texto con punto o coma decimal y hasta 2 decimales; mayor que 0 y como máximo 999999999999.99. Se guarda como `Decimal`. |
| `fecha` | `AAAA-MM-DD`, un día que exista en el calendario. |
| `cuentaId` | Cuenta del usuario de la sesión. |
| `categoriaId` | Categoría del usuario de la sesión, del mismo tipo que la transacción. |
| `descripcion` | Opcional, máximo 255 caracteres; se guarda sin los espacios del inicio y del final. |

Una cuenta o una categoría de otro usuario se trata igual que una inexistente
("Elige una de tus cuentas" / "Elige una de tus categorías").

Resultado (estado del formulario):

```json
{ "exito": true, "idCreado": "trx_012",
  "creado": { "tipo": "GASTO", "monto": "25.50", "cuentaNombre": "Efectivo" } }
```

Con datos inválidos devuelve un error por campo y no crea nada:

```json
{ "errores": { "monto": ["El monto debe ser mayor que 0"] } }
```

Si el guardado falla por un error inesperado devuelve
`{ "mensaje": "No pudimos guardar la transacción. Inténtalo de nuevo.", "valores": { … } }`
para conservar lo escrito. Al registrar, el saldo de la cuenta cambia: saldo inicial
más ingresos menos gastos.

### Consulta 2 — Listar transacciones

`cargarTransacciones(parametrosDeUrl)` en `src/server/transacciones/pantalla.ts`, que usa
la página `/transacciones`. Devuelve las transacciones del usuario de la más reciente a
la más antigua (y, en el mismo día, de la última registrada a la primera), junto con sus
cuentas y categorías para el formulario. Los filtros viajan en la URL y son opcionales y
combinables; un valor inválido se ignora.

| Parámetro de la URL | Valor |
|---|---|
| `desde` | `AAAA-MM-DD`, incluida |
| `hasta` | `AAAA-MM-DD`, incluida |
| `tipo` | `INGRESO` o `GASTO` |
| `cuentaId` | Identificador de una cuenta del usuario; la de otro usuario no devuelve nada |

Ejemplo: `/transacciones?tipo=GASTO&desde=2026-09-01&hasta=2026-09-15`.

Cada transacción incluye `tipo`, `monto` (texto con 2 decimales), `fecha`, `descripcion` y el
nombre y el identificador de su cuenta y de su categoría.

### Consulta 3 — Resumen del dashboard

`cargarDashboard(parametrosDeUrl)` en `src/server/dashboard/pantalla.ts`, que usa la página
`/panel`. Devuelve el resumen del usuario autenticado para el período elegido, más el nombre de
su negocio. Sin sesión, redirige a `/login`. No hay endpoint REST: se carga en el servidor, como
las demás pantallas.

| Parámetro de la URL | Valor |
|---|---|
| `periodo` | `dia` (hoy), `semana` (de lunes a domingo de la semana de hoy) o `mes` (del día 1 al último día del mes de hoy). Por defecto `mes`; un valor inválido se trata como `mes`. |

Los límites del período son fechas calendario de Ecuador (America/Guayaquil), con ambos
extremos incluidos, y no dependen de la zona horaria del servidor. Los importes son texto con
2 decimales.

- `totalIngresos`, `totalGastos` y `balance` (ingresos menos gastos) cuentan solo el período.
- `saldosPorCuenta` es el saldo actual de cada cuenta (saldo inicial más ingresos menos gastos
  de todas las fechas); una cuenta sin movimientos muestra su saldo inicial.
- `topCategoriasGasto` lista como máximo 5 categorías con gastos en el período, de mayor a
  menor total y, a igual total, por nombre.

Ejemplo de `/panel?periodo=mes`:

```json
{
  "nombreNegocio": "Tienda Ana",
  "periodo": "mes",
  "hayTransacciones": true,
  "resumen": {
    "totalIngresos": "1200.00",
    "totalGastos": "780.50",
    "balance": "419.50",
    "saldosPorCuenta": [
      { "cuentaId": "cta_001", "nombre": "Banco", "saldo": "950.00" },
      { "cuentaId": "cta_002", "nombre": "Efectivo", "saldo": "120.00" }
    ],
    "topCategoriasGasto": [
      { "categoria": "Arriendo", "total": "400.00" },
      { "categoria": "Servicios básicos", "total": "180.50" }
    ]
  }
}
```

---

## 5. Historias de usuario

### Épicas (organización del backlog)

Las historias del MVP se agrupan en tres épicas, que son los grandes bloques de
capacidad del producto. Cada épica contiene una o más historias de usuario (HU),
y cada historia se descompondrá luego en tickets técnicos (sección 6).

| Épica | Descripción | Historias que agrupa |
|-------|-------------|----------------------|
| **E1 — Cuentas y acceso** | Registro, inicio de sesión y gestión de las cuentas de dinero del usuario. | HU-002 (Gestionar cuentas) + autenticación (transversal, TK-001) |
| **E2 — Gestión de movimientos** | Registro y clasificación del dinero que entra y sale. | HU-001 (Registrar transacción), HU-004 (Categorizar), HU-005 (Editar/eliminar) |
| **E3 — Visión financiera** | Lectura consolidada de la situación del negocio. | HU-003 (Dashboard) |

**Cómo se lee esta jerarquía:**

```
PRD (este documento)
 └── ÉPICA         (bloque grande de capacidad, ej. "Gestión de movimientos")
      └── HISTORIA (lo que el usuario quiere hacer, ej. "registrar un gasto")
           └── TICKET   (trabajo técnico para lograrlo, ej. "endpoint POST")
                └── TAREA    (paso concreto dentro del ticket)
```

Una **historia** describe QUÉ quiere el usuario (lenguaje de negocio); un
**ticket** describe CÓMO se construye (lenguaje técnico). Una misma historia
suele partirse en varios tickets —típicamente uno de base de datos, uno de
backend y uno de frontend—, como se detalla en la sección 6.

---

### Detalle de historias

Las historias siguen el formato estándar "Como / Quiero / Para" con criterios de
aceptación en formato Given/When/Then (Gherkin), que son directamente traducibles
a pruebas automatizadas. El MVP prioriza cuatro historias imprescindibles
(must-have) y una deseable (should-have). Para la documentación de la Entrega 1
se detallan las tres principales, como pide la plantilla.

> Nota de alcance: el registro e inicio de sesión (autenticación) se trata como
> una capacidad transversal, implementada en el scaffold inicial (ver Ticket
> TK-001), sobre la que se apoyan todas las historias siguientes, ya que cada
> operación se restringe a los datos del usuario autenticado. Durante el registro,
> el usuario indica el **nombre de su negocio o actividad**, que identifica su
> espacio de trabajo y se muestra en el dashboard.

### HU-001 — Registrar una transacción ✅ Implementado

**Como** persona que gestiona las finanzas de mi negocio
**quiero** registrar un ingreso o un gasto con su monto, fecha, cuenta y categoría
**para** mantener un control ordenado de todo el dinero que entra y sale.

**Prioridad:** Must-have
**Criterios de aceptación:**

```gherkin
Scenario: Registrar un gasto válido
  Given estoy autenticado y tengo al menos una cuenta y una categoría creadas
  When registro una transacción de tipo GASTO con monto 25.50, una fecha,
       una cuenta y una categoría válidas
  Then la transacción queda guardada y asociada a mi usuario
  And aparece en mi listado de transacciones
  And el saldo de la cuenta seleccionada disminuye en 25.50

Scenario: Rechazar una transacción con monto inválido
  Given estoy autenticado
  When intento registrar una transacción con monto 0 o negativo
  Then el sistema rechaza el registro
  And muestra un mensaje indicando que el monto debe ser mayor que cero

Scenario: Rechazar una transacción sin campos obligatorios
  Given estoy autenticado
  When intento registrar una transacción sin cuenta, sin categoría o sin fecha
  Then el sistema rechaza el registro
  And señala cuáles campos son obligatorios
```

---

### HU-002 — Gestionar mis cuentas ✅ Implementado (crear y listar)

**Como** persona que gestiona las finanzas de mi negocio
**quiero** crear y administrar mis cuentas de dinero (banco, efectivo, billetera
digital)
**para** saber cuánto tengo disponible en cada una y a dónde asignar cada
movimiento.

> Implementado: crear y listar cuentas, con nombre único por usuario y
> aislamiento entre usuarios. El saldo actual se calcula (saldo inicial más
> ingresos menos gastos), así que el escenario "Ver el saldo actualizado de una
> cuenta" de abajo también está cubierto.

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

---

### HU-003 — Ver el dashboard financiero ✅ Implementado

**Como** persona que gestiona las finanzas de mi negocio
**quiero** ver un panel de resumen con mi saldo, mis ingresos y gastos del
período y mis principales categorías de gasto
**para** entender de un vistazo la situación de mi negocio sin revisar cada
movimiento.

**Prioridad:** Must-have
**Criterios de aceptación:**

```gherkin
Scenario: Ver totales del período
  Given tengo transacciones registradas en el mes actual
  When abro el dashboard con el período "mes"
  Then veo el total de ingresos, el total de gastos y el balance (ingresos
       menos gastos) del mes

Scenario: Ver saldo por cuenta
  Given tengo varias cuentas con movimientos
  When abro el dashboard
  Then veo el saldo actual de cada una de mis cuentas

Scenario: Ver principales categorías de gasto
  Given tengo gastos registrados en distintas categorías
  When abro el dashboard
  Then veo mis categorías de gasto ordenadas de mayor a menor monto

Scenario: Dashboard sin datos
  Given soy un usuario nuevo sin transacciones
  When abro el dashboard
  Then veo los totales en cero y un mensaje que me invita a registrar mi
       primera transacción
```

---

### Historias adicionales del MVP (resumen)

- **HU-004 (Must-have) — Categorizar transacciones. ✅ Implementado (parcial)**
  Como usuario quiero crear categorías y subcategorías y asignarlas a mis
  transacciones, para analizar en qué gano y en qué gasto. (Habilita el
  desglose por categoría del dashboard.) Implementado: crear y listar
  categorías de primer nivel, únicas por usuario y tipo, y asignarlas a una
  transacción (la categoría debe ser del mismo tipo que la transacción). Las
  subcategorías quedan pendientes.
- **HU-005 (Should-have) — Editar y eliminar transacciones. ⏳ Pendiente** Como
  usuario quiero corregir o borrar un movimiento mal registrado, para mantener
  mis datos fiables. Se implementa solo si el núcleo del MVP está estable.

---

## 6. Tickets de trabajo

Los tickets descomponen las historias en unidades técnicas de trabajo. Se
presentan los tres principales exigidos por la plantilla, cubriendo las tres
capas del sistema: uno de configuración/base de datos, uno de backend y uno de
frontend. Cada ticket incluye su Definition of Done (DoD).

---

### TK-001 — Scaffold del proyecto, base de datos y autenticación ✅ Completo

**Tipo:** Configuración / Base de datos / Backend
**Prioridad:** Alta (bloquea todo lo demás)
**Historia relacionada:** capacidad transversal (habilita HU-001 a HU-005)

**Descripción:**
Inicializar el proyecto Next.js con TypeScript y Tailwind, configurar Prisma
contra PostgreSQL, traducir el modelo de datos (sección 3) a `schema.prisma`,
ejecutar la primera migración, y dejar funcionando el registro e inicio de sesión
de usuarios con Auth.js (next-auth v5 beta).

**Tareas técnicas:**
- Inicializar proyecto Next.js (App Router) + TypeScript + Tailwind.
- Configurar Prisma y la conexión a PostgreSQL mediante variable de entorno
  `DATABASE_URL`.
- Definir en `schema.prisma` las entidades Usuario, Cuenta, Categoria y
  Transaccion con sus relaciones (según sección 3).
- Ejecutar la migración inicial y verificar que las tablas existen.
- Integrar Auth.js con registro, login y hash de contraseñas.
- `proxy.ts` (equivalente a middleware en Next.js 16) que exija sesión iniciada
  en las rutas privadas.

**Definition of Done:**
- [x] El proyecto arranca en local con un solo comando documentado en el readme.
- [x] La migración de Prisma crea todas las tablas del modelo sin errores.
- [x] Un usuario puede registrarse, cerrar sesión y volver a iniciar sesión.
- [x] Las contraseñas se almacenan con hash (nunca en texto plano).
- [x] Una ruta privada redirige al login si no hay sesión activa.
- [x] Variables sensibles fuera del código, con un `.env.example` documentado.

---

### TK-002 — Transacciones: registrar y listar ✅ Implementado

**Tipo:** Backend y pantalla
**Prioridad:** Alta
**Historia relacionada:** HU-001

**Descripción:**
Implementar el registro y el listado de transacciones descritos en la sección 4, con
validación de datos en el servidor y aislamiento por usuario. Se hace con Server
Actions y una pantalla `/transacciones`, no con endpoints REST.

**Tareas técnicas:**
- Acción `registrarTransaccionAccion` que valide los datos de entrada con Zod
  (monto > 0, tipo INGRESO/GASTO, cuenta y categoría existentes y pertenecientes
  al usuario, categoría del mismo tipo, fecha válida).
- Listado con filtros opcionales por rango de fechas, tipo y cuenta, tomados de la URL.
- Caso de uso que asocie toda operación al usuario autenticado.
- Acceso a datos a través de un repositorio (`transaccionRepository`) que
  encapsula Prisma (patrón Repository).
- Saldo de cada cuenta calculado: saldo inicial más ingresos menos gastos.
- Errores por campo en el formulario; sin sesión se redirige a `/login`.

**Definition of Done:**
- [x] Se puede crear una transacción válida y recuperarla en el listado.
- [x] Una transacción con monto ≤ 0 o con campos faltantes se rechaza con un
      mensaje claro junto al campo.
- [x] Sin sesión se redirige a `/login`.
- [x] Un usuario nunca recibe transacciones de otro usuario.
- [x] Pruebas de integración que cubran los escenarios de HU-001 (caso válido,
      monto inválido, campos faltantes).
- PR enlazado a la historia HU-001: No aplica: entrega por rama, sin PR.

---

### TK-003 — Pantalla de dashboard ✅ Implementado

**Tipo:** Frontend
**Prioridad:** Alta
**Historia relacionada:** HU-003

**Descripción:**
Construir la pantalla de dashboard en `/panel`, que carga sus datos en el servidor
(Consulta 3, sección 4) y muestra los totales del período, el saldo por cuenta y las
principales categorías de gasto, con un estado vacío para usuarios nuevos.

**Tareas técnicas:**
- Maquetar la pantalla con los componentes propios de `src/components/ui/` (totales
  del período, lista de saldos, gráfico de categorías con Recharts y su tabla).
- Cargar los datos calculados en el servidor con `cargarDashboard`.
- Selector de período (día / semana / mes) en la URL.
- Estado vacío con mensaje que invita a registrar la primera transacción.
- Diseño responsivo (móvil y escritorio).

**Definition of Done:**
- [x] El dashboard muestra ingresos, gastos y balance correctos para el período
      seleccionado.
- [x] Muestra el saldo actual de cada cuenta.
- [x] Muestra las categorías de gasto ordenadas de mayor a menor.
- [x] Un usuario sin datos ve el estado vacío con el mensaje de invitación.
- [x] La pantalla se ve y funciona correctamente en móvil y escritorio (E2E en
      los proyectos `escritorio` y `movil-360`; capturas a 360 y 1280 px en
      `docs/evidencias/e2e/`).
- [x] Prueba E2E del flujo: registro, crear cuenta, registrar gasto y ver el
      dashboard actualizado (`e2e/flujo-principal.spec.ts`).
- PR enlazado a la historia HU-003: No aplica: entrega por rama, sin PR.

---

## 7. Pull requests

**La entrega se hace por rama, sin pull requests.** El código de la entrega final
está en la rama
[`final-project-NCH`](https://github.com/nchavez2016/AI4Devs-finalproject/tree/final-project-NCH),
que es también la rama de producción de Vercel. No se abrieron PR, así que esta
sección no enlaza ninguno.

La revisión que en otro flujo haría un PR se cubre así:

- **Changes de OpenSpec.** Cada funcionalidad nace como un *change* con propuesta,
  diseño, specs y tareas, que una persona revisa antes de aplicarlo. Los changes
  terminados quedan archivados en `openspec/changes/archive/`.
- **Un commit por subtarea** en formato Conventional Commits, con el test y el
  código juntos y la suite en verde (hook de pre-commit).
- **Integración continua** en cada push de la rama: lint, typecheck, tests
  unitarios, de integración y E2E (`.github/workflows/ci.yml`, insignia al inicio
  de este documento).

Ramas de las entregas anteriores: `feature/entrega-1-NCH` (documentación) y
`feature/entrega-2-NCH` (scaffold, autenticación, cuentas y categorías).

---

## 8. Flujo de trabajo con IA y arnés

Este proyecto se desarrolla con asistencia de agentes de IA (Claude Code y
Antigravity) bajo un arnés de reglas y hooks que exige trazabilidad y TDD. El
detalle completo vive en [AGENTS.md](AGENTS.md); aquí solo un resumen.

**Fuente única de reglas.** `AGENTS.md` es el documento de reglas para
cualquier agente; `CLAUDE.md` solo lo referencia (`@AGENTS.md`) para que Claude
Code lo cargue, sin duplicar contenido.

**Flujo OpenSpec: proponer → aplicar → verificar → archivar.** Ningún código de
producción se escribe sin un *change* aprobado en `openspec/changes/` (reglas
en `openspec/config.yaml`). Cada escenario Given/When/Then de una spec exige un
test con su nombre exacto, y se implementa en TDD estricto: RED (test que
falla por el motivo esperado) → GREEN (mínimo código) → REFACTOR, una subtarea
a la vez, un commit por subtarea.

**Hooks que bloquean, y qué impiden:**
- `.husky/pre-commit` y `pre-merge-commit`: no permiten commits en `main`, y
  corren `npm run lint`, `npx tsc --noEmit` y `npm run test:run` antes de cada
  commit (la suite debe estar en verde).
- `scripts/agents/guard-core.mjs` (vía `.claude/settings.json` en Claude Code y
  `.agents/hooks.json` en Antigravity): bloquea que un agente lea, edite o
  ejecute comandos sobre `.env*`, `.claude/`, `.git/`, `scripts/agents/`,
  `.agents/hooks.json` o migraciones ya aplicadas en `prisma/migrations/`;
  también bloquea `git push/reset/clean/checkout/switch/merge/rebase`,
  `--no-verify` y `npm audit fix`.

**Modelos por fase, prompts clave y ajustes humanos:** ver
[prompts.md](prompts.md#2-modelos-utilizados-por-fase).

**Límites conocidos** (ver `docs/pendientes.md` para el detalle y más):
- Antigravity en Windows pide confirmación para comandos con argumentos aunque
  su prefijo esté en la lista de permitidos; para ciclos largos de `apply` se
  prefiere Claude Code.
- **Riesgo a vigilar:** Antigravity anunció el retiro de sus workflows
  (`.agents/workflows/`) el 1-nov-2026. Los workflows instalados con OpenSpec siguen
  funcionando; si Antigravity llega a retirarlos, habrá que migrar a las skills
  `openspec-*`.
- El traspaso entre herramientas exige hacer commit antes de cambiar de
  agente, y leer `progress.md` y `tasks.md` al retomar.
