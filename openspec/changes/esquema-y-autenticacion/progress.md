# Progreso: esquema-y-autenticacion

- Siguiente: 2.16 RED — "Categorías por defecto aisladas por usuario"
- Decisiones: usuarioRepository.crear usa prisma.$transaction (usuario + categoria.createMany); corregida (justificada) la aserción de "email duplicado" que asumía 0 categorías, ahora compara antes/después
- Discrepancias: ninguna
