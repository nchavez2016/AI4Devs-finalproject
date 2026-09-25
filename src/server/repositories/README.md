# Repositorios

Capa de acceso a datos (patrón Repository). Solo aquí se usa Prisma; la lógica de
negocio en `src/server/` pide los datos a estos repositorios (ej. `TransaccionRepository`).

Regla: toda consulta recibe y filtra por el `usuarioId` del usuario autenticado.
