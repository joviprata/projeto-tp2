const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

beforeAll(async () => {
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
});
afterAll(async () => {
  await prismaDatabase.$disconnect();
});
describe('POST /auth/register/manager - Validação de campos obrigatórios', () => {
  it.each([
    {
      case: 'corpo vazio',
      payload: {},
    },
    {
      case: 'faltando nome, senha e endereço',
      payload: { email: 'test@example.com' },
    },
    {
      case: 'faltando email, senha e endereço',
      payload: { name: 'Supermercado Teste' },
    },
    {
      case: 'faltando a senha',
      payload: {
        name: 'Supermercado Teste',
        email: 'test@example.com',
        address: 'Rua Teste, 123',
      },
    },
    {
      case: 'faltando o email',
      payload: {
        name: 'Supermercado Teste',
        password: 'senha123',
        address: 'Rua Teste, 123',
      },
    },
    {
      case: 'faltando o endereço',
      payload: {
        name: 'Supermercado Teste',
        password: 'senha123',
        email: 'test@example.com',
      },
    },
    {
      case: 'nome em branco',
      payload: {
        name: '',
        email: '',
        password: 'senha123',
        address: 'Rua Teste, 123',
      },
    },
    {
      case: 'senha em branco',
      payload: {
        name: 'Supermercado Teste',
        email: 'test@example.com',
        password: '',
        address: 'Rua Teste, 123',
      },
    },
    {
      case: 'email em branco',
      payload: {
        name: 'Supermercado Teste',
        password: 'senha123',
        email: '',
        address: 'Rua Teste, 123',
      },
    },
    {
      case: 'endereço em branco',
      payload: {
        name: 'Supermercado Teste',
        password: 'senha123',
        email: 'test@example.com',
        address: '',
      },
    },
    {
      case: 'Com mais de 4 campos na requisição',
      payload: {
        name: 'Supermercado Teste',
        email: 'test@example.com',
        password: 'senha123',
        address: 'Rua Teste, 123',
        extraField: 'extraValue',
      },
    },
  ])('Deve retornar 400 quando $case', async ({ payload }) => {
    const response = await request(app).post('/auth/register/manager').send(payload);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Requisição inválida');
  });
});
describe('POST /auth/register/manager - Registro de gerente com sucesso', () => {
  it('Deve registrar um gerente com sucesso', async () => {
    const payload = {
      name: 'Supermercado Teste',
      email: 'test@example.com',
      password: 'senha123',
      address: 'Rua Teste, 123',
    };

    const response = await request(app).post('/auth/register/manager').send(payload);

    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Gerente registrado com sucesso');
    expect(response.body).toHaveProperty('supermarketId');

    expect(response.body.supermarketId).toEqual(expect.any(Number));
    expect(response.body.supermarketId).toBeGreaterThan(0);
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { id: parseInt(response.body.supermarketId, 10) },
    });
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toBe(payload.name);
    expect(supermarket.address).toBe(payload.address);
    const gerente = await prismaDatabase.user.findUnique({
      where: { email: payload.email },
    });
    expect(gerente).not.toBeNull();
    expect(gerente.name).toBe(payload.name);
    expect(gerente.email).toBe(payload.email);
    expect(gerente.role).toBe('GERENTE');
  });
});
describe('POST /auth/register/manager - validaçao de criaçao duplicada', () => {
  it('Deve retornar 409 quando o email já estiver em uso', async () => {
    const payload = {
      name: 'Supermercado Teste',
      email: 'test@example.com',
      password: 'senha123',
      address: 'Rua Teste, 123',
    };

    await request(app).post('/auth/register/manager').send(payload);

    const response = await request(app).post('/auth/register/manager').send(payload);

    expect(response.status).toBe(409);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Email já em uso');
  });
});

describe('POST /auth/login - Login do gerente com erro de autenticação', () => {
  it('Deve retornar 401 quando o email estiver incorreto', async () => {
    const Registerpayload = {
      name: 'Supermercado Teste',
      email: 'email@teste.com',
      password: 'senha123',
      address: 'Rua Teste, 123',
    };
    await request(app).post('/auth/register/manager').send(Registerpayload);
    const Loginpayload = {
      email: 'email@incorreto.com',
      password: 'senha123',
    };
    const response = await request(app).post('/auth/login').send(Loginpayload);
    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Email inválido');
  });
  it('Deve retornar 401 quando a senha estiver incorreta', async () => {
    const Registerpayload = {
      name: 'Supermercado Teste',
      email: 'email@teste.com',
      password: 'senha123',
      address: 'Rua Teste, 123',
    };
    await request(app).post('/auth/register/manager').send(Registerpayload);
    const Loginpayload = {
      email: 'email@incorreto.com',
      password: 'senha123',
    };
    const response = await request(app).post('/auth/login').send(Loginpayload);
    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Email inválido');
  });
});

describe('POST /auth/login - Login do gerente com erro de requisição', () => {
  it.each([
    {
      case: 'corpo vazio',
      payload: {},
    },
    {
      case: 'email e senha em branco',
      payload: { email: '', password: '' },
    },
    {
      case: 'email em branco',
      payload: { email: '', password: 'senha123' },
    },
    {
      case: 'senha em branco',
      payload: { email: 'email@teste.com', password: '' },
    },
    {
      case: 'mais de 2 campos na requisição',
      payload: {
        email: 'email@teste.com',
        password: 'senha123',
        extraField: 'extraValue',
      },
    },
  ])('Deve retornar 400 quando o $case', async ({ payload }) => {
    const Registerpayload = {
      name: 'Supermercado Teste',
      email: 'email@teste.com',
      password: 'senha123',
      address: 'Rua Teste, 123',
    };
    await request(app).post('/auth/register/manager').send(Registerpayload);
    const response = await request(app).post('/auth/login').send(payload);
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Requisição inválida');
  });
});

describe('POST /auth/login - Login do gerente com sucesso', () => {
  it('Deve fazer login com sucesso', async () => {
    const Registerpayload = {
      name: 'Supermercado Teste',
      email: 'email@teste.com',
      password: 'senha123',
      address: 'Rua Teste, 123',
    };
    const loginPayload = {
      email: 'email@teste.com',
      password: 'senha123',
    };
    await request(app).post('/auth/register/manager').send(Registerpayload);
    const response = await request(app).post('/auth/login').send(loginPayload);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Login realizado com sucesso');
    expect(response.body).toHaveProperty('userId');
    expect(response.body.userId).toEqual(expect.any(Number));
    expect(response.body.userId).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('role');
    expect(response.body.role).toBe('GERENTE');
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { managerId: response.body.userId },
    });
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toBe(Registerpayload.name);
    expect(supermarket.address).toBe(Registerpayload.address);

    const gerente = await prismaDatabase.user.findUnique({
      where: { email: Registerpayload.email },
    });
    expect(gerente).not.toBeNull();
    expect(gerente.name).toBe(Registerpayload.name);
    expect(gerente.email).toBe(Registerpayload.email);
    expect(gerente.role).toBe('GERENTE');
    expect(gerente.id).toBe(response.body.userId);
    expect(response.body.userId).toBe(gerente.id);
    expect(response.body.role).toBe(gerente.role);
  });
});

describe('POST /auth/register/user - Validação de campos obrigatórios', () => {
  it.each([
    {
      case: 'corpo vazio',
      payload: {},
    },
    {
      case: 'faltando nome e senha',
      payload: { email: 'client@example.com' },
    },
    {
      case: 'faltando email e senha',
      payload: { name: 'Cliente Teste' },
    },
    {
      case: 'faltando a senha',
      payload: {
        name: 'Cliente Teste',
        email: 'client@example.com',
      },
    },
    {
      case: 'faltando o email',
      payload: {
        name: 'Cliente Teste',
        password: 'senhaCliente123',
      },
    },
    {
      case: 'nome em branco',
      payload: {
        name: '',
        email: 'client@example.com',
        password: 'senhaCliente123',
      },
    },
    {
      case: 'senha em branco',
      payload: {
        name: 'Cliente Teste',
        email: 'client@example.com',
        password: '',
      },
    },
    {
      case: 'email em branco',
      payload: {
        name: 'Cliente Teste',
        password: 'senhaCliente123',
        email: '',
      },
    },
    {
      case: 'Com mais de 3 campos na requisição (excluindo address)',
      payload: {
        name: 'Cliente Teste',
        email: 'client@example.com',
        password: 'senhaCliente123',
        extraField: 'extraValue', // Campos extras não permitidos
      },
    },
  ])('Deve retornar 400 quando $case', async ({ payload }) => {
    const response = await request(app).post('/auth/register/user').send(payload);

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Requisição inválida');
  });
});

describe('POST /auth/register/user - Registro de usuário com sucesso', () => {
    it('Deve registrar um usuário com sucesso', async () => {
        const payload = {
            name: 'Cliente Teste Sucesso',
            email: 'cliente.sucesso@example.com',
            password: 'senha123',
        };

        const response = await request(app).post('/auth/register/user').send(payload);
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Usuário registrado com sucesso');
        expect(response.body).toHaveProperty('userId');

        expect(response.body.userId).toEqual(expect.any(Number));
        expect(response.body.userId).toBeGreaterThan(0);

        const user = await prismaDatabase.user.findUnique({
            where: { email: payload.email },
        });

        expect(user).not.toBeNull();
        expect(user.name).toBe(payload.name);
        expect(user.email).toBe(payload.email);
        expect(user.role).toBe('USER');
    });
});


