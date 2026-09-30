# Tasks

Leyenda: **[PARADA]** = detenerse y pedir autorización antes de ejecutar. **[HUMANO]** = lo
hace la persona; el agente se detiene antes.
Los tests `*.int.test.ts` se ejecutan contra la base de `TEST_DATABASE_URL` (por defecto
`cuadre_test` en `cuadre-db`), que crea y migra el `globalSetup` de Vitest (design.md, decisión d).

## 1. Dependencias y configuración

- [x] 1.1 [PARADA] Pedir autorización e instalar `zod` como dependencia directa; verificar que aparece en `dependencies` de package.json.
- [x] 1.2 RED — `src/config/env.test.ts`, test "Configuración incompleta impide arrancar": la carga falla nombrando `AUTH_SECRET`, sin mostrar valores. Ver que falla porque `src/config/env.ts` no existe.
- [x] 1.3 GREEN — `src/config/env.ts`: función `cargarEnv(fuente)` con esquema Zod (`DATABASE_URL` URL postgres, `AUTH_SECRET` ≥ 32 caracteres) y `env` exportado a partir de `process.env`. Verificar el test en verde.
- [x] 1.4 REFACTOR — revisar mensajes y nombres; test en verde.
- [x] 1.5 RED — `src/config/env.test.ts`, test "Configuración completa se acepta". Si pasa sin cambios, detenerse y proponer cómo forzar el RED (config.yaml).
- [x] 1.6 GREEN — ajustar `src/config/env.ts` si hace falta; test en verde.
- [x] 1.7 REFACTOR — test en verde.
- [x] 1.8 Documentar en `.env.example` `AUTH_SECRET` (para qué sirve, mínimo 32 caracteres y cómo generarlo con `node:crypto`) y `TEST_DATABASE_URL` (opcional, valor por defecto, debe terminar en `_test`, la crea el `globalSetup`); verificar leyendo el archivo.
- [x] 1.9 [PARADA] Pedir autorización (paquete NO aprobado, ver design.md a) y ejecutar `npm install --save-exact @prisma/adapter-pg@7.10.0`; verificar que package.json dice exactamente `"7.10.0"` (sin `^`) y que `npm ls pg` resuelve.
- [x] 1.10 CARACTERIZACIÓN — ejecutar `npm run test:run` y anotar en progress.md el número de archivos y tests actuales, antes de tocar `vitest.config.mts`.
- [x] 1.11 RED — `src/test/bd/limpiar.test.ts` (`@vitest-environment node`), test "limpiarBD aborta si la base no termina en _test": con la URL `postgresql://cuadre:cuadre@bd-inexistente.invalid:5432/cuadre` rechaza con un error que menciona `_test` y no intenta conectar. Ver que falla porque `limpiar.ts` no existe.
- [x] 1.12 GREEN — `src/test/bd/limpiar.ts`: `limpiarBD(url)` comprueba el nombre de la base antes de conectar y después ejecuta `TRUNCATE ... CASCADE` de todas las tablas. Test en verde.
- [x] 1.13 REFACTOR — extraer `exigirBaseDePrueba(url)` a `src/test/bd/guardia.ts` para reutilizarla en el `globalSetup`; test en verde.
- [x] 1.14 `vitest.config.mts`: `process.loadEnvFile()` en un try; `TEST_DATABASE_URL` con valor por defecto `postgresql://cuadre:cuadre@localhost:5432/cuadre_test?schema=public`; proyectos `unidad` (jsdom, excluye `*.int.test.ts`) e `integracion` (Node, archivos en serie, `env.DATABASE_URL` = URL de prueba, `AUTH_SECRET` de prueba), todavía sin `globalSetup`. Verificar: `npx vitest run --project unidad` da el recuento de 1.10 más los tests de 1.11-1.13 (73 en 10 archivos); `npx vitest list --project integracion` existe y no lista ningún test; `npm run typecheck` sin errores.
- [x] 1.15 `src/test/bd/global-setup.ts`, primera parte: `exigirBaseDePrueba` → conectar a `postgres` → `CREATE DATABASE` si no existe; error claro si no conecta. Verificar: antes, `docker exec cuadre-db psql -U cuadre -lqt` no lista `cuadre_test` (si ya existe, detenerse y preguntar antes de borrarla); después de `npx vitest run --project integracion --passWithNoTests`, sí la lista. (Vitest no ejecuta `globalSetup` sin al menos un archivo de test; se verificó con un archivo temporal sin commitear, que crea 1.18.)
- [x] 1.16 `global-setup.ts`, segunda parte: `prisma migrate deploy` con `DATABASE_URL` = URL de prueba. Verificar: `docker exec cuadre-db psql -U cuadre -d cuadre_test -c "\dt"` lista `usuarios`, `cuentas`, `categorias`, `transacciones` y `_prisma_migrations` con `init` aplicada.
- [x] 1.17 Comprobar la idempotencia y que la base de desarrollo no se toca: anotar las filas de `_prisma_migrations` y `count(*)` de `usuarios` en la base `cuadre`; ejecutar dos veces `npx vitest run --project integracion --passWithNoTests` (ambas terminan con código 0); ejecutar una vez con `TEST_DATABASE_URL` apuntando a `.../cuadre` y ver que aborta mencionando `_test`; comprobar que los valores anotados de `cuadre` no han cambiado.
- [x] 1.18 RED — `src/test/bd/bd.int.test.ts`, test "la base de integración es la de prueba y está vacía". Ver que falla porque `src/server/repositories/prisma.ts` no existe.
- [x] 1.19 GREEN — `src/server/repositories/prisma.ts` (cliente único con `PrismaPg` y `env.DATABASE_URL`). Test en verde.
- [x] 1.20 REFACTOR — test en verde; ejecutar la suite completa (cierre de grupo).

## 2. Registro con categorías por defecto

- [x] 2.1 RED — `src/server/auth/registro.int.test.ts`, test "Registro válido crea el usuario". Ver que falla porque `registrarUsuario` no existe.
- [x] 2.2 GREEN — `src/server/auth/esquemas.ts` (Zod de registro: normaliza el email), `src/server/repositories/usuarioRepository.ts` y `src/server/auth/registro.ts`. Test en verde.
- [x] 2.3 REFACTOR — test en verde.
- [x] 2.4 RED — mismo archivo, test "La contraseña se guarda con hash y nunca en texto plano".
- [x] 2.5 GREEN — `src/server/auth/password.ts` (`hashear`/`verificar` con scrypt, formato de design.md b) y usarlo en `registro.ts`. Test en verde.
- [x] 2.6 REFACTOR — test en verde.
- [x] 2.7 RED — mismo archivo, test "Registro rechazado por email duplicado".
- [x] 2.8 GREEN — traducir P2002 en el repositorio a un resultado de dominio "email ya registrado". Test en verde.
- [x] 2.9 REFACTOR — test en verde.
- [ ] 2.10 RED — mismo archivo, test "Registro rechazado por datos inválidos": nombre `""`, negocio `"   "`, email `"no-es-un-email"` y contraseña `"1234567"` (7 caracteres) producen un error en cada uno de los cuatro campos, y no se crea ningún usuario.
- [ ] 2.11 GREEN — `src/server/auth/esquemas.ts` con las reglas de design.md (Validación de registro), y los errores de Zod agrupados por campo desde `registro.ts`. Test en verde; si una regla entra sin que el RED la exija, verificarla por mutación.
- [ ] 2.12 REFACTOR — test en verde.
- [ ] 2.13 RED — mismo archivo, test "Registro crea las categorías por defecto".
- [ ] 2.14 GREEN — constante `CATEGORIAS_POR_DEFECTO` en `src/server/auth/categoriasPorDefecto.ts`; el repositorio crea usuario y categorías en un solo `$transaction`. Test en verde.
- [ ] 2.15 REFACTOR — test en verde.
- [ ] 2.16 RED — mismo archivo, test "Categorías por defecto aisladas por usuario". Si pasa sin cambios, detenerse y proponer cómo forzar el RED.
- [ ] 2.17 GREEN — corregir el filtro por `usuarioId` si hace falta. Test en verde.
- [ ] 2.18 REFACTOR — test en verde; suite completa (cierre de grupo).

## 3. Credenciales, sesión y proxy.ts

- [ ] 3.1 RED — `src/server/auth/credenciales.int.test.ts`, test "Inicio de sesión con credenciales correctas". Ver que falla porque `verificarCredenciales` no existe.
- [ ] 3.2 GREEN — `src/server/auth/credenciales.ts` (Zod + `usuarioRepository.buscarPorEmail` + `verificar`). Test en verde.
- [ ] 3.3 REFACTOR — test en verde.
- [ ] 3.4 RED — mismo archivo, test "Inicio de sesión con contraseña incorrecta".
- [ ] 3.5 GREEN — devolver el error genérico "Email o contraseña incorrectos". Test en verde.
- [ ] 3.6 REFACTOR — test en verde.
- [ ] 3.7 RED — mismo archivo, test "Inicio de sesión con email no registrado". Si pasa sin cambios, detenerse y proponer cómo forzar el RED.
- [ ] 3.8 GREEN — mismo error genérico; ejecutar `verificar` también con un hash ficticio para no revelar si el email existe por el tiempo de respuesta. Test en verde.
- [ ] 3.9 REFACTOR — test en verde.
- [ ] 3.10 [PARADA] Pedir autorización y ejecutar `npm install --save-exact next-auth@5.0.0-beta.32`; verificar que package.json dice exactamente `"5.0.0-beta.32"` (sin `^`).
- [ ] 3.11 Comprobar en `node_modules/@auth/core` que Credentials exige `session.strategy: "jwt"` (buscar la validación de estrategia) y anotar el resultado en design.md (decisión c). Si lo contradice, detenerse.
- [ ] 3.12 RED — `src/auth.test.ts`, test "la sesión expone id, nombre y nombre del negocio del token". Ver que falla porque los callbacks no existen.
- [ ] 3.13 GREEN — `src/auth.ts` (NextAuth: Credentials → `verificarCredenciales`, JWT, callbacks `jwt`/`session`, `pages.signIn: "/login"`, `secret: env.AUTH_SECRET`), `src/types/next-auth.d.ts` y `src/app/api/auth/[...nextauth]/route.ts`. Test en verde y `npm run typecheck` sin errores.
- [ ] 3.14 REFACTOR — test en verde.
- [ ] 3.15 RED — `src/server/auth/rutas.test.ts`, test "Ruta privada sin sesión redirige al login". Ver que falla porque `rutas.ts` no existe.
- [ ] 3.16 GREEN — `src/server/auth/rutas.ts` (función pura `resolverRedireccion(pathname, haySesion)`). Test en verde.
- [ ] 3.17 REFACTOR — test en verde.
- [ ] 3.18 RED — mismo archivo, test "Rutas públicas accesibles sin sesión".
- [ ] 3.19 GREEN — lista de rutas públicas en `rutas.ts`; `proxy.ts` en la raíz que envuelve `auth` y aplica `resolverRedireccion`, con `matcher` que excluye `_next`, `api/auth` y archivos estáticos. Test en verde y `npm run typecheck` sin errores.
- [ ] 3.20 REFACTOR — test en verde.
- [ ] 3.21 RED — `src/server/auth/acciones.test.ts`, test "Cierre de sesión termina la sesión y redirige al login" (con `@/auth` simulado: `signOut` llamado con `redirectTo: "/login"`).
- [ ] 3.22 GREEN — `src/server/auth/acciones.ts` con la Server Action `cerrarSesion`. Test en verde.
- [ ] 3.23 REFACTOR — test en verde; suite completa (cierre de grupo).

## 4. Pantallas y limpieza

- [ ] 4.1 CARACTERIZACIÓN — confirmar con `git show HEAD:src/app/page.tsx` que es la plantilla de Next sin lógica que conservar, y anotarlo en progress.md.
- [ ] 4.2 RED — `src/app/page.test.tsx`, test "La raíz lleva al panel": invoca `Page()` (componente síncrono, sin renderizar) con `redirect` de `next/navigation` simulado y comprueba que se llama con `"/panel"`.
- [ ] 4.3 GREEN — `src/app/page.tsx` pasa a ser solo `redirect("/panel")`. Test en verde.
- [ ] 4.4 REFACTOR — test en verde.
- [ ] 4.5 RED — `src/app/(privado)/panel/panel.test.tsx`, test "El panel muestra el negocio del usuario autenticado": con `@/auth` simulado (sesión de A), renderiza `<ContenidoPanel {...await cargarPanel()} />` y comprueba que aparece "Tienda Ana" y no "Taller Beto". Ver que falla porque no existen.
- [ ] 4.6 GREEN — `src/server/panel.ts` (`cargarPanel`: `auth()`, `redirect("/login")` sin sesión y devuelve `nombreNegocio`), `src/app/(privado)/panel/ContenidoPanel.tsx` (síncrono: negocio y botón "Cerrar sesión" con `cerrarSesion`, solo tokens de `docs/diseno/sistema/`) y `page.tsx` (async, solo une las dos piezas; se verifica en 5.3). Test en verde.
- [ ] 4.7 REFACTOR — test en verde.
- [ ] 4.8 RED — `src/server/auth/acciones.test.ts`, test "registrar devuelve los errores por campo del caso de uso" (caso de uso simulado).
- [ ] 4.9 GREEN — Server Actions `registrar` (llama a `registrarUsuario` y, si va bien, a `signIn` con `redirectTo: "/panel"`) e `iniciarSesion` (mapea el `CredentialsSignin` al mensaje genérico) en `acciones.ts`. Test en verde.
- [ ] 4.10 REFACTOR — test en verde.
- [ ] 4.11 RED — `src/app/registro/FormularioRegistro.test.tsx`, test "muestra junto a cada campo el error devuelto por el servidor".
- [ ] 4.12 GREEN — `src/app/registro/page.tsx` y `FormularioRegistro.tsx` (`useActionState`, `Campo` y `Button` de `src/components/ui/`, enlace a `/login`). Test en verde.
- [ ] 4.13 REFACTOR — test en verde.
- [ ] 4.14 RED — `src/app/login/FormularioLogin.test.tsx`, test "muestra el mensaje genérico de credenciales incorrectas".
- [ ] 4.15 GREEN — `src/app/login/page.tsx` y `FormularioLogin.tsx` (mismos componentes, enlace a `/registro`). Test en verde.
- [ ] 4.16 REFACTOR — test en verde.
- [ ] 4.17 Eliminar `src/app/diseno/`; verificar con una búsqueda que nada la referencia y que `npm run build` termina sin errores (con `DATABASE_URL`/`AUTH_SECRET` disponibles; si `build` no puede ejecutarse por falta de `AUTH_SECRET`, dejarlo anotado para 5.2). Suite completa (cierre de grupo).

## 5. [HUMANO] Secreto, arranque y prueba manual

- [ ] 5.1 [HUMANO] Añadir `AUTH_SECRET` al `.env` siguiendo `.env.example`.
- [ ] 5.2 [HUMANO] `docker compose up -d` y `npm run dev`; verificar que arranca sin errores de configuración y que `npm run build` termina bien.
- [ ] 5.3 [HUMANO] Flujo manual: `/` → `/login`; registrarse → `/panel` muestra el negocio; cerrar sesión → `/login`; abrir `/panel` sin sesión → `/login`; login con contraseña errónea → mensaje genérico; login correcto → `/panel`. En la base de desarrollo, el `password_hash` empieza por `scrypt$` y el usuario tiene 7 categorías. Además, registrar un segundo usuario B y comprobar que `/panel` muestra el negocio de B y no el de A.
- [ ] 5.4 Verificación final (agente): `npm run lint`, `npx tsc --noEmit`, `npm run test:run` y `openspec validate esquema-y-autenticacion --strict`, todo sin errores.
