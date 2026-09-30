# Progreso: esquema-y-autenticacion

- Siguiente: 1.18 RED — src/test/bd/bd.int.test.ts, "la base de integración es la de prueba y está vacía"
- Decisiones: globalSetup crea cuadre_test (CREATE DATABASE si no existe, vía PrismaClient+PrismaPg contra "postgres") y corre "prisma migrate deploy" invocando node+prisma/build/index.js (sin shell, portable en Windows); global-setup solo se dispara si hay ≥1 archivo de test, verificado con un archivo temporal sin commitear
- Discrepancias: ninguna
