# Spec Delta: cuentas

## MODIFIED Requirements

### Requirement: Pantalla de cuentas
La pantalla de cuentas SHALL listar las cuentas del usuario con su nombre, su tipo y su saldo
en formato monetario, e incluir el formulario para crear una cuenta dentro de una tarjeta con
título. En escritorio, la lista y la tarjeta del formulario SHALL ir en dos columnas; en móvil,
en una sola columna con la lista primero. SHALL mostrar un estado vacío, uno de carga, uno de
error y uno de éxito, con un único botón primario en la vista.

#### Scenario: Pantalla de cuentas sin cuentas muestra el estado vacío
- **GIVEN** el usuario no tiene cuentas
- **WHEN** abre la pantalla de cuentas
- **THEN** ve "Todavía no tienes cuentas. Crea una para empezar a registrar movimientos." y un botón secundario "Crear cuenta" que lleva al campo nombre del formulario

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

#### Scenario: Pantalla de cuentas muestra la lista y el formulario en dos columnas
- **GIVEN** el usuario tiene la cuenta "Banco Pichincha" (banco, 500.00)
- **WHEN** abre la pantalla de cuentas
- **THEN** la lista y una tarjeta con el título de nivel 2 "Nueva cuenta" están en una rejilla de una columna que pasa a dos desde el punto de corte de escritorio
- **AND** la lista va antes que la tarjeta y la tarjeta contiene el formulario
- **AND** la vista tiene un solo botón primario, "Crear cuenta"

### Requirement: Acceso desde el panel
El panel SHALL ofrecer una tarjeta de acceso a la pantalla de cuentas y otra a la de categorías.
Cada tarjeta es un único enlace que cubre toda su superficie y no contiene otros controles.

#### Scenario: El panel enlaza a cuentas y categorías
- **GIVEN** el usuario autenticado está en el panel
- **WHEN** se muestra el panel
- **THEN** hay un enlace "Cuentas" a /cuentas y un enlace "Categorías" a /categorias

#### Scenario: Las tarjetas de acceso del panel tienen un solo enlace
- **GIVEN** el usuario autenticado está en el panel
- **WHEN** se muestra el panel
- **THEN** hay una lista con dos tarjetas, "Cuentas" y "Categorías", cada una con una frase que explica la sección
- **AND** cada tarjeta contiene exactamente un enlace y ningún botón
