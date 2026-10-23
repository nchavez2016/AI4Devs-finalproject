# Progreso: cuentas-y-categorias
- Siguiente: 6.2 Ejecutar lint, typecheck, test:run y openspec validate --strict (cierre del change).
- Decisiones: ContenidoPanel usa EncabezadoPagina sin volverAlPanel ni accion en max-w-contenido; Cerrar sesión queda fuera del encabezado. Grupo 7 (login, añadido durante 6.1): iniciarSesion devuelve un mensaje genérico ante un error inesperado, salvo la excepción de redirección NEXT_REDIRECT que signIn(redirectTo) lanza en el camino de éxito, que se relanza intacta.
- Discrepancias: el pre-commit ejecuta la suite completa, así que un RED no puede commitearse solo. El hook bloquea escribir archivos nuevos en `prisma/migrations/`. Las mutaciones que quitan `usuario_id` del índice rompen también el registro de los tests de 2.28, que usan seed.
- 6.1 (prueba manual) confirmada por el usuario, incluida la prueba de login con la base de datos caída que motivó el grupo 7.
