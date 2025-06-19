const request  = require ("supertest");
const app = require("../src/server");

describe("Register Product Routes", () => {
    it("Deve retorar 400 quando não é passado nenhum dado com a mensagem de erro", async () => {
        const response  = await request(app).post("/registerProduct").send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Dados imcompletos ou inválidos");
    });

    it("Deve retornar 400 quando tiver algum campo vazio com a mensagem de erro específica", async () => {
        const responseSemNome = await request(app).post("/registerProduct").send({
            name: "",
            CodigoDeBarras: "1234567890123",
            Data : "2025-06-19T14:15:30Z",
            Descricao : "Produto de teste",
        });
        expect(responseSemNome.statusCode).toBe(400);
        expect(responseSemNome.body).toHaveProperty("error");
        expect(responseSemNome.body.error).toBe("O campo nome é obrigatório");


        const responseSemCodigo = await request(app).post("/registerProduct").send({
            name: "Produto Teste",
            CodigoDeBarras: "",
            Data : "2025-06-19T14:15:30Z",
            Descricao : "Produto de teste",
        });
        expect(responseSemCodigo.statusCode).toBe(400);
        expect(responseSemCodigo.body).toHaveProperty("error");
        expect(responseSemCodigo.body.error).toBe("O campo Código de Barras é obrigatório");

        const responseSemData = await request(app).post("/registerProduct").send({
            name: "Produto Teste",
            CodigoDeBarras: "1234567890123",
            Data : "",
            Descricao : "Produto de teste",
        });
        expect(responseSemData.statusCode).toBe(400);
        expect(responseSemData.body).toHaveProperty("error");
        expect(responseSemData.body.error).toBe("O campo Data é obrigatório");

        const responseSemDescricao = await request(app).post("/registerProduct").send({
            name: "Produto Teste",
            CodigoDeBarras: "1234567890123",
            Data : "2025-06-19T14:15:30Z",
            Descricao : "",
        });
        expect(responseSemDescricao.statusCode).toBe(400);
        expect(responseSemDescricao.body).toHaveProperty("error");
        expect(responseSemDescricao.body.error).toBe("O campo Descrição é obrigatório");
    });

    it ("Deve retornar 201 quando o produto é registrado com sucesso", async () => {
        const response = await request(app).post("/registerProduct").send({
            name: "Produto Teste",
            CodigoDeBarras: "1234567890123",
            Data: "2025-06-19T14:15:30Z",
            Descricao: "Produto de teste",
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Produto registrado com sucesso");
    });
});

