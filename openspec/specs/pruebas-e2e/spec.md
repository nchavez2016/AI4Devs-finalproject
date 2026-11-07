# pruebas-e2e Specification

## Purpose

Verifica de extremo a extremo, en un navegador real y contra una base de datos de prueba, que el
flujo principal de Cuadre funciona: registro, creación de cuenta, registro de un movimiento y su
reflejo en el panel, sin tocar nunca una base que no sea de prueba.

## Requirements

### Requirement: Flujo principal verificado en el navegador
La suite E2E SHALL recorrer, en un navegador real contra la app en ejecución, el flujo:
registrarse con un correo nuevo, entrar a la app con esa sesión, crear una cuenta, registrar un
gasto en ella y abrir `/panel`. En `/panel`, con el período por defecto (mes en curso), SHALL
comprobar los totales del período, el saldo actual de la cuenta y la categoría del gasto entre
las principales categorías de gasto, con los importes en formato monetario de la app. La suite
SHALL localizar los elementos solo por su rol y nombre accesible, su etiqueta o un
`data-testid`, y SHALL esperar a estados observables de la página, nunca un tiempo fijo.

#### Scenario: Flujo principal de registro, cuenta, gasto y panel
- **GIVEN** no existe ningún usuario con el correo único generado para esta ejecución
- **WHEN** se registra con nombre "Ana E2E", negocio "Tienda E2E", ese correo y contraseña "clave-segura-1", y entra a la app con esa sesión
- **AND** crea la cuenta "Caja E2E" de tipo efectivo con saldo inicial "100.00"
- **AND** registra un gasto de "25.50" en la cuenta "Caja E2E" con la categoría "Insumos" y la fecha que el formulario propone (hoy)
- **AND** abre "/panel"
- **THEN** el `h1` es "Tienda E2E"
- **AND** ve ingresos "$0,00", gastos "$25,50" y balance "−$25,50"
- **AND** ve la cuenta "Caja E2E" con saldo "$74,50"
- **AND** ve "Insumos" con "$25,50" entre las principales categorías de gasto

### Requirement: Base de datos de prueba obligatoria
La suite E2E SHALL ejecutarse solo contra una base de datos cuyo nombre termine en `_test`.
Antes de crear, migrar o usar la base y antes de arrancar la app, SHALL comprobar ese nombre y,
si no termina en `_test`, SHALL detenerse con un error que nombre la base rechazada, sin
modificar ninguna base.

#### Scenario: La suite E2E se niega a correr si la base no termina en _test
- **GIVEN** la URL de base de datos de la suite apunta a la base "cuadre"
- **WHEN** se inicia la preparación de la suite E2E
- **THEN** la preparación falla con un error que menciona "cuadre" y el sufijo "_test"
- **AND** no se crea, migra ni modifica ninguna base de datos

#### Scenario: La suite E2E acepta una base que termina en _test
- **GIVEN** la URL de base de datos de la suite apunta a la base "cuadre_e2e_test"
- **WHEN** se comprueba el nombre de la base
- **THEN** la comprobación acepta la base y devuelve el nombre "cuadre_e2e_test"

### Requirement: Datos aislados por ejecución
Cada ejecución de un test E2E SHALL crear sus propios datos a partir de un correo único, con un
dominio reservado para pruebas, de modo que ninguna ejecución dependa de datos de otra ni choque
con ellos.

#### Scenario: Cada ejecución E2E usa un correo distinto
- **GIVEN** se generan dos correos para dos ejecuciones de la suite
- **WHEN** se comparan
- **THEN** son distintos y ambos terminan en "@e2e.cuadre.test"

### Requirement: Acceso y aislamiento verificados en el navegador
La suite E2E SHALL comprobar en el navegador que `/panel` sin sesión lleva al login y que el
panel de un usuario no muestra datos de otro.

#### Scenario: Abrir el panel sin sesión en el navegador lleva al login
- **GIVEN** un navegador sin sesión activa
- **WHEN** abre "/panel"
- **THEN** termina en "/login" y ve el formulario de inicio de sesión

#### Scenario: El panel de un usuario no muestra la cuenta ni los gastos de otro
- **GIVEN** el usuario B, con su propio correo único, creó la cuenta "Banco Beto" con saldo inicial "0.00" y registró en ella un gasto de "500.00" en "Arriendo"
- **AND** el usuario A, con otro correo único y en otra sesión de navegador, no tiene movimientos
- **WHEN** A abre "/panel"
- **THEN** ve gastos "$0,00"
- **AND** no ve "Banco Beto" ni "Arriendo"
