# Proposal

## Why

Registrar un movimiento (HU-001) exige una cuenta y una categoría, y hoy el usuario no puede
crear cuentas ni ver ni ampliar sus categorías. Cubre HU-002 sin saldo calculado y la parte
mínima de HU-004, con aislamiento por usuario.

## What Changes

- Cuentas: crear con nombre, tipo (banco, efectivo, digital) y saldo inicial opcional, y
  listarlas con su saldo. El saldo llega como texto, admite signo y punto o coma decimal, y
  se convierte a `Decimal` solo en el servidor. Si se deja vacío, vale 0.00.
- `obtenerCuenta`: devuelve "no encontrada" tanto si la cuenta no existe como si es de otro
  usuario.
- Categorías: listar las propias, agrupadas por tipo, y crear una de ingreso o de gasto.
- Nombres únicos, garantizados por la base incluso con envíos simultáneos y sin distinguir
  mayúsculas: el de una cuenta, por usuario; el de una categoría, por usuario y tipo. Se
  guardan sin espacios al inicio ni al final, con 150 caracteres como máximo.
- Migraciones `nombre-unico-cuentas` y `nombre-unico-categorias`: `nombre` pasa a `citext`,
  con índices únicos.
- El `usuarioId` sale siempre de la sesión, nunca del formulario.
- Pantallas `/cuentas` y `/categorias` en `(privado)`, con sus estados de vacío, carga, error
  y éxito, y enlaces a ellas desde el panel.
- Token `--duracion-espera-esqueleto` (400 ms), porque estados.md 9.2 exige ese retardo y no
  hay ningún token para él.

## Capabilities

### New Capabilities
- `cuentas`: creación, consulta, unicidad y aislamiento de las cuentas de dinero, y su
  pantalla.
- `categorias`: consulta y creación de categorías de primer nivel, unicidad por usuario y
  tipo, aislamiento, y su pantalla.

### Modified Capabilities
- Ninguna. Las rutas nuevas ya quedan protegidas por `autenticacion`, y las 7 categorías por
  defecto ya cumplen la unicidad.

## Impact

- Nuevo:
  - `cuentaRepository.ts` y `categoriaRepository.ts`.
  - `src/server/cuentas/`, `src/server/categorias/` y `src/server/auth/sesion.ts`.
  - `src/app/(privado)/cuentas/` y `src/app/(privado)/categorias/`.
- Modificado:
  - `prisma/schema.prisma` y dos migraciones nuevas.
  - `ContenidoPanel.tsx` (enlaces).
  - `globals.css` y `tokens.md` (un token).
  - `readme.md`, sección 3 (unicidad y longitud de los nombres).
- Dependencias: ninguna nueva. `citext` es una extensión incluida en PostgreSQL.

## Fuera de alcance

- Subcategorías, y editar o eliminar cuentas o categorías.
- Saldo calculado con transacciones: llega con registrar-transaccion. Aquí se muestra el
  saldo inicial.
- Pantalla de detalle de cuenta y `obtenerCategoria` por id.
- Igualar nombres que solo difieren en tildes ("Telefono" ≠ "Teléfono").
