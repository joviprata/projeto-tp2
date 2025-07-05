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
  it('deve retornar um objeto com status 200 e um array de usuários', async () => {
    const response = await request(app).get('/users/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
  });
});

describe('GET /users/:id - Obter cliente por ID', () => {
  it('Deve retornar 200 e os dados do cliente se o ID for válido', async () => {
    const registerResponse = await request(app).post('/auth/register/user').send({
      name: 'Cliente Para Buscar',
      email: 'buscar@test.com',
      password: 'senha123',
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('userId');
    expect(registerResponse.body.userId).not.toBeNull();
    expect(registerResponse.body.userId).toBeDefined();

    const { userId } = registerResponse.body;
    const response = await request(app).get(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).not.toBeNull();
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', 'Cliente Para Buscar');
    expect(response.body).toHaveProperty('email', 'buscar@test.com');
    expect(response.body).toHaveProperty('role', 'USER');
  });
});

describe('GET /users/:id - Obter cliente por ID inexistente', () => {
  it('Deve retornar 404 se o cliente não for encontrado', async () => {
    const nonExistentId = 9999; // ID que não existe
    const response = await request(app).get(`/users/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
  });
});
