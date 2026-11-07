## ADDED Requirements

> Los escenarios asumen las opciones recomendadas en design.md (decisiones 0.1 a 0.6). Si el
> humano elige otra, se actualiza esta spec antes de aplicar (tasks.md, 0.8).
> En todos ellos "hoy" es el 2026-11-06 (viernes) en Ecuador, salvo que el escenario diga otra cosa.

### Requirement: Período del dashboard
El dashboard SHALL mostrar los datos del período indicado en la URL con el parámetro `periodo`
(`dia`, `semana` o `mes`). Sin parámetro, o con un valor no válido, SHALL usar `mes`. Los límites
SHALL ser fechas calendario de Ecuador (America/Guayaquil), con ambos extremos incluidos,
independientemente de la zona horaria del servidor: `dia` es hoy; `semana` va de lunes a domingo
de la semana de hoy; `mes` va del día 1 al último día del mes de hoy.

#### Scenario: Ver totales del período
- **GIVEN** el usuario A tiene en noviembre de 2026 un ingreso de 1200.00 y dos gastos de 400.00 y 380.50
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve ingresos 1200.00, gastos 780.50 y balance 419.50

#### Scenario: El período por defecto es el mes en curso
- **GIVEN** el usuario A tiene un ingreso de 100.00 el 2026-11-02 y otro de 50.00 el 2026-10-30
- **WHEN** abre el dashboard sin parámetro de período
- **THEN** el período activo es "mes" y ve ingresos 100.00

#### Scenario: Un período inválido en la URL se trata como mes
- **GIVEN** el usuario A tiene un ingreso de 100.00 el 2026-11-02
- **WHEN** abre el dashboard con `periodo=anio`
- **THEN** el período activo es "mes" y ve ingresos 100.00

#### Scenario: El período día solo cuenta las transacciones de hoy
- **GIVEN** el usuario A tiene un gasto de 12.40 el 2026-11-06 y otro de 7.60 el 2026-11-05
- **WHEN** abre el dashboard con el período "dia"
- **THEN** ve gastos 12.40

#### Scenario: El período semana va de lunes a domingo
- **GIVEN** el usuario A tiene gastos de 10.00 el 2026-11-01 (domingo), 20.25 el 2026-11-02 (lunes), 30.50 el 2026-11-08 (domingo) y 40.00 el 2026-11-09 (lunes)
- **WHEN** abre el dashboard con el período "semana"
- **THEN** ve gastos 50.75

#### Scenario: Los límites del período usan la fecha de Ecuador
- **GIVEN** el instante actual es 2026-12-01T03:30:00Z (30 de noviembre, 22:30 en Ecuador)
- **AND** el usuario A tiene un ingreso de 80.00 el 2026-11-30 y otro de 15.00 el 2026-12-01
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve ingresos 80.00

#### Scenario: Las transacciones fuera del período no cuentan en los totales
- **GIVEN** el usuario A tiene ingresos de 300.00 el 2026-10-31, 45.50 el 2026-11-01 y 4.50 el 2026-11-30
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve ingresos 50.00

#### Scenario: El balance negativo se muestra con su signo
- **GIVEN** el usuario A tiene en noviembre de 2026 un ingreso de 50.00 y un gasto de 80.25
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve balance -30.25, mostrado con el signo menos y no solo con color

#### Scenario: Los importes del dashboard se suman sin redondeos intermedios
- **GIVEN** el usuario A tiene en noviembre de 2026 ingresos de 0.10 y 0.20 y un gasto de 0.30
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve ingresos 0.30, gastos 0.30 y balance 0.00

#### Scenario: El selector de período marca el período activo
- **GIVEN** el usuario A abre el dashboard con el período "semana"
- **WHEN** se muestra el selector de período
- **THEN** hay tres enlaces "Hoy", "Esta semana" y "Este mes" a `/panel?periodo=dia`, `/panel?periodo=semana` y `/panel?periodo=mes`
- **AND** solo "Esta semana" tiene aria-current="page"

#### Scenario: Cambiar de período muestra Actualizando junto al selector
- **GIVEN** el usuario A está en el dashboard con datos del período "mes"
- **WHEN** elige otro período y la navegación sigue pendiente
- **THEN** junto al selector aparece "Actualizando…" y los datos anteriores siguen visibles

### Requirement: Saldo por cuenta
El dashboard SHALL mostrar cada cuenta del usuario con su saldo actual: saldo inicial más todos
sus ingresos menos todos sus gastos, sin limitarse al período elegido. Una cuenta sin movimientos
SHALL mostrarse con su saldo inicial.

#### Scenario: Ver saldo por cuenta
- **GIVEN** el usuario A tiene "Banco" con saldo inicial 500.00, un ingreso de 200.00 y un gasto de 50.00, y "Caja" con saldo inicial 0.00 y un gasto de 12.75
- **WHEN** abre el dashboard
- **THEN** ve "Banco" con saldo 650.00 y "Caja" con saldo -12.75

#### Scenario: El saldo por cuenta incluye movimientos fuera del período
- **GIVEN** el usuario A tiene "Banco" con saldo inicial 100.00 y un ingreso de 25.25 el 2026-10-15
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve "Banco" con saldo 125.25 e ingresos del período 0.00

#### Scenario: Una cuenta sin movimientos muestra su saldo inicial
- **GIVEN** el usuario A tiene "Ahorro negocio" con saldo inicial 320.40 y sin transacciones
- **WHEN** abre el dashboard
- **THEN** ve "Ahorro negocio" con saldo 320.40

#### Scenario: Usuario sin cuentas ve cómo crear una
- **GIVEN** el usuario A no tiene cuentas
- **WHEN** abre el dashboard
- **THEN** la sección de saldos dice "Todavía no tienes cuentas." y tiene un enlace terciario "Crear cuenta" a /cuentas

### Requirement: Principales categorías de gasto
El dashboard SHALL mostrar las categorías de gasto con gastos en el período, ordenadas de mayor a
menor total; a igual total, por nombre. SHALL mostrar como máximo cinco. Las categorías sin gastos
en el período no aparecen.

#### Scenario: Ver principales categorías de gasto
- **GIVEN** el usuario A tiene en noviembre de 2026 gastos de 95.25 en "Insumos", 400.00 en "Arriendo" y 120.00 + 60.50 en "Servicios básicos"
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve "Arriendo" 400.00, "Servicios básicos" 180.50 e "Insumos" 95.25, en ese orden

#### Scenario: Las categorías de gasto solo cuentan gastos del período
- **GIVEN** el usuario A tiene un gasto de 70.00 en "Arriendo" el 2026-10-31 y uno de 30.00 en "Insumos" el 2026-11-03
- **WHEN** abre el dashboard con el período "mes"
- **THEN** solo ve "Insumos" 30.00

#### Scenario: Las categorías con el mismo total se ordenan por nombre
- **GIVEN** el usuario A tiene en noviembre de 2026 gastos de 25.00 en "Servicios básicos" y 25.00 en "Arriendo"
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve "Arriendo" antes que "Servicios básicos"

#### Scenario: El dashboard muestra como máximo cinco categorías de gasto
- **GIVEN** el usuario A tiene en noviembre de 2026 gastos en seis categorías, de 60.00, 50.00, 40.00, 30.00, 20.00 y 10.00
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve las cinco primeras, de 60.00 a 20.00, y no ve la de 10.00

#### Scenario: Período sin gastos muestra el aviso de la sección
- **GIVEN** el usuario A solo tiene en noviembre de 2026 un ingreso de 100.00
- **WHEN** abre el dashboard con el período "mes"
- **THEN** la sección de categorías dice "No hay gastos registrados en este período." y no dibuja ningún gráfico

### Requirement: Gráfico de categorías accesible
El gráfico de categorías de gasto SHALL ser de barras horizontales y SHALL tener una alternativa
textual con los mismos datos: un resumen como etiqueta de imagen y una tabla con las columnas
Categoría e Importe. La tabla SHALL poder mostrarse a cualquier persona con un control
"Ver como tabla". El gráfico no SHALL depender solo del color.

#### Scenario: El gráfico de categorías tiene una alternativa en tabla
- **GIVEN** el usuario A tiene en noviembre de 2026 gastos de 400.00 en "Arriendo" y 95.25 en "Insumos"
- **WHEN** abre el dashboard con el período "mes"
- **THEN** el gráfico tiene role="img" y la etiqueta "Categorías de gasto de mayor a menor, de $400,00 a $95,25"
- **AND** hay una tabla con las filas "Arriendo" $400,00 e "Insumos" $95,25

#### Scenario: Ver como tabla muestra la tabla a cualquier persona
- **GIVEN** el dashboard muestra el gráfico de categorías
- **WHEN** el usuario pulsa "Ver como tabla"
- **THEN** la tabla de categorías es visible y el control indica que está expandido

### Requirement: Estados del dashboard
El dashboard SHALL mostrar el nombre del negocio como único `h1` y exactamente un botón primario,
"Registrar movimiento", que lleva a /transacciones. Sin transacciones SHALL mostrar los totales
en cero e invitar a registrar la primera. Mientras carga SHALL mostrar un esqueleto ocupado y,
si la carga falla, un mensaje con "Reintentar".

#### Scenario: Dashboard sin datos
- **GIVEN** el usuario A es nuevo y no tiene transacciones
- **WHEN** abre el dashboard
- **THEN** ve ingresos, gastos y balance en $0,00
- **AND** ve "Todavía no has registrado movimientos. Registra el primero para ver tu resumen." con el botón primario "Registrar movimiento" a /transacciones

#### Scenario: Período sin movimientos muestra el aviso del período
- **GIVEN** el usuario A tiene transacciones en octubre de 2026 y ninguna en noviembre
- **WHEN** abre el dashboard con el período "mes"
- **THEN** ve ingresos, gastos y balance en $0,00 y "No hay movimientos en este período."

#### Scenario: El dashboard tiene una sola acción primaria
- **GIVEN** el usuario A tiene transacciones en el período
- **WHEN** abre el dashboard
- **THEN** el `h1` es el nombre de su negocio y la vista tiene un solo botón primario, "Registrar movimiento", a /transacciones

#### Scenario: Dashboard en carga muestra un esqueleto ocupado
- **GIVEN** los datos del dashboard todavía se están cargando
- **WHEN** se muestra la pantalla
- **THEN** se ve un esqueleto estático con la forma de los totales, los saldos y las categorías, en una región con aria-busy="true"

#### Scenario: Error al cargar el dashboard ofrece reintentar
- **GIVEN** la carga del dashboard falló
- **WHEN** se muestra la pantalla
- **THEN** ve "No pudimos cargar tu resumen." y un botón secundario "Reintentar"
- **AND** al pulsarlo se vuelve a intentar la carga

### Requirement: Aislamiento del dashboard entre usuarios
Todos los datos del dashboard SHALL limitarse al usuario de la sesión. Sin sesión SHALL redirigir
a /login.

#### Scenario: El dashboard no incluye datos de otro usuario
- **GIVEN** el usuario A tiene en noviembre de 2026 un gasto de 10.00 en "Insumos" y la cuenta "Caja"
- **AND** el usuario B tiene en noviembre de 2026 un ingreso de 999.99, un gasto de 500.00 en "Publicidad" y la cuenta "Banco Beto"
- **WHEN** A abre el dashboard con el período "mes"
- **THEN** ve ingresos 0.00 y gastos 10.00
- **AND** no ve "Publicidad" ni "Banco Beto"

#### Scenario: Abrir el dashboard sin sesión redirige al login
- **GIVEN** no hay sesión activa
- **WHEN** se cargan los datos del dashboard
- **THEN** se redirige a /login
