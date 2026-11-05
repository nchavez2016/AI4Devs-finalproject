# Spec Delta: categorias

## MODIFIED Requirements

### Requirement: Pantalla de categorías
La pantalla de categorías SHALL mostrar por separado las categorías de ingreso y las de gasto
del usuario, e incluir el formulario para crear una categoría con nombre y tipo dentro de una
tarjeta con título. En escritorio, las listas y la tarjeta del formulario SHALL ir en dos
columnas; en móvil, en una sola columna con las listas primero. SHALL mostrar un estado de
carga, uno de error y uno de éxito, con un único botón primario en la vista.

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
- **THEN** ve, encima del botón, un aviso con role="alert": "No pudimos guardar la categoría. Inténtalo de nuevo."
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
- **THEN** ve "No pudimos cargar tus categorías." y un botón secundario "Reintentar"
- **AND** al pulsarlo se vuelve a intentar la carga

#### Scenario: Pantalla de categorías muestra las listas y el formulario en dos columnas
- **GIVEN** el usuario tiene sus 7 categorías por defecto
- **WHEN** abre la pantalla de categorías
- **THEN** las secciones de ingreso y gasto y una tarjeta con el título de nivel 2 "Nueva categoría" están en una rejilla de una columna que pasa a dos desde el punto de corte de escritorio
- **AND** las secciones van antes que la tarjeta y la tarjeta contiene el formulario
- **AND** la vista tiene un solo botón primario, "Crear categoría"
