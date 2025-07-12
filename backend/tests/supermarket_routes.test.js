const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

const createSupermarket = async () => {
  const supermarketData = {
    name: 'Supermercado Teste',
    email: 'email@teste.com',
    password: 'senha123',
    address: 'Rua Teste, 123',
  };

  const response = await request(app).post('/auth/register/manager').send(supermarketData);

  const { supermarketId } = response.body;
  return supermarketId;
};
const createSupermarketWithParams = async (name, email, password, address) => {
  const supermarketData = {
    name,
    email,
    password,
    address,
  };

  const response = await request(app).post('/auth/register/manager').send(supermarketData);

  const { supermarketId } = response.body;
  return supermarketId;
};
const createUser = async (name, email, password) => {
  const response = await request(app).post('/auth/register/user').send({
    name,
    email,
    password,
  });
  expect(response.status).toBe(201);
  return response.body.userId;
};

const createShoppingList = async (userId, listName) => {
  const response = await request(app).post('/product-lists').send({ userId, listName });
  if (response.status === 201) {
    return response.body.data.id;
  }
  throw new Error(
    `Failed to create shopping list: Status ${response.status}, Error: ${response.body.error || 'Unknown error'}`,
  );
};

beforeEach(async () => {
  const tableNames = [
    'users',
    'supermercado',
    'produtos',
    'registros_de_preco',
    'listas_de_compra',
    'itens_da_lista',
  ];

  await Promise.all(
    tableNames.map((tableName) =>
      prismaDatabase.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`),
    ),
  );
});

afterAll(async () => {
  await prismaDatabase.$disconnect();
});

describe('GET /supermarkets/ - Mostrar todos os supermercado', () => {
  it('deve retornar um objeto com status 200 e um array de supermercados', async () => {
    await createSupermarket();
    const response = await request(app).get('/supermarkets/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('supermarkets');
    expect(Array.isArray(response.body.supermarkets)).toBe(true);
  });
});

describe('PUT /supermarkets/:id - Atualizar dados do supermercado', () => {
  it('deve retornar status 200 e mensagem de sucesso ao atualizar supermercado', async () => {
    const supermarketId = await createSupermarket();
    const updatedData = {
      name: 'Supermercado Atualizado',
    };
    const response = await request(app).put(`/supermarkets/${supermarketId}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Supermercado atualizado com sucesso');
  });
});

describe('PUT /supermarkets/:id - Atualizar dados do supermercado com dados inválidos', () => {
  it.each([
    {
      case: 'Dados vazios',
      supermarketId: 1,
      updatedData: {},
    },
    {
      case: 'Mais de 4 campos',
      supermarketId: 1,
      updatedData: {
        name: 'Supermercado Invalido',
        email: 'testinvalido@example.com',
        password: 'senhainvalida',
        address: 'Rua Invalida, 456',
        extraField: 'Campo Extra',
      },
    },
  ])(
    'deve retornar status 400 e mensagem de erro ao tentar atualizar com dados inválidos',
    async ({ supermarketId, updatedData }) => {
      const response = await request(app).put(`/supermarkets/${supermarketId}`).send(updatedData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Requisição inválida');
    },
  );
});
describe('PUT /supermarkets/:id - Atualizar dados do supermercado com ID inexistente', () => {
  it('deve retornar status 404 e mensagem de erro ao tentar atualizar supermercado inexistente', async () => {
    const supermarketId = 999;
    const updatedData = {
      name: 'Supermercado Inexistente',
    };

    const response = await request(app).put(`/supermarkets/${supermarketId}`).send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Supermercado não encontrado');
  });
});

describe('PUT /supermarkets/manager/:id - Atualizar supermercado por ID de gerente', () => {
  it('deve retornar status 200 e mensagem de sucesso ao atualizar supermercado por ID', async () => {
    const responseSupermaketId = await createSupermarket();
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { id: responseSupermaketId },
      select: { managerId: true },
    });
    const { managerId } = supermarket;
    const updatedData = {
      name: 'Supermercado Inexistente',
      email: 'supermercado@inexistente.com',
      password: 'supermercadoinexistente',
      address: 'supermercado inexistente, 123',
    };

    const response = await request(app).put(`/supermarkets/manager/${managerId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Supermercado atualizado com sucesso');
  });
});

describe('GET /supermarkets/:id - Buscar supermercado por ID existente', () => {
  it('deve retornar status 200 e os dados do supermercado', async () => {
    const supermarketId = await createSupermarket();
    const response = await request(app).get(`/supermarkets/${supermarketId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('managerId');
  });
});

describe('GET /supermarkets/:id - Buscar supermercado por ID inexistente', () => {
  it('deve retornar status 404 e mensagem de erro', async () => {
    const supermarketId = 999;
    const response = await request(app).get(`/supermarkets/${supermarketId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Supermercado não encontrado');
  });
});

describe('DELETE /supermarkets/:id - Deletar supermercado existente', () => {
  it('deve retornar status 204 e mensagem de erro ao tentar deletar supermercado existente', async () => {
    const supermarketId = await createSupermarket();
    const response = await request(app).delete(`/supermarkets/${supermarketId}`);
    expect(response.status).toBe(204);
  });
});

describe('DELETE /supermarkets/:id - Deletar supermercado', () => {
  it('deve retornar status 404 e mensagem de erro ao tentar deletar supermercado inexistente', async () => {
    const supermarketId = 999;
    const response = await request(app).delete(`/supermarkets/${supermarketId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Supermercado não encontrado');
  });
});

describe('GET /supermarkets/cheapest/:listId - Obter supermercados com os preços mais baixos para uma lista', () => {
  it('deve retornar supermercados ordenados pelo preço total da lista', async () => {
    const userId = await createUser('User 1', 'user1@test.com', 'password123');
    const supermarket1Id = await createSupermarketWithParams(
      'Supermercado 1',
      'email1@test.com',
      'password1',
      'Endereço 1',
    );
    const supermarket2Id = await createSupermarketWithParams(
      'Supermercado 2',
      'email2@test.com',
      'password2',
      'Endereço 2',
    );

    const product1 = await prismaDatabase.product.create({
      data: { barCode: '111', name: 'Product A' },
    });
    const product2 = await prismaDatabase.product.create({
      data: { barCode: '222', name: 'Product B' },
    });

    await prismaDatabase.priceRecord.createMany({
      data: [
        {
          productId: product1.id,
          supermarketId: supermarket1Id,
          price: 10.0,
          userId,
          available: true,
        },
        {
          productId: product2.id,
          supermarketId: supermarket1Id,
          price: 5.0,
          userId,
          available: true,
        },
        {
          productId: product1.id,
          supermarketId: supermarket2Id,
          price: 9.0,
          userId,
          available: true,
        },
        {
          productId: product2.id,
          supermarketId: supermarket2Id,
          price: 6.0,
          userId,
          available: true,
        },
      ],
    });

    const listId = await createShoppingList(userId, 'Minha Lista');
    await prismaDatabase.listItem.createMany({
      data: [
        { listId, productId: product1.id, quantity: 1 },
        { listId, productId: product2.id, quantity: 1 },
      ],
    });

    const response = await request(app).get(`/supermarkets/cheapest/${listId}`);
    expect(response.status).toBe(200);
    expect(response.body.supermarkets.length).toBeGreaterThan(0);
    expect(response.body.supermarkets[0].totalPrice).toBeLessThanOrEqual(
      response.body.supermarkets[1].totalPrice,
    );
  });

  it('deve retornar status 404 se a lista não for encontrada ou estiver vazia', async () => {
    const response = await request(app).get('/supermarkets/cheapest/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Lista de compras não encontrada ou vazia');
  });

  it('deve retornar status 404 se nenhum supermercado tiver todos os produtos', async () => {
    const userId = await createUser('User 2', 'user2@test.com', 'password123');
    const supermarketId = await createSupermarket();

    const product1 = await prismaDatabase.product.create({ data: { barCode: '333', name: 'P1' } });
    const product2 = await prismaDatabase.product.create({ data: { barCode: '444', name: 'P2' } });

    await prismaDatabase.priceRecord.create({
      data: { productId: product1.id, supermarketId, price: 10, userId, available: true },
    });

    const listId = await createShoppingList(userId, 'Lista parcial');
    await prismaDatabase.listItem.createMany({
      data: [
        { listId, productId: product1.id, quantity: 1 },
        { listId, productId: product2.id, quantity: 1 },
      ],
    });

    const response = await request(app).get(`/supermarkets/cheapest/${listId}`);
    expect(response.status).toBe(404);

    expect(response.body).toHaveProperty(
      'error',
      'Nenhum supermercado encontrado com todos os produtos da lista',
    );
  });
});
