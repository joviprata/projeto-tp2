const request  = require ("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");


beforeAll(async () => {
    console.log("Criando Produto inicial para Teste");
    const CreateProduct = {
        name: "Produto Teste",
        barCode: "1234567890123",
        variableDescription: "Descrição do Produto Teste"
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

describe("POST /products - Registrar um novo produto", () => {
    it("Deve retornar 201 e os dados do produto criado", async () => {
        const newProduct = {
        name: "Produto novo",
        barCode: "9876543210987",
        variableDescription: "Descrição do Produto novo"
        };

        const response = await request(app).post("/products").send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.nome).toBe(newProduct.nome);
        expect(response.body.CodidoDeBarras).toBe(newProduct.CodidoDeBarras);
        expect(response.body.descricao).toBe(newProduct.descricao);
    });

    it("Deve retornar 400 se os dados do produto estiverem incompletos", async () => {
        const incompleteProduct = {
            name: "Produto Incompleto"
        };

        const response = await request(app).post("/products").send(incompleteProduct);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
})










