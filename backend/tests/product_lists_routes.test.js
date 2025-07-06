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
    data: {
      name: 'Cliente Teste Lista',
      email: 'lista@test.com',
      password: 'senha123',
      role: 'USER',
    },
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
  await prismaDatabase.$executeRawUnsafe(
    `TRUNCATE TABLE "listas_de_compra" RESTART IDENTITY CASCADE;`,
  );
  await prismaDatabase.$executeRawUnsafe(
    `TRUNCATE TABLE "itens_da_lista" RESTART IDENTITY CASCADE;`,
  );
});

describe('POST /product-lists - Criar uma nova lista de compras', () => {
  it('Deve criar uma nova lista de compras com sucesso', async () => {
    const response = await request(app)
      .post('/product-lists')
      .send({ userId: testUserId, listName: 'Primeira Lista' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.listName).toBe('Primeira Lista');
    expect(response.body.data.userId).toBe(testUserId);
    expect(response.body).toHaveProperty('message', 'Lista de compras criada com sucesso');
  });

  it('Deve retornar 400 se o userId ou listName estiver faltando', async () => {
    let response = await request(app).post('/product-lists').send({ listName: 'Lista sem User' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'ID do usuário e nome da lista são obrigatórios');

    response = await request(app).post('/product-lists').send({ userId: testUserId });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'ID do usuário e nome da lista são obrigatórios');
  });

  it('Deve retornar 400 se o nome da lista for vazio', async () => {
    const response = await request(app)
      .post('/product-lists')
      .send({ userId: testUserId, listName: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'O nome da lista não pode ser vazio');
  });
});
