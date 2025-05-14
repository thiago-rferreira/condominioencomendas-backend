/*
  Warnings:

  - A unique constraint covering the columns `[codigo_acesso]` on the table `Condominios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Condominios" ADD COLUMN     "codigo_acesso" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Condominios_codigo_acesso_key" ON "Condominios"("codigo_acesso");
