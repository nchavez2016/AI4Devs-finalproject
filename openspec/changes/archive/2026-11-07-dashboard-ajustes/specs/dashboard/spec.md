# Spec Delta: dashboard

## ADDED Requirements

### Requirement: Rango visible del período
Debajo del selector de período, el dashboard SHALL mostrar en una línea los días que abarca el
período activo, con los mismos límites que usan los totales (fechas calendario de Ecuador, ambos
extremos incluidos). El texto SHALL usar día de la semana y mes abreviados en español, sin punto
y sin año, separados por " – " cuando el período abarca más de un día. El mes SHALL escribirse
una sola vez si ambos extremos están en el mismo mes, y en cada extremo si no. El día de la
semana SHALL mostrarse en los períodos "dia" y "semana", y no en "mes".

#### Scenario: El rango del período día muestra la fecha de hoy
- **GIVEN** hoy es 2026-11-06 en Ecuador
- **WHEN** el usuario A abre el dashboard con el período "dia"
- **THEN** debajo del selector ve "vie 6 nov"

#### Scenario: El rango del período semana muestra de lunes a domingo
- **GIVEN** hoy es 2026-11-06 en Ecuador
- **WHEN** el usuario A abre el dashboard con el período "semana"
- **THEN** debajo del selector ve "lun 2 – dom 8 nov"

#### Scenario: El rango de una semana que cruza de mes nombra ambos meses
- **GIVEN** hoy es 2026-12-01 en Ecuador
- **WHEN** el usuario A abre el dashboard con el período "semana"
- **THEN** debajo del selector ve "lun 30 nov – dom 6 dic"

#### Scenario: El rango del período mes va del primer al último día
- **GIVEN** hoy es 2026-11-06 en Ecuador
- **WHEN** el usuario A abre el dashboard con el período "mes"
- **THEN** debajo del selector ve "1 – 30 nov"

#### Scenario: El rango del período usa la fecha de Ecuador
- **GIVEN** el instante actual es 2026-12-01T03:30:00Z (30 de noviembre, 22:30 en Ecuador)
- **WHEN** el usuario A abre el dashboard con el período "mes"
- **THEN** debajo del selector ve "1 – 30 nov"

### Requirement: Aclaración de los saldos por cuenta
Debajo del título "Saldos por cuenta", el dashboard SHALL mostrar el subtítulo "Saldo de cada cuenta con
todos sus movimientos. No cambia con el período elegido.", también cuando el usuario no tiene
cuentas.

#### Scenario: Los saldos por cuenta aclaran que no dependen del período
- **GIVEN** el usuario A tiene "Banco" con saldo inicial 500.00
- **WHEN** abre el dashboard con el período "semana"
- **THEN** debajo del título "Saldos por cuenta" ve "Saldo de cada cuenta con todos sus movimientos. No cambia con el período elegido."

### Requirement: Acción primaria del encabezado en una sola línea
La acción primaria del encabezado del dashboard ("Registrar movimiento") SHALL mostrarse en una
sola línea de texto. Cuando no quepa junto al título y la frase de propósito, SHALL pasar a una
línea propia debajo de ellos, sin reducir el ancho del título.

#### Scenario: La acción del encabezado no parte su texto
- **GIVEN** el usuario A tiene transacciones en el período
- **WHEN** abre el dashboard
- **THEN** el enlace "Registrar movimiento" del encabezado está en un contenedor que impide el salto de línea de su texto

#### Scenario: La acción del encabezado baja bajo el título si no cabe
- **GIVEN** el encabezado tiene título, frase de propósito y una acción
- **WHEN** se muestra
- **THEN** la fila que contiene el título y la acción permite pasar la acción a una línea propia debajo del título
