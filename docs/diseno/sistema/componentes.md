# Componentes base — Cuadre

Sección 7 del sistema de diseño. Índice completo en [README.md](README.md).

## 7. Componentes base

Los componentes usan solo clases de tokens (tokens.md, 3.3). Donde se nombra un token sin prefijo, se refiere
a su clase: `bg-primary`, `text-detalle`, `h-alto-control`, `rounded-control`.

### 7.1 Botón

| Variante | Aspecto | Cuándo |
|---|---|---|
| **Primario** | Fondo `primary`, texto `primary-foreground`, hover `primary-hover` | La acción principal de la vista. **Solo uno por vista.** |
| **Secundario** | Fondo `secondary`, borde `input`, texto `secondary-foreground`, hover `muted` | Acciones alternativas: "Cancelar", "Reintentar". |
| **Terciario** | Sin fondo ni borde, texto `primary`, hover `muted` | Acciones de bajo peso: "Quitar filtros". |
| **Destructivo** | Fondo `destructive`, texto `destructive-foreground`, hover `destructive-hover` | Solo dentro del diálogo que confirma una eliminación. |

- El disparador de una eliminación ("Eliminar movimiento") es terciario con texto `destructive`; el botón destructivo sólido solo aparece en la confirmación. — Por qué: un botón rojo grande en pantalla compite con el primario y invita a pulsarlo por error.
- Medidas: alto `alto-control`, relleno `control-x`, texto `cuerpo` con peso `control`, radio `control`, separación icono-texto `icono-texto`. — Por qué: se pulsa con el pulgar y supera con margen el objetivo mínimo de WCAG 2.2.
- Etiqueta con verbo y objeto: "Guardar gasto", "Crear cuenta"; nunca "Enviar" ni "Aceptar". — Por qué: dice qué va a pasar antes de pulsar.
- **Carga:** `aria-busy="true"`, deshabilitado, la etiqueta se oculta de forma invisible (sigue ocupando su sitio) y el indicador (`animate-giro`) se centra encima; "Guardando…" se anuncia a lectores de pantalla. — Por qué: el ancho no cambia y el botón no se puede pulsar dos veces.
- **Deshabilitado:** fondo `muted`, texto `muted-foreground`; se prefiere dejar el botón activo y explicar el error al pulsar. — Por qué: un botón gris no dice qué falta.
- Botón solo con icono: `aria-label` obligatorio y área `objetivo-tactil`. — Por qué: sin texto visible, el nombre accesible es la única etiqueta.
- En el registro móvil, el primario ocupa todo el ancho y queda fijo en la parte inferior, respetando `safe-area-inset-bottom`; el contenido reserva `reserva-barra-inferior`. — Por qué: queda al alcance del pulgar sin tapar el campo enfocado.

### 7.2 Campo de formulario

- Etiqueta siempre visible encima del campo, en `etiqueta`, separada `etiqueta`; nunca un placeholder en su lugar. — Por qué: el placeholder desaparece al escribir y no se lee bien.
- Los opcionales se marcan con "(opcional)" y los obligatorios no llevan marca. — Por qué: casi todos los campos son obligatorios; se señala la excepción.
- Campo: fondo `card`, borde `input`, radio `control`, alto `alto-campo`, relleno `campo-x`, texto `cuerpo`. — Por qué: objetivo cómodo y sin zoom en iOS.
- Ayuda debajo, en `detalle` y `muted-foreground`, separada `mensaje` y enlazada con `aria-describedby`. — Por qué: el lector de pantalla la lee al entrar en el campo.
- **Error:** borde `destructive`, icono `icono-detalle` y mensaje en `destructive` que dice cómo arreglarlo ("El monto debe ser mayor que 0"); `aria-invalid="true"`. — Por qué: el error se entiende sin color y el mensaje enseña la corrección.
- La validación se muestra al enviar y, a partir de ahí, al salir de cada campo; nunca con cada tecla. — Por qué: no se marca como error algo que el usuario todavía está escribiendo.
- Al enviar con errores, el foco va al primer campo inválido. — Por qué: con teclado y lector de pantalla es el camino más corto a la corrección.

**Selector (lista desplegable)**
- Elemento `select` nativo con las mismas medidas y tokens que el campo (fondo `card`, borde `input`, radio `control`, alto `alto-campo`, relleno `campo-x`, texto `cuerpo`), no el Select de shadcn/ui. — Por qué: el nativo abre el selector del sistema en el móvil, es accesible sin código extra y no añade dependencias.

**Campo de monto**
- `inputmode="decimal"`; acepta coma o punto decimal y al salir del campo se muestra en formato `es-EC` ("25,50"). — Por qué: en el móvil aparece el teclado numérico y en Ecuador se escriben ambos separadores.
- Prefijo `$` fijo y no editable; cifra en `importe-campo`. — Por qué: la cantidad es el dato protagonista del registro.
- Sin signo: el tipo (Ingreso o Gasto) decide si suma o resta. — Por qué: coincide con la regla del dominio (monto siempre mayor que 0).

**Selector de tipo (Ingreso / Gasto)**
- Grupo de dos radios en forma de control segmentado, cada opción con icono y texto: "− Gasto", "+ Ingreso". "Gasto" va primero y es la opción por defecto. — Por qué: es el movimiento más frecuente, y el tipo se distingue sin color.
- Opción seleccionada: fondo `card` (Gasto) o `ingreso-fondo` (Ingreso), borde `input`, peso `enfasis`. Opción no seleccionada: sobre `muted`, peso `lectura`. Alto `alto-control`. — Por qué: la selección se ve por forma y peso, no solo por color.

**Orden del registro en móvil:** Tipo → Monto (recibe el foco al abrir) → Categoría (filtrada por
tipo) → Cuenta (por defecto, la última usada en el dispositivo) → Fecha (por defecto, hoy) →
Descripción (opcional). — Por qué: el caso habitual se completa con monto y categoría.

### 7.3 Tarjeta

- Fondo `card`, borde `border`, radio `superficie`, relleno `tarjeta`, sin sombra. — Por qué: separa sin la rejilla de tarjetas con sombra prohibida.
- Se usa para **agrupar** contenido (por ejemplo, "Saldo por cuenta"), no para envolver cada dato. — Por qué: tarjetas dentro de tarjetas e importes sueltos en cajas es el patrón de plantilla que se quiere evitar.
- El balance del período no va en una tarjeta: es tipografía (`importe-principal`) directamente sobre el papel, encabezando el dashboard. — Por qué: da una jerarquía clara y rompe la rejilla de piezas iguales.
- **Tarjeta clicable:** toda la tarjeta es un único enlace (el enlace del título se extiende a toda la superficie); en hover el borde pasa a `input` y el fondo a `muted`; con el foco de teclado el anillo rodea toda la tarjeta. — Por qué: Ley de Fitts, y hay un solo destino que anunciar.
- Una tarjeta clicable no contiene otros botones ni enlaces. — Por qué: los interactivos anidados generan clics ambiguos y rompen la navegación por teclado.

### 7.4 Lista y tabla de movimientos

**Móvil (por debajo de `escritorio`): lista agrupada por día**
- Cabecera de día fija al desplazarse, en `grupo` y `muted-foreground`: "Hoy · lun, 28 sept". — Por qué: se registra y revisa por días.
- Fila de alto mínimo `alto-fila`, relleno `fila-x` / `fila-y`. Izquierda: categoría (`cuerpo`, peso `control`) y debajo "Cuenta · descripción" (`detalle`, `muted-foreground`, truncado a una línea). Derecha: importe (7.5) alineado a la derecha. — Por qué: el ojo baja por la columna de importes como en un libro de caja.
- Separador `border` con sangría `fila-x`. — Por qué: renglones finos, no cajas.
- Toda la fila es el área de clic y abre la edición. — Por qué: una única acción por fila, con el objetivo más grande posible.

**Escritorio (desde `escritorio`): tabla**
- Tabla propia (`table` semántica con tokens), no la Table de shadcn/ui. — Por qué: las reglas de esta sección ya definen toda la tabla, y el componente de shadcn/ui solo añadiría clases por defecto que habría que reescribir.
- Columnas: Fecha · Descripción · Categoría · Cuenta · **Importe**. — Por qué: el importe al final, donde lo espera quien viene de Excel.
- Cabeceras en `etiqueta` y `muted-foreground`; la de Importe, alineada a la derecha como su columna. — Por qué: cabecera y datos comparten borde de alineación.
- Filas de `alto-fila-tabla`, renglón `border`, hover `muted`; orden por fecha descendente. — Por qué: lo más reciente es lo que se busca.
- Fecha corta `es-EC` ("28 sept 2026"); la descripción se trunca y el texto completo está en la edición. — Por qué: las columnas no cambian de ancho entre filas.
- Editar y eliminar se hacen desde la vista de edición del movimiento, no con iconos en cada fila. — Por qué: la fila queda limpia y la acción destructiva, lejos de un clic accidental.

### 7.5 Importe

Se formatea con `Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' })` sobre el
**valor absoluto**, y el componente antepone el signo. — Por qué: comprobado en Node 26 / ICU 78,
`es-EC` coloca el signo después del símbolo (`$-1.234,50`), lo que se lee mal; el componente produce
`−$1.234,50`.

| Caso | Texto | Color | Otras señales |
|---|---|---|---|
| Movimiento de ingreso | `+$25,50` | `ingreso` | Signo "+" y el texto "Ingreso" solo para lectores de pantalla. |
| Movimiento de gasto | `−$25,50` | `gasto` | Signo "−" y el texto "Gasto" solo para lectores de pantalla. |
| Saldo o balance positivo | `$1.234,50` | `foreground` | Sin signo: un saldo positivo es el estado normal. |
| Saldo o balance negativo | `−$120,00` | `negativo` | Signo "−"; en el dashboard, además, la leyenda "Saldo negativo". |
| Cero | `$0,00` | `muted-foreground` | Sin signo. |
| Totales con etiqueta ("Ingresos", "Gastos") | `$1.200,00` | `foreground` | Sin signo ni color: la etiqueta ya dice qué es. |

- El signo menos es el carácter U+2212 (−), no el guion. — Por qué: tiene el mismo ancho que "+" en cifras tabulares y se lee como "menos".
- Siempre dos decimales y separador de miles; nunca abreviaturas ("1,2 k"). — Por qué: quien cuadra caja necesita el céntimo exacto.
- El valor llega del servidor como `Decimal` serializado en texto y se formatea sin pasar por aritmética con `number`. — Por qué: coherente con la regla de dinero del proyecto; el formateo no debe redondear.
- Alineado a la derecha en listas y tablas, en uno de tres tamaños: `cuerpo` (fila), `importe-resumen` o `importe-principal`. — Por qué: tres tamaños bastan para la jerarquía del MVP.
