# Patrones de estado — Cuadre

Sección 9 del sistema de diseño. Índice completo en [README.md](README.md).

## 9. Patrones de estado

Toda pantalla y toda sección que carga datos por su cuenta define sus cuatro estados antes de
implementarse.

### 9.1 Vacío

- Estructura: una frase que dice qué falta, una que dice qué hacer y **un** botón que lo hace. Sin ilustraciones ni iconos en círculos. — Por qué: el vacío es un paso del flujo, no un hueco que decorar.
- **Primer uso sin cuentas:** "Todavía no tienes cuentas. Crea una para empezar a registrar movimientos." → primario "Crear cuenta". — Por qué: no se puede registrar sin cuenta; se guía al paso previo.
- **Dashboard sin movimientos (HU-003):** los totales se muestran en `$0,00`, y debajo: "No hay movimientos en este período." → primario "Registrar movimiento". — Por qué: lo exige el criterio de aceptación, y el cero también es un dato.
- **Vacío por filtro:** "No hay movimientos del 1 al 15 de septiembre." → terciario "Quitar filtros". — Por qué: no es lo mismo que no tener datos, y no debe empujar a crear nada.
- Tono: frases directas y concretas. Prohibido el lenguaje de marketing ("¡Toma el control de tus finanzas!"). — Por qué: criterio anti-IA del brief; el usuario está trabajando, no comprando.

### 9.2 Carga

- Si la respuesta tarda menos de 400 ms, no se muestra nada. — Por qué: un esqueleto que parpadea es peor que la espera.
- A partir de 400 ms, esqueleto **estático** con la forma exacta del contenido (filas de `alto-fila`, bloque de importe alineado a la derecha) en `muted`, y la región con `aria-busy="true"`. — Por qué: no hay salto al llegar los datos y el lector de pantalla sabe que está cargando.
- Al cambiar un filtro o el período, se mantienen los datos anteriores y aparece "Actualizando…" junto al control. — Por qué: la pantalla no se vacía por un cambio pequeño.
- Acciones: estado de carga del botón (componentes.md, 7.1). — Por qué: el contexto de la acción queda visible.

### 9.3 Error

- **Validación de campo:** en el propio campo (componentes.md, 7.2). — Por qué: el error aparece donde se corrige.
- **Error al guardar (servidor o red):** aviso encima del botón primario, con fondo `negativo-fondo`, icono y texto en `destructive`: qué pasó y qué hacer ("No se pudo guardar el gasto. Revisa tu conexión y vuelve a intentarlo."). Los datos escritos se conservan y el aviso se anuncia con `role="alert"`. — Por qué: nunca se pierde lo que el usuario escribió.
- **Error al cargar una sección:** solo esa sección muestra el mensaje y un secundario "Reintentar"; el resto de la pantalla sigue funcionando. — Por qué: un fallo parcial no bloquea toda la app.
- **Recurso inexistente o ajeno:** "No encontramos este movimiento." con el mismo mensaje en ambos casos. — Por qué: no revela si el recurso de otro usuario existe.
- Prohibido "Algo salió mal" sin más contexto y los códigos técnicos en pantalla. — Por qué: el usuario no puede actuar con ellos.

### 9.4 Éxito

- **Registrar o editar un movimiento:** se vuelve a la pantalla de origen, la fila aparece con `animate-resaltado` y una región `aria-live="polite"` anuncia "Gasto de $25,50 registrado en Efectivo." — Por qué: se confirma qué se guardó y dónde, con vista, texto y lector de pantalla.
- **Eliminar:** diálogo de confirmación que nombra lo que se elimina ("¿Eliminar el gasto de $25,50 del 28 sept?"), con el secundario "Cancelar" enfocado por defecto y el destructivo "Eliminar". Al confirmar, la fila desaparece y se anuncia "Movimiento eliminado." — Por qué: acción destructiva confirmada, con la opción segura como la más fácil.
- Los saldos y totales afectados se actualizan sin animación. — Por qué: el resaltado de la fila ya confirma; un número que parpadea o "cuenta" no aporta.
- Sin toasts de una librería nueva: la confirmación es la región `aria-live` de la propia pantalla. Si más adelante se quiere el componente Sonner de shadcn/ui, se justifica en el `design.md` de ese change. — Por qué: no añade dependencias no aprobadas.
