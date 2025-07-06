const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

let testUserId; // Para armazenar o ID de um usuário de teste
let testProductId; // Para armazenar o ID de um produto de teste

beforeAll(async () => {
  const tableNames = [
    'users',
    'supermercado',
    'produtos',
    'registros_de_preco',
    'listas_de_compra', // Nova tabela
    'itens_da_lista', // Nova tabela
  ];
  for (const tableName of tableNames) {
    await prismaDatabase.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
    );
  }

  const user = await prismaDatabase.user.create({
    data: { name: 'Cliente Teste Lista', email: 'lista@test.com', password: 'senha123', role: 'USER' },
  });
  testUserId = user.id;

  const product = await prismaDatabase.product.create({
    data: { barCode: '1234567890123', name: 'Arroz Teste', variableDescription: '5kg' },
  });
  testProductId = product.id;
});

afterAll(async () => {
  await prismaDatabase.$disconnect();
});

beforeEach(async () => {
  await prismaDatabase.$executeRawUnsafe(`TRUNCATE TABLE "listas_de_compra" RESTART IDENTITY CASCADE;`);
  await prismaDatabase.$executeRawUnsafe(`TRUNCATE TABLE "itens_da_lista" RESTART IDENTITY CASCADE;`);
});


