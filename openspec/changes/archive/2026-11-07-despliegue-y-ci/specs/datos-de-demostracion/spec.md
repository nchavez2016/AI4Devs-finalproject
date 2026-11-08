# Spec Delta

## Purpose

Deja en la base de datos un usuario revisor con datos de ejemplo para que quien evalúe Cuadre
pueda iniciar sesión y ver el panel con información, sin registrarse ni cargar datos a mano.

## ADDED Requirements

### Requirement: Usuario revisor con datos de ejemplo
El seed SHALL crear al usuario con correo `revisor@cuadre.test`, nombre "Revisor", negocio
"Negocio de prueba" y la contraseña de prueba documentada `Revisor2026!` (guardada solo como
hash). SHALL crearle sus categorías por defecto, la cuenta "Banco Pichincha" de tipo banco con
saldo inicial 500.00, la cuenta "Caja chica" de tipo efectivo con saldo inicial 300.00 y estos
movimientos, con fechas relativas a la fecha de referencia del seed:
- día 1 del mes de referencia: ingreso 1200.00 "Ventas" en "Banco Pichincha";
- día 1 del mes de referencia: gasto 400.00 "Arriendo" en "Banco Pichincha";
- día 1 del mes de referencia: gasto 150.75 "Insumos" en "Caja chica";
- día 1 del mes de referencia: gasto 20.25 "Transporte" en "Caja chica";
- día 15 del mes anterior: ingreso 800.00 "Ventas" en "Banco Pichincha".

#### Scenario: El seed crea al revisor con cuentas y movimientos del mes
- **GIVEN** una base de prueba sin el usuario "revisor@cuadre.test"
- **WHEN** se ejecuta el seed con fecha de referencia 2026-11-07
- **THEN** existe el usuario "revisor@cuadre.test" con negocio "Negocio de prueba"
- **AND** tiene 2 cuentas y 5 movimientos
- **AND** en noviembre de 2026 suma ingresos 1200.00 y gastos 571.00
- **AND** el saldo calculado de "Banco Pichincha" es 2100.00 y el de "Caja chica" es 129.00

#### Scenario: El revisor sembrado inicia sesión con la contraseña documentada
- **GIVEN** el seed se ejecutó en la base de prueba
- **WHEN** se verifican las credenciales "revisor@cuadre.test" y "Revisor2026!"
- **THEN** la verificación es correcta
- **AND** la contraseña no está guardada en texto plano

### Requirement: Seed idempotente
Ejecutar el seed varias veces SHALL dejar al revisor exactamente en el estado descrito, sin
duplicar usuario, cuentas, categorías ni movimientos. Los datos que el revisor haya creado
después de un seed anterior SHALL reemplazarse por los de ejemplo.

#### Scenario: Ejecutar el seed dos veces no duplica datos
- **GIVEN** el seed se ejecutó una vez en la base de prueba
- **WHEN** se ejecuta de nuevo con la misma fecha de referencia
- **THEN** hay un solo usuario "revisor@cuadre.test"
- **AND** tiene 2 cuentas, 7 categorías y 5 movimientos

#### Scenario: El seed restablece los datos que el revisor cambió
- **GIVEN** el seed se ejecutó y después el revisor registró un gasto de 99.99 en "Caja chica"
- **WHEN** se ejecuta el seed de nuevo
- **THEN** el revisor tiene 5 movimientos y no existe el gasto de 99.99
- **AND** el saldo calculado de "Caja chica" es 129.00

### Requirement: El seed solo toca datos del revisor
El seed SHALL crear, modificar o borrar únicamente filas del usuario revisor.

#### Scenario: El seed no modifica los datos de otro usuario
- **GIVEN** otro usuario con la cuenta "Banco Beto" con saldo inicial 0.00 y un gasto de 500.00 en "Arriendo"
- **WHEN** se ejecuta el seed dos veces
- **THEN** ese usuario conserva su cuenta, sus 7 categorías y su gasto de 500.00
- **AND** ninguna cuenta, categoría ni movimiento del revisor pertenece a ese usuario

### Requirement: Confirmación explícita de la base de destino
Antes de conectarse, el seed SHALL exigir una confirmación con el nombre exacto de la base a la
que apunta su URL. Sin confirmación o si no coincide, SHALL detenerse con un error que nombre la
base, sin modificar nada.

#### Scenario: El seed se niega a correr sin confirmar la base
- **GIVEN** la URL del seed apunta a la base "neondb" y no hay confirmación
- **WHEN** se inicia el seed
- **THEN** falla con un error que menciona "neondb"
- **AND** no se modifica ninguna base de datos

#### Scenario: El seed se niega a correr si la confirmación no coincide
- **GIVEN** la URL del seed apunta a la base "neondb" y la confirmación es "cuadre"
- **WHEN** se inicia el seed
- **THEN** falla con un error que menciona "neondb" y "cuadre"

#### Scenario: El seed acepta la base confirmada
- **GIVEN** la URL del seed apunta a la base "neondb" y la confirmación es "neondb"
- **WHEN** se comprueba el destino
- **THEN** la comprobación acepta y devuelve el nombre "neondb"

### Requirement: El seed nunca corre de forma automática
El seed SHALL ejecutarse solo con el script `db:seed`. Ni el build, ni la instalación de
dependencias, ni los comandos de migración, ni las suites de tests SHALL invocarlo.

#### Scenario: Ningún script automático invoca el seed
- **GIVEN** los scripts de `package.json` y la configuración de Prisma
- **WHEN** se buscan referencias al seed
- **THEN** solo el script "db:seed" lo invoca
- **AND** la configuración de Prisma no declara un comando de seed
