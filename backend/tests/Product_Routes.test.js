const request  = require ("supertest");
const app = require("../src/server");

describe("Register Product Routes", () => {
    it("Deve retorar 400 quando não é passado nenhum dado com a mensagem de erro", async () => {
        const response  = await request(app).post("/registerProduct").send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Dados imcompletos ou inválidos");
    });
});

