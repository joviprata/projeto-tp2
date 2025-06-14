-- DropForeignKey
ALTER TABLE "itens_da_lista" DROP CONSTRAINT "itens_da_lista_lista_id_fkey";

-- DropForeignKey
ALTER TABLE "itens_da_lista" DROP CONSTRAINT "itens_da_lista_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "listas_de_compra" DROP CONSTRAINT "listas_de_compra_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "registros_de_preco" DROP CONSTRAINT "registros_de_preco_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "registros_de_preco" DROP CONSTRAINT "registros_de_preco_supermercado_id_fkey";

-- DropForeignKey
ALTER TABLE "registros_de_preco" DROP CONSTRAINT "registros_de_preco_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "supermercado" DROP CONSTRAINT "supermercado_gerente_id_fkey";

-- AlterTable
ALTER TABLE "supermercado" ALTER COLUMN "gerente_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "supermercado" ADD CONSTRAINT "supermercado_gerente_id_fkey" FOREIGN KEY ("gerente_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_de_preco" ADD CONSTRAINT "registros_de_preco_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_de_preco" ADD CONSTRAINT "registros_de_preco_supermercado_id_fkey" FOREIGN KEY ("supermercado_id") REFERENCES "supermercado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_de_preco" ADD CONSTRAINT "registros_de_preco_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas_de_compra" ADD CONSTRAINT "listas_de_compra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_da_lista" ADD CONSTRAINT "itens_da_lista_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas_de_compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_da_lista" ADD CONSTRAINT "itens_da_lista_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
