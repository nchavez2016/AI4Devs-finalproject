# Spec Delta: autenticacion

## MODIFIED Requirements

### Requirement: Cierre de sesión
El sistema SHALL permitir cerrar la sesión desde la cabecera de cualquier pantalla privada.

#### Scenario: Cierre de sesión termina la sesión y redirige al login
- **GIVEN** un usuario con sesión activa en "/panel"
- **WHEN** pulsa "Cerrar sesión"
- **THEN** la sesión termina y se le redirige a "/login"

#### Scenario: La cabecera ofrece cerrar sesión en cada pantalla privada
- **GIVEN** un usuario con sesión activa en "/cuentas"
- **WHEN** se muestra la cabecera
- **THEN** contiene un botón "Cerrar sesión" que no es el botón primario de la vista
- **AND** el contenido del panel no tiene su propio botón "Cerrar sesión"

## ADDED Requirements

### Requirement: Pantallas de acceso con la marca
Las pantallas de inicio de sesión y de registro SHALL mostrarse en una tarjeta centrada que
incluye la marca "Cuadre", el título de la pantalla y su formulario, y SHALL enlazar una con
otra.

#### Scenario: El inicio de sesión se muestra en una tarjeta con la marca
- **GIVEN** un visitante sin sesión
- **WHEN** abre "/login"
- **THEN** ve, dentro de una misma tarjeta, la marca "Cuadre", el título "Iniciar sesión" y el formulario
- **AND** un enlace a "/registro"

#### Scenario: El registro se muestra en una tarjeta con la marca
- **GIVEN** un visitante sin sesión
- **WHEN** abre "/registro"
- **THEN** ve, dentro de una misma tarjeta, la marca "Cuadre", el título "Crear cuenta" y el formulario
- **AND** un enlace a "/login"
