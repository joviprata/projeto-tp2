-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supermercado" (
    "id" SERIAL NOT NULL,
    "gerente_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "endereco" VARCHAR(255),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),

    CONSTRAINT "supermercado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "codigo_de_barras" VARCHAR(255) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao_variada" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_de_preco" (
    "id" SERIAL NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disponivel" BOOLEAN DEFAULT true,
    "verificado" BOOLEAN DEFAULT false,
    "produto_id" INTEGER NOT NULL,
    "supermercado_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "registros_de_preco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listas_de_compra" (
    "id" SERIAL NOT NULL,
    "nome_lista" VARCHAR(255) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "listas_de_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_da_lista" (
    "lista_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER DEFAULT 1,
    "marcado_como_pego" BOOLEAN DEFAULT false,

    CONSTRAINT "itens_da_lista_pkey" PRIMARY KEY ("lista_id","produto_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "supermercado_gerente_id_key" ON "supermercado"("gerente_id");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigo_de_barras_key" ON "produtos"("codigo_de_barras");

-- AddForeignKey
ALTER TABLE "supermercado" ADD CONSTRAINT "supermercado_gerente_id_fkey" FOREIGN KEY ("gerente_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_de_preco" ADD CONSTRAINT "registros_de_preco_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_de_preco" ADD CONSTRAINT "registros_de_preco_supermercado_id_fkey" FOREIGN KEY ("supermercado_id") REFERENCES "supermercado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_de_preco" ADD CONSTRAINT "registros_de_preco_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas_de_compra" ADD CONSTRAINT "listas_de_compra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_da_lista" ADD CONSTRAINT "itens_da_lista_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas_de_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_da_lista" ADD CONSTRAINT "itens_da_lista_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
