/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id,tipo,nombre]` on the table `categorias` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categorias" ALTER COLUMN "nombre" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "categorias_usuario_id_tipo_nombre_key" ON "categorias"("usuario_id", "tipo", "nombre");
