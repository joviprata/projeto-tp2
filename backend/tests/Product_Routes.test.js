const request  = require ("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");


beforeAll(async () => {
    console.log("Criando Produto para Teste");
    await request(app).post("/products").send({ // Cria um produto para ser usado nos testes
        nome: "Produto Teste",
        CodidoDeBarras: "1234567890123",
        descricao: "Descrição do Produto Teste"
    });
});

afterAll(async () => {
    const TableNames = [
        "users",
        "supermercado",
        "produtos",
        "registros_de_preco",
        "listas_de_compra",
        "itens_da_lista"
    ];

    for (const tableName of TableNames) {
        await prismaDatabase.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
    }
    await prismaDatabase.$disconnect();
});




