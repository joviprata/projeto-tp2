const request = require("supertest");
const app = require("../src/server");
const prismaDatabase = require("../src/prismaClient");
beforeAll(async () => {
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
});
afterAll(async () => {
  await prismaDatabase.$disconnect();
});
describe("POST /auth/register/manager - Validação de campos obrigatórios", () => {
  it.each([
    {
      case: "corpo vazio",
      payload: {},
    },
    {
      case: "faltando nome, senha e endereço",
      payload: { email: "test@example.com" },
    },
    {
      case: "faltando email, senha e endereço",
      payload: { name: "Supermercado Teste" },
    },
    {
      case: "faltando a senha",
      payload: {
        name: "Supermercado Teste",
        email: "test@example.com",
        address: "Rua Teste, 123",
      },
    },
    {
      case: "faltando o email",
      payload: {
        name: "Supermercado Teste",
        password: "senha123",
        address: "Rua Teste, 123",
      },
    },
    {
      case: "faltando o endereço",
      payload: {
        name: "Supermercado Teste",
        password: "senha123",
        email: "test@example.com",
      },
    },
    {
      case: "nome em branco",
      payload: {
        name: "",
        email: "",
        password: "senha123",
        address: "Rua Teste, 123",
      },
    },
    {
      case: "senha em branco",
      payload: {
        name: "Supermercado Teste",
        email: "test@example.com",
        password: "",
        address: "Rua Teste, 123",
      },
    },
    {
      case: "email em branco",
      payload: {
        name: "Supermercado Teste",
        password: "senha123",
        email: "",
        address: "Rua Teste, 123",
      },
    },
    {
      case: "endereço em branco",
      payload: {
        name: "Supermercado Teste",
        password: "senha123",
        email: "test@example.com",
        address: "",
      },
    },
    {
      case: "Com mais de 4 campos na requisição",
      payload: {
        name: "Supermercado Teste",
        email: "test@example.com",
        password: "senha123",
        address: "Rua Teste, 123",
        extraField: "extraValue",
      },
    },
  ])("Deve retornar 400 quando $case", async ({ payload }) => {
    const response = await request(app)
      .post("/auth/register/manager")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Requisição inválida");
  });
});
