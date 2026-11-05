# autenticacion Specification

## Purpose

Permite que una persona cree su espacio de trabajo en Cuadre, entre y salga de él, y
garantiza que solo un usuario autenticado accede a las rutas privadas y a sus propios datos.

## Requirements

### Requirement: Registro de usuario
El sistema SHALL permitir registrarse con nombre, nombre del negocio, email y contraseña.
El nombre y el nombre del negocio SHALL no estar vacíos tras quitar los espacios. El email
SHALL tener un formato válido, guardarse sin espacios alrededor y en minúsculas, y ser
único. La contraseña SHALL tener al menos 8 caracteres. Toda entrada SHALL validarse en el
servidor.

#### Scenario: Registro válido crea el usuario
- **GIVEN** no existe ningún usuario con el email "ana@tienda.ec"
- **WHEN** se registra con nombre "Ana", negocio "Tienda Ana", email "ana@tienda.ec" y contraseña "clave-segura-1"
- **THEN** existe un usuario con ese email, nombre "Ana" y nombre del negocio "Tienda Ana"

#### Scenario: Registro rechazado por email duplicado
- **GIVEN** existe un usuario con el email "ana@tienda.ec"
- **WHEN** alguien intenta registrarse con el email " ANA@Tienda.ec "
- **THEN** el registro se rechaza indicando que el email ya está registrado
- **AND** sigue existiendo un solo usuario con ese email y no se crea ninguna categoría nueva

#### Scenario: Registro rechazado por datos inválidos
- **GIVEN** un formulario de registro con nombre "", nombre del negocio "   ", email "no-es-un-email" y contraseña "1234567"
- **WHEN** se envía el registro
- **THEN** el registro se rechaza con un error por cada uno de esos cuatro campos
- **AND** no se crea ningún usuario

### Requirement: Contraseña almacenada con hash
El sistema MUST guardar solo un hash con sal de la contraseña, nunca el texto plano.

#### Scenario: La contraseña se guarda con hash y nunca en texto plano
- **GIVEN** dos usuarios que se registran con la misma contraseña "clave-segura-1"
- **WHEN** se lee lo almacenado para cada uno
- **THEN** ninguno de los valores guardados contiene "clave-segura-1"
- **AND** los dos valores guardados son distintos entre sí

### Requirement: Categorías por defecto al registrarse
Al registrarse, el sistema SHALL crear para el usuario nuevo, de forma atómica con el propio
usuario, las categorías de gasto "Insumos", "Servicios básicos", "Arriendo", "Transporte" y
"Otros", y las categorías de ingreso "Ventas" y "Otros ingresos", todas de primer nivel.

#### Scenario: Registro crea las categorías por defecto
- **GIVEN** un usuario recién registrado
- **WHEN** se consultan sus categorías
- **THEN** tiene exactamente 5 categorías de gasto y 2 de ingreso con los nombres por defecto, sin categoría padre

#### Scenario: Categorías por defecto aisladas por usuario
- **GIVEN** el usuario A ya está registrado y tiene sus 7 categorías por defecto
- **WHEN** se registra el usuario B
- **THEN** A sigue teniendo exactamente sus 7 categorías y B tiene 7 categorías propias
- **AND** ninguna categoría de B pertenece a A

### Requirement: Inicio de sesión con credenciales
El sistema SHALL iniciar sesión solo cuando email y contraseña coinciden con un usuario
registrado. Ante cualquier fallo SHALL responder con el mismo mensaje genérico, sin revelar
si el email existe.

#### Scenario: Inicio de sesión con credenciales correctas
- **GIVEN** un usuario registrado con email "ana@tienda.ec" y contraseña "clave-segura-1"
- **WHEN** inicia sesión con "Ana@Tienda.ec" y "clave-segura-1"
- **THEN** se obtiene la identidad de ese usuario, con su id, nombre y nombre del negocio

#### Scenario: Inicio de sesión con contraseña incorrecta
- **GIVEN** un usuario registrado con email "ana@tienda.ec"
- **WHEN** inicia sesión con "ana@tienda.ec" y contraseña "otra-clave-99"
- **THEN** no se inicia sesión y se muestra "Email o contraseña incorrectos"

#### Scenario: Inicio de sesión con email no registrado
- **GIVEN** no existe ningún usuario con el email "nadie@tienda.ec"
- **WHEN** alguien inicia sesión con ese email
- **THEN** no se inicia sesión y se muestra el mismo mensaje "Email o contraseña incorrectos"

### Requirement: Protección de rutas privadas
Toda ruta que no sea `/login`, `/registro` o un recurso público SHALL exigir una sesión
activa; sin ella SHALL redirigir a `/login`.

#### Scenario: Ruta privada sin sesión redirige al login
- **GIVEN** una petición sin sesión activa
- **WHEN** se pide la ruta "/panel"
- **THEN** la respuesta redirige a "/login"

#### Scenario: Rutas públicas accesibles sin sesión
- **GIVEN** una petición sin sesión activa
- **WHEN** se piden las rutas "/login" y "/registro"
- **THEN** ninguna de las dos redirige

#### Scenario: La raíz lleva al panel
- **GIVEN** cualquier visitante
- **WHEN** pide la ruta "/"
- **THEN** se le redirige a "/panel"

### Requirement: Página privada del usuario autenticado
La página privada SHALL mostrar el nombre del negocio del usuario de la sesión activa y de
ningún otro.

#### Scenario: El panel muestra el negocio del usuario autenticado
- **GIVEN** existen los usuarios A (negocio "Tienda Ana") y B (negocio "Taller Beto")
- **WHEN** A con su sesión activa abre "/panel"
- **THEN** ve "Tienda Ana" y no ve "Taller Beto"

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

### Requirement: Configuración validada al arrancar
La aplicación SHALL negarse a arrancar si falta o es inválida la URL de la base de datos o el
secreto de sesión, indicando qué variable falla sin mostrar su valor.

#### Scenario: Configuración incompleta impide arrancar
- **GIVEN** un entorno sin secreto de sesión
- **WHEN** se carga la configuración
- **THEN** falla con un error que nombra la variable del secreto de sesión

#### Scenario: Configuración completa se acepta
- **GIVEN** un entorno con una URL de PostgreSQL válida y un secreto de al menos 32 caracteres
- **WHEN** se carga la configuración
- **THEN** la configuración expone ambos valores
