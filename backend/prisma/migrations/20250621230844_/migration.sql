/*
  Warnings:

  - Made the column `gerente_id` on table `supermercado` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "supermercado" ALTER COLUMN "gerente_id" SET NOT NULL;
