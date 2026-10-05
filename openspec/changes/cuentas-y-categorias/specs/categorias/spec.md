# Spec Delta

## Purpose

Permite que el usuario autenticado consulte sus categorías de ingreso y de gasto y cree otras
nuevas de primer nivel para clasificar sus movimientos, sin duplicados y sin acceder a las
categorías de otro usuario.

## ADDED Requirements

### Requirement: Consulta de categorías propias
El sistema SHALL devolver al usuario autenticado sus categorías de primer nivel, separadas en
las de ingreso y las de gasto.

#### Scenario: Usuario nuevo ve sus 7 categorías por defecto separadas por tipo
- **GIVEN** el usuario A acaba de registrarse
- **WHEN** consulta sus categorías
- **THEN** las de gasto son "Arriendo", "Insumos", "Otros", "Servicios básicos" y "Transporte"
- **AND** las de ingreso son "Otros ingresos" y "Ventas"

### Requirement: Creación de categoría
El sistema SHALL permitir al usuario autenticado crear una categoría de primer nivel con
nombre y tipo, ingreso o gasto. El nombre se SHALL guardar sin los espacios del inicio y del
final y, sin ellos, SHALL tener entre 1 y 150 caracteres. El nombre MUST ser único entre las
categorías del mismo usuario y del mismo tipo, sin distinguir mayúsculas de minúsculas. La
base de datos MUST garantizarlo también cuando llegan dos envíos a la vez. Toda entrada SHALL validarse en el servidor y, si es inválida, SHALL rechazarse con un error
por campo sin crear la categoría.

#### Scenario: Crear una categoría de gasto
- **GIVEN** el usuario A tiene sus categorías por defecto
- **WHEN** crea la categoría "  Publicidad  " de tipo gasto
- **THEN** sus categorías de gasto incluyen "Publicidad", guardada sin los espacios y sin categoría padre

#### Scenario: Crear una categoría de ingreso
- **GIVEN** el usuario A tiene sus categorías por defecto
- **WHEN** crea la categoría "Servicios técnicos" de tipo ingreso
- **THEN** sus categorías de ingreso incluyen "Servicios técnicos", sin categoría padre

#### Scenario: Crear categoría rechazada por nombre vacío
- **GIVEN** el usuario A tiene sus 7 categorías por defecto
- **WHEN** intenta crear una categoría con nombre "   " de tipo gasto
- **THEN** la creación se rechaza con un error en el campo nombre
- **AND** A sigue teniendo 7 categorías

#### Scenario: Crear categoría rechazada por nombre duplicado en el mismo tipo
- **GIVEN** el usuario A tiene la categoría de ingreso "Ventas"
- **WHEN** intenta crear la categoría " ventas " de tipo ingreso
- **THEN** la creación se rechaza con el error "Ya tienes una categoría de ingreso con ese nombre" en el campo nombre
- **AND** A sigue teniendo 7 categorías

#### Scenario: Categorías duplicadas rechazadas aunque se envíen a la vez
- **GIVEN** el usuario A tiene sus 7 categorías por defecto
- **WHEN** se envían a la vez la creación de la categoría de gasto "Publicidad" y la de "PUBLICIDAD"
- **THEN** exactamente una se crea y la otra se rechaza con el error "Ya tienes una categoría de gasto con ese nombre"
- **AND** A tiene 8 categorías

#### Scenario: Longitud máxima del nombre de categoría es 150 caracteres
- **GIVEN** el usuario A tiene sus 7 categorías por defecto
- **WHEN** crea una categoría de gasto cuyo nombre son 150 letras "a" rodeadas de dos espacios a cada lado, y después intenta crear otra con 151 letras "b"
- **THEN** la primera se crea con el nombre de 150 caracteres, sin los espacios
- **AND** la segunda se rechaza con un error en el campo nombre, y A tiene 8 categorías

#### Scenario: Mismo nombre permitido en el otro tipo
- **GIVEN** el usuario A tiene la categoría de gasto "Otros" y ninguna de ingreso con ese nombre
- **WHEN** crea la categoría "Otros" de tipo ingreso
- **THEN** sus categorías de ingreso incluyen "Otros" y sus categorías de gasto siguen incluyendo "Otros"

#### Scenario: Crear categoría rechazada por tipo inválido
- **GIVEN** el usuario A tiene sus 7 categorías por defecto
- **WHEN** intenta crear la categoría "Ahorro" con tipo "AHORRO"
- **THEN** la creación se rechaza con un error en el campo tipo
- **AND** A sigue teniendo 7 categorías

### Requirement: Aislamiento de categorías entre usuarios
El sistema MUST limitar toda consulta y creación de categorías al usuario de la sesión. Las
categorías de otro usuario MUST no verse ni contar para la regla de duplicados. El usuario
dueño de una categoría nueva MUST tomarse de la sesión, nunca de los datos enviados. Sin
sesión, ninguna operación sobre categorías se SHALL ejecutar.

#### Scenario: Un usuario no ve las categorías de otro
- **GIVEN** el usuario A creó la categoría de gasto "Publicidad" y el usuario B solo tiene sus categorías por defecto
- **WHEN** B consulta sus categorías
- **THEN** B ve exactamente sus 7 categorías por defecto, sin "Publicidad"

#### Scenario: El nombre de una categoría de otro usuario no cuenta como duplicado
- **GIVEN** el usuario A tiene la categoría de gasto "Publicidad"
- **WHEN** el usuario B crea la categoría "Publicidad" de tipo gasto
- **THEN** la creación se acepta y la categoría es de B
- **AND** A sigue teniendo una sola categoría "Publicidad"

#### Scenario: La categoría se crea siempre para el usuario de la sesión
- **GIVEN** el usuario A está autenticado
- **WHEN** envía el formulario de nueva categoría con un campo adicional que indica el identificador del usuario B
- **THEN** la categoría se crea para A y no para B

#### Scenario: Crear una categoría sin sesión redirige al login
- **GIVEN** no hay sesión activa
- **WHEN** se envía el formulario de nueva categoría
- **THEN** se redirige a /login y no se intenta crear ninguna categoría

### Requirement: Pantalla de categorías
La pantalla de categorías SHALL mostrar por separado las categorías de ingreso y las de gasto
del usuario, e incluir el formulario para crear una categoría con nombre y tipo. SHALL mostrar
un estado de carga, uno de error y uno de éxito.

#### Scenario: Pantalla de categorías muestra las de ingreso y las de gasto por separado
- **GIVEN** el usuario tiene sus 7 categorías por defecto
- **WHEN** abre la pantalla de categorías
- **THEN** ve una sección "Ingresos" con "Otros ingresos" y "Ventas", y una sección "Gastos" con sus 5 categorías de gasto

#### Scenario: Formulario de categoría muestra el error junto al nombre
- **GIVEN** el servidor rechazó la creación con el error "Ya tienes una categoría de ingreso con ese nombre"
- **WHEN** se muestra el formulario
- **THEN** el mensaje aparece junto al campo nombre y el campo queda marcado como inválido

#### Scenario: Error al guardar la categoría conserva los datos escritos
- **GIVEN** el usuario escribió el nombre "Publicidad" y eligió el tipo gasto
- **WHEN** el guardado falla por un error del servidor
- **THEN** ve, encima del botón, un aviso con role="alert": "No se pudo guardar la categoría. Revisa tu conexión y vuelve a intentarlo."
- **AND** el formulario conserva el nombre "Publicidad" y el tipo gasto

#### Scenario: Categoría creada se anuncia y se resalta en la lista
- **GIVEN** el usuario acaba de crear la categoría de gasto "Publicidad"
- **WHEN** se vuelve a mostrar la pantalla
- **THEN** una región aria-live="polite" anuncia "Categoría Publicidad creada."
- **AND** la fila de "Publicidad" está resaltada

#### Scenario: Pantalla de categorías en carga muestra un esqueleto ocupado
- **GIVEN** las categorías todavía se están cargando
- **WHEN** se muestra la pantalla
- **THEN** se ve un esqueleto estático con forma de filas, en una región con aria-busy="true"

#### Scenario: Error al cargar las categorías ofrece reintentar
- **GIVEN** la carga de las categorías falló
- **WHEN** se muestra la pantalla
- **THEN** ve "No se pudieron cargar tus categorías." y un botón secundario "Reintentar"
- **AND** al pulsarlo se vuelve a intentar la carga
