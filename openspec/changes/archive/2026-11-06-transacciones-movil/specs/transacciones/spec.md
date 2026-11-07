# Spec Delta

## MODIFIED Requirements

### Requirement: Pantalla de transacciones
La pantalla `/transacciones` SHALL tener el título "Transacciones" y una frase de propósito,
sin enlace de vuelta al panel. SHALL mostrar el formulario de alta, dentro de una tarjeta con
el título "Nueva transacción", y los movimientos. Por debajo del punto de corte de escritorio
SHALL mostrarlos en una sola columna con el formulario primero; desde escritorio, en dos
columnas, con los movimientos a la izquierda y el formulario a la derecha. En el orden del
documento el formulario SHALL ir antes que los movimientos, para que el orden de lectura y de
foco coincida con el visual en móvil. Entre el encabezado y el primer bloque SHALL haber una
única separación de sección, también cuando la región de avisos está vacía. Los movimientos
SHALL mostrarse en móvil como una lista agrupada por día, cuya cabecera del día de hoy en
Ecuador empieza por "Hoy · ", y en escritorio como una tabla con las columnas Fecha,
Descripción, Categoría, Cuenta e Importe; el importe SHALL llevar "+" en los ingresos y "−" en
los gastos. La vista SHALL tener un único botón primario, "Guardar transacción". Por debajo de
escritorio ese botón SHALL quedar fijo en la parte inferior de la pantalla, a todo el ancho y
por encima del margen seguro inferior del dispositivo; la página SHALL reservar debajo de su
contenido el espacio `reserva-barra-inferior` más ese margen seguro, y el documento SHALL usar
`reserva-barra-inferior` como `scroll-padding-bottom`, para que el botón no tape el campo enfocado. Desde escritorio el botón SHALL volver
a su sitio al final del formulario.

#### Scenario: Pantalla de transacciones muestra los movimientos y el formulario en dos columnas
- **GIVEN** el usuario tiene la cuenta "Caja" y un gasto de 25.50
- **WHEN** abre la pantalla de transacciones
- **THEN** ve el título de nivel 1 "Transacciones" y ningún enlace "Volver al panel"
- **AND** una tarjeta con el título de nivel 2 "Nueva transacción" y los movimientos están en una rejilla de una columna que pasa a dos desde el punto de corte de escritorio, con la tarjeta antes que los movimientos en el documento
- **AND** desde escritorio la tarjeta se coloca en la segunda columna y los movimientos en la primera, ambos en la primera fila
- **AND** la vista tiene un solo botón primario, "Guardar transacción"

#### Scenario: Listado muestra cada movimiento con su categoría, cuenta e importe con signo
- **GIVEN** el usuario tiene un gasto de 25.50 en "Caja", categoría "Insumos", descripción "Harina", del 2026-09-28, y un ingreso de 100.00 en "Caja", categoría "Ventas", sin descripción, del 2026-09-27
- **WHEN** abre la pantalla de transacciones
- **THEN** la tabla tiene las cabeceras Fecha, Descripción, Categoría, Cuenta e Importe, y la fila "28 sept 2026 · Harina · Insumos · Caja · −$25,50" antes de la fila del 27 sept 2026 con "Ventas", "Caja" y "+$100,00"
- **AND** la lista móvil agrupa el gasto bajo la cabecera del 28 sept y el ingreso bajo la del 27 sept, con los mismos importes

#### Scenario: La cabecera del día de hoy en la lista móvil empieza por Hoy
- **GIVEN** en Ecuador es el 6 de noviembre de 2026 y el usuario tiene un gasto de 25.50 del 2026-11-06 y otro de 10.00 del 2026-11-05
- **WHEN** abre la pantalla de transacciones
- **THEN** la lista móvil tiene las cabeceras de día "Hoy · vie, 6 nov" y "jue, 5 nov", en ese orden

#### Scenario: El botón Guardar transacción queda fijo abajo en móvil
- **GIVEN** el usuario tiene la cuenta "Caja"
- **WHEN** abre la pantalla de transacciones
- **THEN** el botón "Guardar transacción" sigue dentro del formulario y su contenedor está fijo en la parte inferior por debajo de escritorio, a todo el ancho, con un relleno inferior que incluye el margen seguro del dispositivo
- **AND** desde escritorio ese contenedor deja de estar fijo
- **AND** por debajo de escritorio el contenedor de la página reserva debajo del contenido `reserva-barra-inferior` más el margen seguro del dispositivo

#### Scenario: El botón fijo no tapa el campo enfocado
- **GIVEN** la hoja de estilos global de la aplicación
- **WHEN** se lee su regla para el documento por debajo del punto de corte de escritorio
- **THEN** el documento usa `--spacing-reserva-barra-inferior` como `scroll-padding-bottom`

#### Scenario: La región de avisos vacía no añade espacio bajo el encabezado
- **GIVEN** el usuario tiene la cuenta "Caja" y no acaba de registrar nada
- **WHEN** abre la pantalla de transacciones
- **THEN** el contenedor de la página tiene dos bloques separados por la separación de sección: el grupo del encabezado y el contenido
- **AND** la región aria-live="polite" de avisos está dentro del grupo del encabezado, después del título

### Requirement: Formulario de nueva transacción
El formulario SHALL tener, en este orden: un selector de tipo de dos opciones, "Gasto" e
"Ingreso", con Gasto marcado por defecto; cada opción SHALL llevar un icono decorativo (− en
Gasto, + en Ingreso) oculto a los lectores de pantalla, de modo que su nombre accesible sea
exactamente "Gasto" o "Ingreso"; el monto, con el prefijo "$" dentro del control; la categoría,
como lista desplegable nativa que ofrece solo las categorías del tipo marcado; la cuenta, como
lista desplegable nativa con la primera cuenta elegida; la fecha, que empieza en el día de hoy
en Ecuador; y la descripción opcional. SHALL desactivar la validación nativa del navegador y,
cuando un envío vuelve con errores de campo, SHALL llevar el foco al primer campo inválido. Al
abrir la pantalla ningún campo SHALL recibir el foco de forma automática.

#### Scenario: Selector de tipo empieza en Gasto y filtra las categorías
- **GIVEN** el usuario tiene sus 7 categorías por defecto
- **WHEN** abre el formulario y después elige "Ingreso"
- **THEN** al abrir está marcada la opción "Gasto" y la lista de categorías ofrece solo "Arriendo", "Insumos", "Otros", "Servicios básicos" y "Transporte"
- **AND** tras elegir "Ingreso" ofrece solo "Otros ingresos" y "Ventas"

#### Scenario: Los iconos del selector de tipo son decorativos
- **GIVEN** el usuario tiene la cuenta "Caja"
- **WHEN** se muestra el formulario
- **THEN** la opción "Gasto" contiene un icono − y la opción "Ingreso" un icono +, ambos con aria-hidden="true"
- **AND** los nombres accesibles de las opciones son exactamente "Gasto" e "Ingreso"

#### Scenario: Formulario de transacción usa controles nativos y el monto con prefijo
- **GIVEN** el usuario tiene las cuentas "Caja" y "Banco"
- **WHEN** se muestra el formulario
- **THEN** el formulario tiene el atributo noValidate
- **AND** categoría y cuenta son elementos select nativos, y la cuenta elegida es "Caja"
- **AND** el "$" y el campo de monto están dentro del mismo contenedor con borde, y el nombre accesible del campo es "Monto"

#### Scenario: Fecha del formulario empieza en el día de hoy
- **GIVEN** en Ecuador es el 28 de septiembre de 2026 a las 23:30
- **WHEN** se muestra el formulario de nueva transacción
- **THEN** el campo fecha vale "2026-09-28"

#### Scenario: Abrir la pantalla de transacciones no mueve el foco
- **GIVEN** el usuario tiene la cuenta "Caja"
- **WHEN** abre la pantalla de transacciones
- **THEN** el foco sigue en el cuerpo del documento y ningún campo del formulario tiene el atributo autofocus

#### Scenario: Formulario de transacción muestra el error junto a cada campo
- **GIVEN** el servidor rechazó el registro con un error en monto y otro en categoría
- **WHEN** se muestra el formulario
- **THEN** cada mensaje aparece junto a su campo, y ese campo queda marcado como inválido
- **AND** el foco está en el campo Monto

#### Scenario: Error al guardar la transacción conserva los datos escritos
- **GIVEN** el usuario eligió "Ingreso", escribió el monto "150.00" y la descripción "Venta de producto"
- **WHEN** el guardado falla por un error del servidor
- **THEN** ve, encima del botón, un aviso con role="alert": "No pudimos guardar la transacción. Inténtalo de nuevo."
- **AND** el formulario conserva el tipo ingreso, el monto "150.00" y la descripción "Venta de producto", y el foco no se lleva a ningún campo

### Requirement: Estados de la pantalla de transacciones
La pantalla SHALL mostrar los estados de vacío (sin cuentas, sin movimientos y vacío por
filtro), carga, error y éxito. Al cambiar un filtro SHALL conservar los movimientos anteriores
y mostrar "Actualizando…" junto a los filtros hasta que lleguen los nuevos. Los filtros SHALL
reflejarse en la URL con los parámetros `desde`, `hasta`, `tipo` y `cuentaId`. Por debajo de
escritorio los filtros SHALL empezar plegados tras un botón "Filtros", que SHALL indicar entre
paréntesis cuántos de esos cuatro parámetros están activos ("Filtros (2)") y SHALL llevar
`aria-expanded` y `aria-controls` apuntando a la región de filtros; pulsarlo SHALL desplegarlos
o plegarlos. Desde escritorio los filtros SHALL verse siempre, sin ese botón. "Actualizando…"
y "Quitar filtros" SHALL quedar fuera de la región plegable, visibles aunque esté plegada.

#### Scenario: Pantalla de transacciones sin cuentas pide crear una cuenta primero
- **GIVEN** el usuario no tiene cuentas
- **WHEN** abre la pantalla de transacciones
- **THEN** ve "Todavía no tienes cuentas. Crea una para empezar a registrar movimientos." y un enlace con estilo de botón primario "Crear cuenta" a /cuentas
- **AND** no se muestra el formulario

#### Scenario: Pantalla de transacciones sin movimientos muestra el estado vacío
- **GIVEN** el usuario tiene una cuenta, ningún movimiento y ningún filtro activo
- **WHEN** abre la pantalla de transacciones
- **THEN** ve "Todavía no tienes movimientos. Registra el primero con el formulario." y un botón secundario "Registrar movimiento" que lleva al campo monto

#### Scenario: Filtros sin resultados muestran el vacío por filtro
- **GIVEN** el usuario tiene movimientos, pero ninguno entre el 2026-09-01 y el 2026-09-15
- **WHEN** abre la pantalla con desde "2026-09-01" y hasta "2026-09-15"
- **THEN** ve "No hay movimientos del 1 al 15 de septiembre." y un botón terciario "Quitar filtros"
- **AND** al pulsarlo la URL queda sin parámetros de filtro

#### Scenario: Cambiar un filtro actualiza la URL y conserva los datos mientras carga
- **GIVEN** el usuario ve sus movimientos sin filtros
- **WHEN** elige el tipo "Gasto" en la barra de filtros
- **THEN** se navega a /transacciones?tipo=GASTO
- **AND** mientras llegan los datos se siguen viendo los movimientos anteriores y aparece "Actualizando…" junto a los filtros

#### Scenario: Quitar filtros solo aparece con un filtro activo
- **GIVEN** el usuario tiene movimientos
- **WHEN** abre la pantalla sin filtros y después con cuentaId de "Caja"
- **THEN** sin filtros no hay botón "Quitar filtros", y con el filtro sí

#### Scenario: Los filtros empiezan plegados en móvil y se despliegan con el botón Filtros
- **GIVEN** el usuario tiene un gasto de 25.50 y ningún filtro activo
- **WHEN** abre la pantalla de transacciones y pulsa "Filtros"
- **THEN** al abrir, el botón "Filtros" tiene aria-expanded="false" y aria-controls con el id de la región de filtros, que está oculta por debajo de escritorio y visible desde escritorio
- **AND** el botón solo se muestra por debajo de escritorio
- **AND** tras pulsarlo tiene aria-expanded="true" y la región de filtros se muestra también por debajo de escritorio
- **AND** al pulsarlo otra vez vuelve a aria-expanded="false" y la región se oculta por debajo de escritorio

#### Scenario: El botón Filtros indica cuántos filtros hay activos
- **GIVEN** el usuario tiene un gasto de 25.50
- **WHEN** abre la pantalla sin filtros, después con desde "2026-09-01" y hasta "2026-09-15", y después con tipo GASTO, desde "2026-09-01", hasta "2026-09-15" y cuentaId de "Caja"
- **THEN** el botón se llama "Filtros", "Filtros (2)" y "Filtros (4)", respectivamente

#### Scenario: Quitar filtros y Actualizando siguen visibles con los filtros plegados
- **GIVEN** el usuario tiene un gasto de 25.50 y el filtro cuentaId de "Caja"
- **WHEN** abre la pantalla sin desplegar los filtros
- **THEN** el botón "Quitar filtros" y la región aria-live de "Actualizando…" están fuera de la región de filtros plegable

#### Scenario: Transacción registrada se anuncia y se resalta en el listado
- **GIVEN** el usuario acaba de registrar un gasto de 25.50 en la cuenta "Efectivo"
- **WHEN** se vuelve a mostrar la pantalla
- **THEN** una región aria-live="polite" anuncia "Gasto de $25,50 registrado en Efectivo."
- **AND** la fila de ese movimiento tiene la animación de resaltado y ninguna otra fila la tiene

#### Scenario: La entrada de página se anima solo en el contenedor
- **GIVEN** el usuario tiene movimientos
- **WHEN** abre la pantalla de transacciones
- **THEN** solo el contenedor de la página tiene la animación de entrada; ninguna fila ni tarjeta la tiene

#### Scenario: Pantalla de transacciones en carga muestra un esqueleto ocupado
- **GIVEN** los movimientos todavía se están cargando
- **WHEN** se muestra la pantalla
- **THEN** se ve un esqueleto estático con forma de filas, en una región con aria-busy="true"

#### Scenario: Error al cargar las transacciones ofrece reintentar
- **GIVEN** la carga de los movimientos falló
- **WHEN** se muestra la pantalla
- **THEN** ve "No pudimos cargar tus movimientos." y un botón secundario "Reintentar"
- **AND** al pulsarlo se vuelve a intentar la carga
