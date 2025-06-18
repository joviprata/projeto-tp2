const request = require("supertest");
const app = require("../src/server");

describe("Register Gerente Route", () => {
  it("Tem que Retorna 400 quando não for passado nenhum dado com a mensagem de erro", async () => {
    const response = await request(app).post("/registerGerente").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Dados incompletos");
  });
});
