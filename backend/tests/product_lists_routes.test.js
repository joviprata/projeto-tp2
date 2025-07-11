const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

let testUserId; // Para armazenar o ID de um usuário de teste
let testProductId; // Para armazenar o ID de um produto de teste

const createTestUser = async () => {
  const uniqueEmail = `lista_${Date.now()}@test.com`; // Generate a unique email
  const user = await prismaDatabase.user.create({
    data: {
      name: 'Cliente Teste Lista',
      email: uniqueEmail,
      password: 'senha123',
      role: 'USER',
    },
  });
  return user.id;
};

const createTestProduct = async () => {
  const product = await prismaDatabase.product.create({
    data: {
      barCode: `1234567890123_${Date.now()}`,
      name: 'Arroz Teste',
      variableDescription: '5kg',
    }, // Unique barcode
  });
  return product.id;
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

  testUserId = await createTestUser();
  testProductId = await createTestProduct();
});

afterAll(async () => {
  await prismaDatabase.$disconnect();
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

  it('Deve retornar 404 se o usuário não existir', async () => {
    const response = await request(app)
      .post('/product-lists')
      .send({ userId: 999999, listName: 'Lista Inexistente' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
  });

  it('Deve retornar 403 se o usuário não for um cliente', async () => {
    const gerenteUser = await prismaDatabase.user.create({
      data: {
        name: 'Gerente Teste',
        email: `gerenteteste_${Date.now()}@email.com`, // Unique email for manager
        password: 'senha123',
        role: 'GERENTE',
      },
    });
    const response = await request(app)
      .post('/product-lists')
      .send({ userId: gerenteUser.id, listName: 'Lista de Gerente' });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'error',
      'Apenas usuários clientes podem criar listas de compras',
    );
  });
});

describe('GET /product-lists/user/:userId - Obter listas de compras por ID do usuário', () => {
  it('Deve retornar uma lista vazia se o usuário não tiver listas', async () => {
    const response = await request(app).get(`/product-lists/user/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('Deve retornar as listas do usuário com seus itens e detalhes do produto', async () => {
    const listId = await createShoppingList(testUserId, 'Lista de Compras'); // This helper now throws on failure

    await request(app)
      .post(`/product-lists/${listId}/items`)
      .send({ productId: testProductId, quantity: 3 });

    const response = await request(app).get(`/product-lists/user/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('id', listId);
    expect(response.body.data[0]).toHaveProperty('listName', 'Lista de Compras');
    expect(response.body.data[0].items).toHaveLength(1);
    expect(response.body.data[0].items[0]).toHaveProperty('product');
    expect(response.body.data[0].items[0].product).toHaveProperty('id', testProductId);
  });

  it('Deve retornar 404 se o usuário não existir', async () => {
    const nonExistentUserId = 999999;
    const response = await request(app).get(`/product-lists/user/${nonExistentUserId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
  });
});

describe('POST /product-lists/:listId/items - Adicionar/atualizar produto em uma lista de compras', () => {
  let listId;
  beforeEach(async () => {
    listId = await createShoppingList(testUserId, 'Lista de Teste'); // This helper now throws on failure
  });

  it('Deve adicionar um produto à lista de compras', async () => {
    const response = await request(app)
      .post(`/product-lists/${listId}/items`)
      .send({ productId: testProductId, quantity: 2 });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('listId', listId);
    expect(response.body.data).toHaveProperty('productId', testProductId);
    expect(response.body.data.quantity).toBe(2);
  });

  it('Deve retornar 404 se a lista de compras não existir', async () => {
    const response = await request(app)
      .post('/product-lists/999999/items')
      .send({ productId: testProductId, quantity: 2 });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Lista de compras não encontrada');
  });

  it('Deve retornar 404 se o produto não existir', async () => {
    const response = await request(app)
      .post(`/product-lists/${listId}/items`)
      .send({ productId: 999999, quantity: 2 });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Produto não encontrado');
  });
});

describe('PUT /product-lists/:listId/items/:productId - Atualizar produto em uma lista de compras', () => {
  let listId;

  beforeEach(async () => {
    listId = await createShoppingList(testUserId, 'Lista de Teste'); // This helper now throws on failure
    await request(app)
      .post(`/product-lists/${listId}/items`)
      .send({ productId: testProductId, quantity: 2 });
  });

  it('Deve atualizar a quantidade de um produto e o status isTaken de uma lista com sucesso', async () => {
    const updatePayload = { quantity: 5, isTaken: true };
    const response = await request(app)
      .put(`/product-lists/${listId}/items/${testProductId}`)
      .send(updatePayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('listId', listId);
    expect(response.body.data).toHaveProperty('productId', testProductId);
    expect(response.body.data).toHaveProperty('quantity', 5);
    expect(response.body.data).toHaveProperty('isTaken', true);

    const updatedItem = await prismaDatabase.listItem.findUnique({
      where: { listId_productId: { listId, productId: testProductId } },
    });
    expect(updatedItem.quantity).toBe(5);
    expect(updatedItem.isTaken).toBe(true);
  });

  it('Deve retornar 400 se os dados de atualização estiverem vazios', async () => {
    const response = await request(app)
      .put(`/product-lists/${listId}/items/${testProductId}`)
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Dados de atualização inválidos');
  });

  it('Deve retornar 404 se o item na lista não for encontrado', async () => {
    const response = await request(app)
      .put(`/product-lists/${listId}/items/999999`)
      .send({ quantity: 5, isTaken: true });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Item da lista não foi encontrado');
  });
});

describe('DELETE /product-lists/:listId/items/:productId - Deletar um item de uma lista de compras', () => {
  let listId;

  beforeEach(async () => {
    listId = await createShoppingList(testUserId, 'Lista para deletar produto'); // This helper now throws on failure
    await request(app)
      .post(`/product-lists/${listId}/items`)
      .send({ productId: testProductId, quantity: 2 });
  });

  it('Deve deletar um item de uma lista de compras com sucesso', async () => {
    const response = await request(app).delete(`/product-lists/${listId}/items/${testProductId}`);
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});

    const deletedItem = await prismaDatabase.listItem.findUnique({
      where: { listId_productId: { listId, productId: testProductId } },
    });
    expect(deletedItem).toBeNull();
  });

  it('Deve retornar 404 se o item da lista não existir', async () => {
    const response = await request(app).delete(`/product-lists/${listId}/items/999999`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Item da lista não foi encontrado');
  });
});

describe('DELETE /product-lists/:listId - Deletar uma lista inteira', () => {
  let listIdToDelete;

  beforeEach(async () => {
    listIdToDelete = await createShoppingList(testUserId, 'Lista para Deletar'); // This helper now throws on failure
    await request(app)
      .post(`/product-lists/${listIdToDelete}/items`)
      .send({ productId: testProductId, quantity: 2 });
  });

  it('Deve deletar uma lista de compras com sucesso', async () => {
    const response = await request(app).delete(`/product-lists/${listIdToDelete}`);
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});

    const deletedList = await prismaDatabase.shoppingList.findUnique({
      where: { id: listIdToDelete },
    });
    expect(deletedList).toBeNull();

    const deletedItems = await prismaDatabase.listItem.findMany({
      where: {
        listId: listIdToDelete,
        productId: testProductId,
      },
    });
    expect(deletedItems).toHaveLength(0);
  });

  it('Deve retornar 404 se a lista de compras não existir', async () => {
    const response = await request(app).delete('/product-lists/999999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Lista de compras não encontrada');
  });
});
