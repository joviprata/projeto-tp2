import request from 'supertest';
import app, {prisma, server} from "src/server.js";

let testProductId;

beforeAll(async () => {
    await prisma.$connect(); // Conecta ao banco de dados antes de iniciar os testes
    try {
        await prisma.priceRecord.deleteMany({}); // Limpa os registros de preços antes de iniciar os testes
        await prisma.listItem.deleteMany({});
        await prisma.shoppingList.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.supermarket.deleteMany({});
        await prisma.user.deleteMany({}); // Limpa os usuários antes de iniciar os testes
        console.log("Banco de dados limpo com sucesso.");
    } catch (error) {
        console.error("Erro ao limpar o banco de dados:", error);
    }
});

afterAll(async () => {
    await prisma.$disconnect();
    if (server && server.listening) {
        await new Promise(resolve => server.close(resolve));
    }
});