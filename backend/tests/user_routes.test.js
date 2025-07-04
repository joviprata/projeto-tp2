const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

beforeAll(async () => {
  const CreateUser = {
    name: 'Cliente Teste',
    email: 'email@teste.com',
    password: 'senha123',
  };
  await request(app).post('/auth/register/users').send(CreateUser);
});

afterAll(async () => {
  const tableNames = [
    'users',
    'supermercado',
    'produtos',
    'registros_de_preco',
    'listas_de_compra',
    'itens_da_lista',
  ];
  tableNames.forEach(async (tableName) => {
    await prismaDatabase.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
    );
  });
  await prismaDatabase.$disconnect();
});

describe('GET /users/ - Mostrar todos os usuários', () => {
  it('Deve retornar status 200 e um array de usuários', async () => {
    const response = await request(app).get('/users/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
  });
});
