# navegacion Specification

## Purpose

Da a todas las pantallas privadas de Cuadre una cabecera común con la marca, la navegación entre
secciones, la sección activa, el cierre de sesión y un menú para móvil.

## Requirements

### Requirement: Cabecera en las pantallas privadas
Toda pantalla privada SHALL mostrar una cabecera con la marca "Cuadre", que enlaza a /panel, y una
navegación principal con los enlaces "Panel" (/panel), "Transacciones" (/transacciones), "Cuentas"
(/cuentas) y "Categorías" (/categorias), en ese orden. La cabecera no muestra datos del usuario: el
aislamiento entre usuarios lo cubren las specs de cada pantalla.

#### Scenario: La cabecera muestra la marca y la navegación principal
- **GIVEN** un usuario con sesión activa
- **WHEN** se muestra cualquier pantalla privada
- **THEN** hay un banner con el enlace "Cuadre" a /panel
- **AND** una navegación con nombre accesible "Principal" que contiene, en orden, "Panel" (/panel), "Transacciones" (/transacciones), "Cuentas" (/cuentas) y "Categorías" (/categorias)

#### Scenario: Las pantallas privadas no enlazan de vuelta al panel
- **GIVEN** un usuario con sesión activa
- **WHEN** abre la pantalla de transacciones, la de cuentas o la de categorías
- **THEN** el contenido de la página no tiene ningún enlace "Volver al panel"

### Requirement: Sección activa
La navegación SHALL marcar con aria-current="page" el enlace de la sección en la que está el
usuario, incluidas sus subrutas, y ningún otro.

#### Scenario: La cabecera marca la sección activa
- **GIVEN** el usuario está en /cuentas
- **WHEN** se muestra la cabecera
- **THEN** el enlace "Cuentas" tiene aria-current="page"
- **AND** "Panel" y "Categorías" no tienen aria-current

#### Scenario: Una subruta mantiene activa su sección
- **GIVEN** el usuario está en /categorias/nueva
- **WHEN** se muestra la cabecera
- **THEN** el enlace "Categorías" tiene aria-current="page" y ningún otro enlace lo tiene

#### Scenario: La cabecera marca Transacciones como activa con filtros en la URL
- **GIVEN** el usuario está en /transacciones con los parámetros tipo=GASTO
- **WHEN** se muestra la cabecera
- **THEN** el enlace "Transacciones" tiene aria-current="page" y ningún otro enlace lo tiene

### Requirement: Menú de navegación en móvil
Por debajo del punto de corte de escritorio, la navegación y el cierre de sesión SHALL quedar en
un menú que se abre con un botón "Abrir menú". El menú atrapa el foco mientras está abierto, se
cierra con Escape o al elegir un enlace y devuelve el foco al botón.

#### Scenario: El menú móvil muestra la navegación y el cierre de sesión
- **GIVEN** la cabecera con el menú cerrado
- **WHEN** el usuario pulsa "Abrir menú"
- **THEN** el botón pasa a aria-expanded="true"
- **AND** se muestra un diálogo con los enlaces "Panel", "Transacciones", "Cuentas", "Categorías" y el botón "Cerrar sesión"

#### Scenario: Escape cierra el menú móvil y devuelve el foco
- **GIVEN** el menú móvil está abierto
- **WHEN** el usuario pulsa Escape
- **THEN** el menú se cierra y el foco vuelve al botón "Abrir menú"

#### Scenario: Elegir una sección cierra el menú móvil
- **GIVEN** el menú móvil está abierto
- **WHEN** el usuario pulsa "Cuentas"
- **THEN** el menú se cierra
