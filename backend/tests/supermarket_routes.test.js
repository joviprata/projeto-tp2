const request = require("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");

beforeAll(async () => {
  console.log("criando supermercado para testes");
  await request(app).post("/auth/register/manager").send({
    nome: "Supermercado Teste",
    email: "supermercado@teste.com",
    senha: "senha123",
  });
});
afterAll(async () => {
  // Limpar tabelas antes dos testes
  const tableNames = [
    "users",
    "supermercado",
    "produtos",
    "registros_de_preco",
    "listas_de_compra",
    "itens_da_lista",
  ];
  for (const tableName of tableNames) {
    await prismaDatabase.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`
    );
  }
  await prismaDatabase.$disconnect();
});
describe("POST /supermarkets/get/allSupermarkets - Mostrar todos os supermercado", () => {
  it("should return a list of supermarkets", async () => {
    const response = await request(app)
      .post("/supermarkets/get/allSupermarkets")
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("supermarkets");
    expect(Array.isArray(response.body.supermarkets)).toBe(true);
  });
});
