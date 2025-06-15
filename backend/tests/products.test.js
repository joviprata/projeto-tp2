import request from 'supertest';
import app, {prisma, server} from "src/server.js";

let testProductId;

beforeAll(async () => {
    await prisma.$connect(); // Conecta ao banco de dados antes de iniciar os testes

    try {
        await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');

    } catch (error) {
        console.error("Erro ao limpar o banco de dados:", error);
    }
});

afterEach(async () => {
    await prisma.product.deleteMany(); // Limpa os produtos após cada teste
})

afterAll(async () => {
    await prisma.$disconnect();
    if (server && server.listening) {
        await new Promise(resolve => server.close(resolve));
    }
});





