const request  = require ("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");


beforeAll(async () => {
    console.log("Criando Produto inicial para Teste");
    const CreateProduct = {
        nome: "Produto Teste",
        CodidoDeBarras: "1234567890123",
        descricao: "Descrição do Produto Teste"
    };
    const response = await request(app).post("/products").send(CreateProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    CreateProduct.id = response.body.id; // Armazena o ID do produto criado para uso posterior
    console.log("Produto inicial criado com ID:", CreateProduct.id);
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
        await prismaDatabase.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
    }
    await prismaDatabase.$disconnect();
    console.log("Banco de dados limpo e desconectado.");
});










