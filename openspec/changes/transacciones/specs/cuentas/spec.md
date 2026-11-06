# Spec Delta

## ADDED Requirements

### Requirement: Saldo actual calculado
El saldo de una cuenta SHALL calcularse como su saldo inicial más la suma de sus ingresos
menos la suma de sus gastos, con 2 decimales y sin redondeos intermedios. El saldo MUST no
guardarse. Solo SHALL contar las transacciones de esa cuenta. Este saldo SHALL ser el que
devuelven la lista de cuentas, la consulta de una cuenta propia y la pantalla de cuentas.

#### Scenario: Saldo de cuenta suma ingresos y resta gastos
- **GIVEN** el usuario A tiene la cuenta "Caja" con saldo inicial 0.00
- **WHEN** registra en "Caja" un ingreso de 100.00 y un gasto de 25.50
- **THEN** su lista de cuentas muestra "Caja" con saldo 74.50
- **AND** la consulta de "Caja" por su identificador devuelve saldo 74.50

#### Scenario: Ver el saldo actualizado de una cuenta
- **GIVEN** el usuario A tiene una cuenta "Banco Pichincha" con saldo inicial 500.00
- **WHEN** registra un ingreso de 200.00 y un gasto de 50.00 en esa cuenta
- **THEN** el saldo actual de "Banco Pichincha" es 650.00

#### Scenario: El saldo de una cuenta solo cuenta sus transacciones
- **GIVEN** el usuario A tiene "Caja" con saldo inicial 10.00 y "Banco" con saldo inicial 0.00
- **WHEN** registra un gasto de 3.75 en "Banco"
- **THEN** "Caja" sigue con saldo 10.00 y "Banco" tiene saldo -3.75

#### Scenario: El saldo de una cuenta no cuenta transacciones de otro usuario
- **GIVEN** el usuario A tiene "Caja" con saldo inicial 10.00 y el usuario B tiene "Caja" con saldo inicial 0.00
- **WHEN** B registra un ingreso de 5.25 en su "Caja"
- **THEN** la "Caja" de A sigue con saldo 10.00 y la de B tiene saldo 5.25

## MODIFIED Requirements

### Requirement: Acceso desde el panel
El panel SHALL ofrecer una tarjeta de acceso a la pantalla de cuentas, otra a la de categorías
y otra a la de transacciones. Cada tarjeta es un único enlace que cubre toda su superficie y no
contiene otros controles.

#### Scenario: El panel enlaza a cuentas y categorías
- **GIVEN** el usuario autenticado está en el panel
- **WHEN** se muestra el panel
- **THEN** hay un enlace "Cuentas" a /cuentas y un enlace "Categorías" a /categorias

#### Scenario: El panel enlaza a transacciones
- **GIVEN** el usuario autenticado está en el panel
- **WHEN** se muestra el panel
- **THEN** hay un enlace "Transacciones" a /transacciones

#### Scenario: Las tarjetas de acceso del panel tienen un solo enlace
- **GIVEN** el usuario autenticado está en el panel
- **WHEN** se muestra el panel
- **THEN** hay una lista con tres tarjetas, "Transacciones", "Cuentas" y "Categorías", cada una con una frase que explica la sección
- **AND** cada tarjeta contiene exactamente un enlace y ningún botón
