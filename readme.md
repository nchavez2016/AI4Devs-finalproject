# Cuadre — Control de gastos e ingresos

## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

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
*(Pendiente — se desplegará en Vercel en la Entrega 2. Marcador por ahora.)*

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
del producto pero queda fuera del alcance de esta entrega.

- **[MVP] Registro y acceso de usuario.** El usuario crea una cuenta e inicia
  sesión; sus datos financieros son privados y solo él los ve. Al registrarse
  puede dar un nombre a su negocio o actividad, que identifica su espacio de
  trabajo.
- **[MVP] Gestión de cuentas.** El usuario crea y administra sus cuentas de
  dinero (por ejemplo banco, efectivo, billetera digital), para saber cuánto
  tiene disponible en cada una.
- **[MVP] Registro de transacciones.** El usuario registra un ingreso o un gasto,
  asociándolo a una cuenta, una categoría, un monto y una fecha; puede además
  listar, editar y eliminar sus movimientos.
- **[MVP] Categorización.** Cada transacción se clasifica por categoría (y
  subcategoría), para poder analizar en qué se gana y en qué se gasta.
- **[MVP] Dashboard.** Una pantalla de resumen muestra el saldo actual, el total
  de ingresos y gastos del período y las principales categorías de gasto, todo
  calculado automáticamente a partir de las transacciones.

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

*(Las capturas de pantalla y/o el videotutorial del recorrido se agregarán en la
Entrega 2, cuando exista interfaz funcional.)*

### 1.4. Instrucciones de instalación:

*(El detalle completo se completará en la Entrega 2, cuando exista código
ejecutable.)* La instalación en local seguirá estos pasos, coherentes con la
arquitectura descrita en la sección 2:

1. **Requisitos previos:** Node.js y Docker instalados.
2. **Clonar el repositorio** e instalar dependencias con un solo comando
   (`npm install`), ya que el proyecto es una única aplicación Next.js
   (no hay carpetas de frontend y backend por separado).
3. **Levantar la base de datos local** con Docker mediante `docker-compose up`,
   que arranca un PostgreSQL local para desarrollo sin instalarlo manualmente.
4. **Configurar variables de entorno** copiando `.env.example` a `.env` y
   ajustando la cadena de conexión `DATABASE_URL`.
5. **Aplicar migraciones y datos de ejemplo** con Prisma (`npx prisma migrate
   dev` y el seed).
6. **Arrancar la aplicación** con `npm run dev` (queda en `http://localhost:3000`).

Como exige la guía, el readme incluirá también cómo probar el MVP y las
credenciales de acceso para la revisión. En desarrollo se usa PostgreSQL local
(vía Docker); en producción, la misma aplicación se conecta a Neon cambiando
únicamente la variable `DATABASE_URL`.*

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
principal se publica solo), y un stack muy documentado que la IA conoce bien.

**Sacrificios / limitaciones asumidas.** Un monolito escala de forma menos
granular que los microservicios: si en el futuro un módulo (por ejemplo, un
agente de IA) necesitara escalar por separado, habría que extraerlo. Para el
alcance del MVP esta limitación no es relevante, y el diseño en capas facilita
esa extracción más adelante.

### 2.2. Descripción de componentes principales:

**Frontend (React + Tailwind CSS + shadcn/ui).** Es la capa que ve el usuario:
las pantallas de login, gestión de cuentas, registro de transacciones y el
dashboard. Usa componentes de shadcn/ui (formularios, tablas, tarjetas) para una
interfaz consistente sin diseñar cada elemento desde cero, y Tailwind para los
estilos. Los gráficos del dashboard se dibujan con una librería de charts
(Recharts).

**Backend (Next.js API Routes / Server Actions).** Es la lógica de servidor:
recibe las peticiones del frontend, valida los datos, aplica las reglas de
negocio (por ejemplo, que una transacción pertenezca al usuario autenticado y a
una de sus cuentas) y habla con la base de datos a través de Prisma. Aquí también
se calculan los totales y agregados que alimentan el dashboard.

**Autenticación (Auth.js / NextAuth).** Gestiona el registro, el inicio de sesión
y la sesión activa del usuario. Cada petición al backend se asocia a un usuario
autenticado, y ese identificador es el que garantiza que cada persona solo vea
sus propios datos.

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
organizada por responsabilidad. Estructura prevista:

```
cuadre/
├── prisma/
│   └── schema.prisma        # Definición del modelo de datos (tablas y relaciones)
├── src/
│   ├── app/                 # Rutas y páginas (App Router de Next.js)
│   │   ├── (auth)/          # Páginas de registro e inicio de sesión
│   │   ├── dashboard/       # Pantalla de resumen (dashboard)
│   │   ├── cuentas/         # Gestión de cuentas
│   │   ├── transacciones/   # Registro y listado de transacciones
│   │   └── api/             # Endpoints de backend (API Routes)
│   ├── components/          # Componentes de interfaz reutilizables (UI)
│   ├── lib/                 # Utilidades: cliente Prisma, configuración de Auth.js
│   ├── server/              # Lógica de negocio (casos de uso, cálculos)
│   │   └── repositories/    # Acceso a datos: encapsula Prisma (patrón Repository)
│   └── ...
├── public/                  # Archivos estáticos
├── .github/
│   └── workflows/           # CI: ejecución automática de tests (GitHub Actions)
├── docker-compose.yml       # PostgreSQL local para desarrollo (vía Docker)
├── .env.example             # Plantilla de variables de entorno
└── readme.md
```

La separación clave es: `app/` contiene las pantallas y los endpoints; `server/`
contiene la lógica de negocio y, dentro de `server/repositories/`, la capa de
acceso a datos que encapsula Prisma (patrón Repository); `lib/` reúne utilidades
compartidas; y `prisma/` define el modelo de datos. Esto mantiene la lógica
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
código vive en GitHub; cada cambio subido a la rama principal dispara dos cosas
en paralelo: (1) **GitHub Actions** ejecuta automáticamente la suite de pruebas
(integración continua), y (2) **Vercel** construye y publica la nueva versión de
la aplicación en una URL pública (despliegue continuo). La base de datos
PostgreSQL está alojada en Neon (proveedor gestionado en la nube) al que la
aplicación se conecta mediante una variable de entorno segura. Este esquema
cumple el requisito de la entrega final de tener el proyecto desplegado y
accesible por URL.

### 2.5. Seguridad:

Las prácticas de seguridad del MVP, apropiadas para una aplicación que maneja
datos financieros personales, son:

- **Autenticación de usuarios.** El acceso requiere registro e inicio de sesión
  mediante Auth.js; las contraseñas se almacenan con hash (nunca en texto plano).
  Todos los endpoints exigen sesión iniciada, salvo el registro y el login.
- **Aislamiento de datos por usuario.** Toda consulta al backend se filtra por el
  identificador del usuario autenticado, de modo que una persona nunca puede leer
  ni modificar datos de otra. Es el control de seguridad más importante del
  producto.
- **Validación de entradas con Zod.** Cada dato que llega en el cuerpo de una
  petición (montos, fechas, textos) se valida contra un esquema Zod en el
  servidor antes de aplicar la lógica de negocio, para rechazar datos corruptos o
  maliciosos.
- **Protección contra inyección SQL.** El acceso a datos usa siempre consultas
  parametrizadas de Prisma; nunca se arma SQL concatenando texto del usuario.
- **Protección contra XSS.** React escapa por defecto el contenido que se
  muestra, evitando la inyección de scripts en la interfaz.
- **Variables sensibles fuera del código.** Credenciales de base de datos y claves
  de sesión se guardan como variables de entorno, nunca en el repositorio, y no se
  colocan datos sensibles en las URLs.
- **Conexión cifrada.** Todo el tráfico viaja por HTTPS (provisto por Vercel) y la
  conexión a la base de datos usa TLS.

### 2.6. Tests:

La estrategia de pruebas para la entrega final contempla tres niveles:

- **Pruebas unitarias.** Verifican piezas aisladas de lógica de negocio, por
  ejemplo el cálculo de los totales de ingresos, gastos y balance del período.
- **Pruebas de integración.** Verifican que un endpoint del backend funcione de
  extremo a extremo contra la base de datos, por ejemplo crear una transacción y
  comprobar que queda correctamente asociada a la cuenta y al usuario.
- **Prueba de extremo a extremo (E2E).** Verifica el flujo principal completo
  desde el navegador: iniciar sesión, crear una cuenta, registrar una transacción
  y ver el dashboard actualizado.

Las pruebas se ejecutan automáticamente en cada cambio mediante GitHub Actions
(ver 2.4).

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
- `nombre`: nombre visible (por ejemplo "Banco Pichincha", "Efectivo"). NOT NULL.
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
- `nombre`: nombre de la categoría. NOT NULL.
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

La aplicación expone sus operaciones a través de endpoints internos consumidos
por el propio frontend. Todos requieren que el usuario esté autenticado, y todas
las operaciones se restringen automáticamente a los datos del usuario de la
sesión. A continuación se describen los tres endpoints principales del MVP en
formato OpenAPI (resumido).

### Endpoint 1 — Crear transacción

```yaml
POST /api/transacciones
summary: Registra un nuevo ingreso o gasto del usuario autenticado.
security:
  - sessionAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [cuentaId, categoriaId, tipo, monto, fecha]
        properties:
          cuentaId:    { type: string, description: "Cuenta afectada" }
          categoriaId: { type: string, description: "Categoría del movimiento" }
          tipo:        { type: string, enum: [INGRESO, GASTO] }
          monto:       { type: number, minimum: 0.01 }
          fecha:       { type: string, format: date }
          descripcion: { type: string, nullable: true }
responses:
  "201": { description: "Transacción creada" }
  "400": { description: "Datos inválidos" }
  "401": { description: "No autenticado" }
```

Ejemplo de petición:

```json
{
  "cuentaId": "cta_001",
  "categoriaId": "cat_ventas",
  "tipo": "INGRESO",
  "monto": 150.00,
  "fecha": "2026-09-17",
  "descripcion": "Venta de producto"
}
```

Ejemplo de respuesta (201):

```json
{
  "id": "trx_012",
  "cuentaId": "cta_001",
  "categoriaId": "cat_ventas",
  "tipo": "INGRESO",
  "monto": 150.00,
  "fecha": "2026-09-17",
  "descripcion": "Venta de producto",
  "creadoEn": "2026-09-17T14:05:00Z"
}
```

### Endpoint 2 — Listar transacciones

```yaml
GET /api/transacciones
summary: Devuelve las transacciones del usuario, con filtros opcionales.
security:
  - sessionAuth: []
parameters:
  - name: desde
    in: query
    schema: { type: string, format: date }
    description: "Fecha inicial del rango (opcional)"
  - name: hasta
    in: query
    schema: { type: string, format: date }
    description: "Fecha final del rango (opcional)"
  - name: tipo
    in: query
    schema: { type: string, enum: [INGRESO, GASTO] }
    description: "Filtrar por tipo (opcional)"
  - name: cuentaId
    in: query
    schema: { type: string }
    description: "Filtrar por cuenta (opcional)"
responses:
  "200": { description: "Lista de transacciones" }
  "401": { description: "No autenticado" }
```

### Endpoint 3 — Resumen del dashboard

```yaml
GET /api/dashboard
summary: Devuelve los totales calculados para el dashboard del período.
security:
  - sessionAuth: []
parameters:
  - name: periodo
    in: query
    schema: { type: string, enum: [dia, semana, mes], default: mes }
    description: "Período de agregación"
responses:
  "200":
    description: "Resumen calculado"
    content:
      application/json:
        schema:
          type: object
          properties:
            totalIngresos:  { type: number }
            totalGastos:    { type: number }
            balance:        { type: number }
            saldosPorCuenta:
              type: array
              items:
                type: object
                properties:
                  cuentaId: { type: string }
                  nombre:   { type: string }
                  saldo:    { type: number }
            topCategoriasGasto:
              type: array
              items:
                type: object
                properties:
                  categoria: { type: string }
                  total:     { type: number }
  "401": { description: "No autenticado" }
```

Ejemplo de respuesta (200):

```json
{
  "totalIngresos": 1200.00,
  "totalGastos": 780.50,
  "balance": 419.50,
  "saldosPorCuenta": [
    { "cuentaId": "cta_001", "nombre": "Banco", "saldo": 950.00 },
    { "cuentaId": "cta_002", "nombre": "Efectivo", "saldo": 120.00 }
  ],
  "topCategoriasGasto": [
    { "categoria": "Arriendo", "total": 400.00 },
    { "categoria": "Servicios básicos", "total": 180.50 }
  ]
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

### HU-001 — Registrar una transacción

**Como** persona que gestiona las finanzas de mi negocio
**quiero** registrar un ingreso o un gasto con su monto, fecha, cuenta y categoría
**para** mantener un control ordenado de todo el dinero que entra y sale.

**Prioridad:** Must-have
**Criterios de aceptación:**

\`\`\`gherkin
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
\`\`\`

---

### HU-002 — Gestionar mis cuentas

**Como** persona que gestiona las finanzas de mi negocio
**quiero** crear y administrar mis cuentas de dinero (banco, efectivo, billetera
digital)
**para** saber cuánto tengo disponible en cada una y a dónde asignar cada
movimiento.

**Prioridad:** Must-have
**Criterios de aceptación:**

\`\`\`gherkin
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
\`\`\`

---

### HU-003 — Ver el dashboard financiero

**Como** persona que gestiona las finanzas de mi negocio
**quiero** ver un panel de resumen con mi saldo, mis ingresos y gastos del
período y mis principales categorías de gasto
**para** entender de un vistazo la situación de mi negocio sin revisar cada
movimiento.

**Prioridad:** Must-have
**Criterios de aceptación:**

\`\`\`gherkin
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
\`\`\`

---

### Historias adicionales del MVP (resumen)

- **HU-004 (Must-have) — Categorizar transacciones.** Como usuario quiero crear
  categorías y subcategorías y asignarlas a mis transacciones, para analizar en
  qué gano y en qué gasto. (Habilita el desglose por categoría del dashboard.)
- **HU-005 (Should-have) — Editar y eliminar transacciones.** Como usuario quiero
  corregir o borrar un movimiento mal registrado, para mantener mis datos
  fiables. Se implementa solo si el núcleo del MVP está estable.

---

## 6. Tickets de trabajo

Los tickets descomponen las historias en unidades técnicas de trabajo. Se
presentan los tres principales exigidos por la plantilla, cubriendo las tres
capas del sistema: uno de configuración/base de datos, uno de backend y uno de
frontend. Cada ticket incluye su Definition of Done (DoD).

---

### TK-001 — Scaffold del proyecto, base de datos y autenticación

**Tipo:** Configuración / Base de datos / Backend
**Prioridad:** Alta (bloquea todo lo demás)
**Historia relacionada:** capacidad transversal (habilita HU-001 a HU-005)

**Descripción:**
Inicializar el proyecto Next.js con TypeScript y Tailwind, configurar Prisma
contra PostgreSQL, traducir el modelo de datos (sección 3) a \`schema.prisma\`,
ejecutar la primera migración, y dejar funcionando el registro e inicio de sesión
de usuarios con Auth.js (NextAuth).

**Tareas técnicas:**
- Inicializar proyecto Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.
- Configurar Prisma y la conexión a PostgreSQL mediante variable de entorno
  \`DATABASE_URL\`.
- Definir en \`schema.prisma\` las entidades Usuario, Cuenta, Categoria y
  Transaccion con sus relaciones (según sección 3).
- Ejecutar la migración inicial y verificar que las tablas existen.
- Integrar Auth.js con registro, login y hash de contraseñas.
- Middleware que exija sesión iniciada en las rutas privadas.

**Definition of Done:**
- [ ] El proyecto arranca en local con un solo comando documentado en el readme.
- [ ] La migración de Prisma crea todas las tablas del modelo sin errores.
- [ ] Un usuario puede registrarse, cerrar sesión y volver a iniciar sesión.
- [ ] Las contraseñas se almacenan con hash (nunca en texto plano).
- [ ] Una ruta privada redirige al login si no hay sesión activa.
- [ ] Variables sensibles fuera del código, con un \`.env.example\` documentado.

---

### TK-002 — API de transacciones (crear y listar)

**Tipo:** Backend
**Prioridad:** Alta
**Historia relacionada:** HU-001

**Descripción:**
Implementar los endpoints de creación y listado de transacciones descritos en la
sección 4, con validación de datos en el servidor y aislamiento por usuario.

**Tareas técnicas:**
- Endpoint \`POST /api/transacciones\` que valide los datos de entrada con Zod
  (monto > 0, tipo INGRESO/GASTO, cuenta y categoría existentes y pertenecientes
  al usuario, fecha válida).
- Endpoint \`GET /api/transacciones\` con filtros opcionales por rango de fechas,
  tipo y cuenta.
- Capa de servicio que asocie toda operación al usuario autenticado.
- Acceso a datos a través de un repositorio (`TransaccionRepository`) que
  encapsula Prisma, en lugar de llamar a Prisma directamente desde el endpoint
  (patrón Repository).
- Manejo de errores con códigos HTTP correctos (201, 400, 401).

**Definition of Done:**
- [ ] Se puede crear una transacción válida y recuperarla en el listado.
- [ ] Una transacción con monto ≤ 0 o con campos faltantes devuelve 400 con
      mensaje claro.
- [ ] Una petición sin sesión devuelve 401.
- [ ] Un usuario nunca recibe transacciones de otro usuario.
- [ ] Pruebas de integración que cubran los escenarios de HU-001 (caso válido,
      monto inválido, campos faltantes).
- [ ] PR enlazado a la historia HU-001, revisado por una persona.

---

### TK-003 — Pantalla de dashboard

**Tipo:** Frontend
**Prioridad:** Alta
**Historia relacionada:** HU-003

**Descripción:**
Construir la pantalla de dashboard que consume el endpoint \`GET /api/dashboard\`
y muestra los totales del período, el saldo por cuenta y las principales
categorías de gasto, con un estado vacío para usuarios nuevos.

**Tareas técnicas:**
- Maquetar la pantalla con componentes de shadcn/ui (tarjetas de resumen, tabla
  de saldos, gráfico de categorías con Recharts).
- Consumir el endpoint de dashboard y mostrar los datos calculados.
- Selector de período (día / semana / mes).
- Estado vacío con mensaje que invita a registrar la primera transacción.
- Diseño responsivo (móvil y escritorio).

**Definition of Done:**
- [ ] El dashboard muestra ingresos, gastos y balance correctos para el período
      seleccionado.
- [ ] Muestra el saldo actual de cada cuenta.
- [ ] Muestra las categorías de gasto ordenadas de mayor a menor.
- [ ] Un usuario sin datos ve el estado vacío con el mensaje de invitación.
- [ ] La pantalla se ve y funciona correctamente en móvil y escritorio.
- [ ] Prueba E2E del flujo: login registrar transacción ver dashboard
      actualizado.
- [ ] PR enlazado a la historia HU-003, revisado por una persona.

---

## 7. Pull requests

> Esta sección se completa durante las Entregas 2 y final, documentando los
> Pull Requests principales del desarrollo.

- **PR 1:** _(pendiente — Entrega 2)_
- **PR 2:** _(pendiente — Entrega 2)_
- **PR 3:** _(pendiente — Entrega final)_
