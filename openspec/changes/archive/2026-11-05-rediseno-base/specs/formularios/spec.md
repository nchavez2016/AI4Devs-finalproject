# Spec Delta: formularios

## Purpose

Fija el comportamiento común de los formularios de Cuadre: cómo se presenta el campo de monto,
cuándo aparecen los errores de validación y adónde va el foco cuando hay errores.

## ADDED Requirements

### Requirement: Prefijo de moneda dentro del campo de monto
El campo de monto SHALL mostrar el prefijo "$" dentro del mismo control con borde que el texto
escrito. El prefijo no es editable, no forma parte del valor enviado y no se anuncia como parte
de la etiqueta.

#### Scenario: El campo de monto muestra el prefijo dentro del control
- **GIVEN** un formulario con un campo de monto "Saldo inicial"
- **WHEN** el usuario escribe "500.00"
- **THEN** el "$" y el campo están dentro del mismo contenedor con borde
- **AND** el valor del campo es "500.00", sin el símbolo
- **AND** el nombre accesible del campo es "Saldo inicial (opcional)"

#### Scenario: El campo de monto con error marca el control completo
- **GIVEN** el servidor rechazó el saldo inicial "12.345" con un error
- **WHEN** se muestra el formulario de cuenta
- **THEN** el contenedor con borde que incluye el "$" se muestra con el borde de error
- **AND** el campo tiene aria-invalid="true"

### Requirement: Validación al enviar
Los formularios SHALL mostrar los errores de validación solo después de enviarlos, nunca mientras
el usuario escribe, y sin los avisos nativos del navegador.

#### Scenario: Escribir en un formulario no muestra errores antes de enviarlo
- **GIVEN** el formulario de cuenta recién abierto
- **WHEN** el usuario escribe "Banco" en Nombre y lo borra
- **THEN** no aparece ningún mensaje de error ni ningún campo con aria-invalid

#### Scenario: Los formularios desactivan la validación nativa del navegador
- **GIVEN** los formularios de cuenta, categoría, registro e inicio de sesión
- **WHEN** se muestran
- **THEN** cada elemento form tiene el atributo noValidate

### Requirement: Foco en el primer campo inválido
Cuando un envío vuelve con errores de campo, el formulario SHALL llevar el foco al primer campo
inválido según el orden del formulario.

#### Scenario: Un envío con errores lleva el foco al primer campo inválido
- **GIVEN** el servidor rechazó la cuenta con errores en Nombre y en Saldo inicial
- **WHEN** se vuelve a mostrar el formulario de cuenta
- **THEN** el foco está en el campo Nombre

#### Scenario: Si solo falla un campo posterior, el foco va a ese campo
- **GIVEN** el servidor rechazó la cuenta solo por el saldo inicial "12.345"
- **WHEN** se vuelve a mostrar el formulario de cuenta
- **THEN** el foco está en el campo "Saldo inicial (opcional)"

#### Scenario: El formulario de categoría enfoca el nombre con error
- **GIVEN** el servidor rechazó la categoría con el error "Ya tienes una categoría de gasto con ese nombre"
- **WHEN** se vuelve a mostrar el formulario de categoría
- **THEN** el foco está en el campo Nombre

#### Scenario: El formulario de registro enfoca el primer campo con error
- **GIVEN** el servidor rechazó el registro con errores en Email y Contraseña
- **WHEN** se vuelve a mostrar el formulario de registro
- **THEN** el foco está en el campo Email

#### Scenario: Un error general sin errores de campo no mueve el foco
- **GIVEN** el guardado de la cuenta falló por un error del servidor sin errores de campo
- **WHEN** se vuelve a mostrar el formulario de cuenta
- **THEN** se muestra el aviso con role="alert" y el foco no se lleva a ningún campo
