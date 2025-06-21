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

describe("GET /supermarkets/ - Mostrar todos os supermercado", () => {
  it("deve retornar um objeto com status 200 e um array de supermercados", async () => {
    const response = await request(app).get("/supermarkets/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("supermarkets");
    expect(Array.isArray(response.body.supermarkets)).toBe(true);
  });
});

describe("PUT /supermarkets/:id - Atualizar dados do supermercado", () => {
  it("deve retornar status 200 e mensagem de sucesso ao atualizar supermercado", async () => {
    const supermarketId = 1;
    const updatedData = {
      name: "Supermercado Atualizado",
    };

    const response = await request(app)
      .put("/supermarkets/" + supermarketId)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Supermercado atualizado com sucesso"
    );
  });
});

describe("PUT /supermarkets/:id - Atualizar dados do supermercado com dados inválidos", () => {
  it("deve retornar status 400 e mensagem de erro ao tentar atualizar com dados inválidos", async () => {
    const supermarketId = 1;
    const updatedData = {
      name: "",
    };

    const response = await request(app)
      .put("/supermarkets/" + supermarketId)
      .send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Requisição inválida");
  });
});

describe("PUT /supermarkets/:id - Atualizar dados do supermercado com ID inexistente", () => {
  it("deve retornar status 404 e mensagem de erro ao tentar atualizar supermercado inexistente", async () => {
    const supermarketId = 999;
    const updatedData = {
      name: "Supermercado Inexistente",
    };

    const response = await request(app)
      .put("/supermarkets/" + supermarketId)
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Supermercado não encontrado");
  });
});

describe("GET /supermarkets/:id - Buscar supermercado por ID existente", () => {
  it("deve retornar status 200 e os dados do supermercado", async () => {
    const supermarketId = 1;

    const response = await request(app).get(`/supermarkets/${supermarketId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("address");
    expect(response.body).toHaveProperty("managerId");
  });
});

describe("GET /supermarkets/:id - Buscar supermercado por ID inexistente", () => {
  it("deve retornar status 404 e mensagem de erro", async () => {
    const supermarketId = 999;

    const response = await request(app).get(`/supermarkets/${supermarketId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Supermercado não encontrado");
  });
});
