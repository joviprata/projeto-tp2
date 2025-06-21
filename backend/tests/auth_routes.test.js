const request = require("supertest");
const app = require("../src/server");

describe("Register Gerente Route", () => {
  it("Tem que Retorna 400 quando não for passado nenhum dado com a mensagem de erro", async () => {
    const response = await request(app).post("/registerGerente").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Dados incompletos");
  });

  it("Tem que Retorna 400 quando tiver algum campo vazio com a mensagem de erro específica", async () => {
    const ResponseSemEmail = await request(app).post("/registerGerente").send({
      name: "João",
      email: "",
      password: "senha123",
      address: "Rua A, 123",
    });
    expect(ResponseSemEmail.status).toBe(400);
    expect(ResponseSemEmail.body).toHaveProperty("error");
    expect(ResponseSemEmail.body.error).toBe("Email é obrigatório");

    const ResponseSemSenha = await request(app).post("/registerGerente").send({
      name: "João",
      email: "joao@example.com",
      password: "",
      address: "Rua A, 123",
    });
    expect(ResponseSemSenha.status).toBe(400);
    expect(ResponseSemSenha.body).toHaveProperty("error");
    expect(ResponseSemSenha.body.error).toBe("Senha é obrigatória");

    const ResponseSemEndereco = await request(app)
      .post("/registerGerente")
      .send({
        name: "João",
        email: "joao@example.com",
        password: "senha123",
        address: "",
      });
    expect(ResponseSemEndereco.status).toBe(400);
    expect(ResponseSemEndereco.body).toHaveProperty("error");
    expect(ResponseSemEndereco.body.error).toBe("Endereço é obrigatório");

    const ResponseSemNome = await request(app).post("/registerGerente").send({
      name: "",
      email: "joao@example.com",
      password: "senha123",
      address: "Rua A, 123",
    });
    expect(ResponseSemNome.status).toBe(400);
    expect(ResponseSemNome.body).toHaveProperty("error");
    expect(ResponseSemNome.body.error).toBe("Nome é obrigatório");
  });
});
