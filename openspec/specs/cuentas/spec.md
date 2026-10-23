# cuentas Specification

## Purpose

Permite que el usuario autenticado registre los lugares donde tiene su dinero (banco, efectivo,
billetera digital) y los consulte con su saldo, sin acceder nunca a las cuentas de otro usuario.

## Requirements

### Requirement: Creación de cuenta
El sistema SHALL permitir al usuario autenticado crear una cuenta con nombre, tipo y saldo
inicial. El nombre se SHALL guardar sin los espacios del inicio y del final y, sin ellos,
SHALL tener entre 1 y 150 caracteres. El nombre MUST ser único entre las cuentas del mismo
usuario, sin distinguir mayúsculas de minúsculas. La base de datos MUST garantizarlo también
cuando llegan dos envíos a la vez. El tipo SHALL ser banco, efectivo o billetera digital. El saldo inicial
se SHALL recibir como texto y SHALL admitir signo negativo, punto o coma como separador
decimal y hasta 2 decimales, sin separador de miles. Su valor absoluto SHALL ser como máximo
999999999999.99. Si el saldo inicial llega vacío, SHALL valer 0.00. Toda entrada SHALL
validarse en el servidor y, si es inválida, SHALL rechazarse con un error por campo sin crear
la cuenta.

#### Scenario: Crear una cuenta con saldo inicial 500.00
- **GIVEN** el usuario A está autenticado y no tiene cuentas
- **WHEN** crea una cuenta con nombre "Banco Pichincha", tipo banco y saldo inicial "500.00"
- **THEN** su lista de cuentas contiene "Banco Pichincha" de tipo banco con saldo 500.00

#### Scenario: Crear una cuenta sin saldo inicial la deja en 0.00
- **GIVEN** el usuario A está autenticado
- **WHEN** crea una cuenta con nombre "Efectivo", tipo efectivo y saldo inicial ""
- **THEN** su lista de cuentas contiene "Efectivo" con saldo 0.00

#### Scenario: Crear una cuenta con saldo inicial negativo
- **GIVEN** el usuario A está autenticado
- **WHEN** crea una cuenta con nombre "Banco Guayaquil", tipo banco y saldo inicial "-120.00"
- **THEN** su lista de cuentas contiene "Banco Guayaquil" con saldo -120.00

#### Scenario: Saldo inicial con coma decimal se acepta
- **GIVEN** el usuario A está autenticado
- **WHEN** crea una cuenta con nombre "Billetera", tipo billetera digital y saldo inicial " 1250,75 "
- **THEN** su lista de cuentas contiene "Billetera" con saldo 1250.75

#### Scenario: Crear cuenta rechazada por nombre vacío
- **GIVEN** el usuario A está autenticado y no tiene cuentas
- **WHEN** intenta crear una cuenta con nombre "   ", tipo banco y saldo inicial "500.00"
- **THEN** la creación se rechaza con un error en el campo nombre
- **AND** A sigue sin cuentas

#### Scenario: Longitud máxima del nombre de cuenta es 150 caracteres
- **GIVEN** el usuario A está autenticado y no tiene cuentas
- **WHEN** crea una cuenta de tipo banco cuyo nombre son 150 letras "a" rodeadas de dos espacios a cada lado, y después intenta crear otra con 151 letras "b"
- **THEN** la primera se crea con el nombre de 150 caracteres, sin los espacios
- **AND** la segunda se rechaza con un error en el campo nombre, y A tiene una sola cuenta

#### Scenario: Crear cuenta rechazada por nombre duplicado
- **GIVEN** el usuario A tiene la cuenta "Banco Pichincha"
- **WHEN** intenta crear una cuenta de tipo digital con nombre " banco PICHINCHA "
- **THEN** la creación se rechaza con el error "Ya tienes una cuenta con ese nombre" en el campo nombre
- **AND** A sigue teniendo una sola cuenta

#### Scenario: Cuentas duplicadas rechazadas aunque se envíen a la vez
- **GIVEN** el usuario A está autenticado y no tiene cuentas
- **WHEN** se envían a la vez la creación de la cuenta "Caja chica" y la de "caja chica"
- **THEN** exactamente una se crea y la otra se rechaza con el error "Ya tienes una cuenta con ese nombre"
- **AND** A tiene una sola cuenta

#### Scenario: Crear cuenta rechazada por saldo inicial inválido
- **GIVEN** el usuario A está autenticado y no tiene cuentas
- **WHEN** intenta crear la cuenta "Banco Pichincha" de tipo banco, una vez con cada saldo inicial "abc", "10.555", "1.000,00" y "1000000000000.00"
- **THEN** cada intento se rechaza con un error en el campo saldo inicial
- **AND** A sigue sin cuentas

#### Scenario: Crear cuenta rechazada por tipo inválido
- **GIVEN** el usuario A está autenticado y no tiene cuentas
- **WHEN** intenta crear una cuenta con nombre "Visa", tipo "TARJETA" y saldo inicial "0.00"
- **THEN** la creación se rechaza con un error en el campo tipo
- **AND** A sigue sin cuentas

### Requirement: Consulta de una cuenta propia
El sistema SHALL permitir obtener una cuenta concreta del usuario autenticado a partir de su
identificador, con su nombre, tipo y saldo.

#### Scenario: Consultar una cuenta propia por su identificador
- **GIVEN** el usuario A tiene la cuenta "Banco Pichincha" con saldo inicial 500.00
- **WHEN** A la consulta por su identificador
- **THEN** obtiene "Banco Pichincha" de tipo banco con saldo 500.00

### Requirement: Aislamiento de cuentas entre usuarios
El sistema MUST limitar toda consulta y creación de cuentas al usuario de la sesión. Una
cuenta de otro usuario MUST tratarse igual que una inexistente y su nombre MUST no contar
para la regla de nombres únicos. El usuario dueño de una cuenta
nueva MUST tomarse de la sesión, nunca de los datos enviados. Sin sesión, ninguna operación
sobre cuentas se SHALL ejecutar.

#### Scenario: Un usuario no ve las cuentas de otro en su lista
- **GIVEN** el usuario A tiene la cuenta "Banco Pichincha" y el usuario B tiene la cuenta "Caja Beto"
- **WHEN** A consulta su lista de cuentas
- **THEN** la lista contiene solo "Banco Pichincha"

#### Scenario: Una cuenta de otro usuario se trata como inexistente
- **GIVEN** el usuario B tiene la cuenta "Caja Beto"
- **WHEN** el usuario A la consulta por su identificador, y también consulta un identificador que no existe
- **THEN** ambas consultas devuelven el mismo resultado de cuenta no encontrada, sin datos de la cuenta

#### Scenario: El nombre de una cuenta de otro usuario no cuenta como duplicado
- **GIVEN** el usuario A tiene la cuenta "Banco Pichincha"
- **WHEN** el usuario B crea la cuenta "Banco Pichincha" de tipo banco
- **THEN** la creación se acepta y la cuenta es de B
- **AND** A sigue teniendo una sola cuenta "Banco Pichincha"

#### Scenario: La cuenta se crea siempre para el usuario de la sesión
- **GIVEN** el usuario A está autenticado
- **WHEN** envía el formulario de nueva cuenta con un campo adicional que indica el identificador del usuario B
- **THEN** la cuenta se crea para A y no para B

#### Scenario: Crear una cuenta sin sesión redirige al login
- **GIVEN** no hay sesión activa
- **WHEN** se envía el formulario de nueva cuenta
- **THEN** se redirige a /login y no se intenta crear ninguna cuenta

### Requirement: Pantalla de cuentas
La pantalla de cuentas SHALL listar las cuentas del usuario con su nombre, su tipo y su saldo
en formato monetario, e incluir el formulario para crear una cuenta. SHALL mostrar un estado
vacío, uno de carga, uno de error y uno de éxito.

#### Scenario: Pantalla de cuentas sin cuentas muestra el estado vacío
- **GIVEN** el usuario no tiene cuentas
- **WHEN** abre la pantalla de cuentas
- **THEN** ve "Todavía no tienes cuentas. Crea una para empezar a registrar movimientos." y un botón primario "Crear cuenta" que lleva al campo nombre del formulario

#### Scenario: Pantalla de cuentas muestra cada cuenta con su tipo y saldo
- **GIVEN** el usuario tiene "Banco Pichincha" (banco, 500.00) y "Banco Guayaquil" (banco, -120.00)
- **WHEN** abre la pantalla de cuentas
- **THEN** ve "Banco Pichincha" con el tipo "Banco" y el saldo "$500,00", y "Banco Guayaquil" con el saldo "−$120,00"

#### Scenario: Formulario de cuenta muestra el error junto a cada campo
- **GIVEN** el servidor rechazó la creación con un error en nombre y otro en saldo inicial
- **WHEN** se muestra el formulario
- **THEN** cada mensaje aparece junto a su campo, y ese campo queda marcado como inválido

#### Scenario: Error al guardar la cuenta conserva los datos escritos
- **GIVEN** el usuario escribió nombre "Banco Pichincha" y saldo inicial "500.00"
- **WHEN** el guardado falla por un error del servidor
- **THEN** ve, encima del botón, un aviso con role="alert": "No pudimos guardar la cuenta. Inténtalo de nuevo."
- **AND** los campos conservan "Banco Pichincha" y "500.00"

#### Scenario: Cuenta creada se anuncia y se resalta en la lista
- **GIVEN** el usuario acaba de crear la cuenta "Banco Pichincha"
- **WHEN** se vuelve a mostrar la pantalla
- **THEN** una región aria-live="polite" anuncia "Cuenta Banco Pichincha creada."
- **AND** la fila de "Banco Pichincha" está resaltada

#### Scenario: Pantalla de cuentas en carga muestra un esqueleto ocupado
- **GIVEN** las cuentas todavía se están cargando
- **WHEN** se muestra la pantalla
- **THEN** se ve un esqueleto estático con forma de filas, en una región con aria-busy="true"

#### Scenario: Error al cargar las cuentas ofrece reintentar
- **GIVEN** la carga de las cuentas falló
- **WHEN** se muestra la pantalla
- **THEN** ve "No pudimos cargar tus cuentas." y un botón secundario "Reintentar"
- **AND** al pulsarlo se vuelve a intentar la carga

### Requirement: Acceso desde el panel
El panel SHALL enlazar a la pantalla de cuentas y a la de categorías.

#### Scenario: El panel enlaza a cuentas y categorías
- **GIVEN** el usuario autenticado está en el panel
- **WHEN** se muestra el panel
- **THEN** hay un enlace "Cuentas" a /cuentas y un enlace "Categorías" a /categorias
