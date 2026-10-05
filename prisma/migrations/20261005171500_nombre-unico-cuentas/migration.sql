CREATE EXTENSION IF NOT EXISTS citext;

-- AlterTable
ALTER TABLE "cuentas" ALTER COLUMN "nombre" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_usuario_id_nombre_key" ON "cuentas"("usuario_id", "nombre");
