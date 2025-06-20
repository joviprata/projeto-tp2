const request = require("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");

beforeAll(async () => {
  console.log("criando supermercado para testes");
  const CreateSupermarket = {
    name: "Supermercado Teste",
    email: "email@teste.com",
    password: "senha123",
    address: "Rua Teste, 123",
  };
  await request(app).post("/auth/register/manager").send(CreateSupermarket);
});

afterAll(async () => {
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

describe("GET /supermarkets/allSupermarkets - Mostrar todos os supermercado", () => {
  it("deve retornar um objeto com status 200 e um array de supermercados", async () => {
    const response = await request(app).get("/supermarkets/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("supermarkets");
    expect(Array.isArray(response.body.supermarkets)).toBe(true);
  });
});
