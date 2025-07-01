const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

beforeAll(async () => {
  const CreateProduct = {
    name: 'Produto Teste',
    barCode: '1234567890123',
    variableDescription: 'Descrição do Produto Teste',
  };
  const CreateProduct2 = {
    name: 'Produto Teste 2',
    barCode: '1234567890124',
    variableDescription: 'Descrição do Produto Teste 2',
  };
  const response = await request(app).post('/products').send(CreateProduct);
  CreateProduct.id = response.body.id; // Armazena o ID do produto criado para uso posterior
  const response2 = await request(app).post('/products').send(CreateProduct2);
  CreateProduct2.id = response2.body.id; // Armazena o ID do segundo produto criado para uso posterior
});

afterAll(async () => {
  const TableNames = [
    'users',
    'supermercado',
    'produtos',
    'registros_de_preco',
    'listas_de_compra',
    'itens_da_lista',
  ];

  TableNames.forEach(async (tableName) => {
    await prismaDatabase.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
    );
  });
  await prismaDatabase.$disconnect();
});

describe('POST /products - Registrar um novo produto', () => {
  it('Deve retornar 200 e os dados do produto criado', async () => {
    const newProduct = {
      name: 'Produto novo',
      barCode: '9876543210987',
      variableDescription: 'Descrição do Produto novo',
    };

    const response = await request(app).post('/products').send(newProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(newProduct.nome);
    expect(response.body.CodidoDeBarras).toBe(newProduct.CodidoDeBarras);
    expect(response.body.descricao).toBe(newProduct.descricao);
  });

  it('Deve retornar 400 se os dados do produto estiverem incompletos', async () => {
    const incompleteProduct = {
      name: 'Produto Incompleto',
    };

    const response = await request(app).post('/products').send(incompleteProduct);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 400 se o produto já existir (mesmo nome e código de barras)', async () => {
    const existingProduct = {
      name: 'Produto Teste',
      barCode: '1234567890123',
      variableDescription: 'Descrição do Produto Teste',
    };

    const response = await request(app).post('/products').send(existingProduct);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 400 se o nome for uma string vazia', async () => {
    const emptyNameProduct = {
      name: '',
      barCode: '1234567890123',
      variableDescription: 'Descrição do Produto com Nome Vazio',
    };

    const response = await request(app).post('/products').send(emptyNameProduct);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Nome do produto não pode ser vazio');
  });
});

describe('GET /products - Obter todos os produtos', () => {
  it('Deve retornar status 200 e um array de produtos', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0); // Verifica se há pelo menos um produto
    expect(response.body[0]).toHaveProperty('name');
  });
});

describe('GET /products/:id - Obter produto por ID', () => {
  it('Deve retornar status 200 e os dados do produto', async () => {
    const productId = 1; // Substitua pelo ID do produto que você deseja testar

    const response = await request(app).get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('barCode');
    expect(response.body).toHaveProperty('variableDescription');
  });

  it('Deve retornar status 404 se o produto não for encontrado', async () => {
    const nonExistentId = 9999; // ID que não existe no banco de dados

    const response = await request(app).get(`/products/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Produto não encontrado');
  });
});

describe('PUT /products/:id - Atualizar produto', () => {
  it('Deve retornar status 200 e os dados do produto atualizado', async () => {
    const productId = 1; // Substitua pelo ID do produto que você deseja testar
    const updatedProduct = {
      name: 'Produto Atualizado',
      barCode: '1234567890123',
      variableDescription: 'Descrição do Produto Atualizado',
    };

    const response = await request(app).put(`/products/${productId}`).send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
    expect(response.body.name).toBe(updatedProduct.name);
  });

  it('Deve retornar status 404 se o produto não for encontrado', async () => {
    const nonExistentId = 9999; // ID que não existe no banco de dados

    const updatedProduct = {
      name: 'Produto Inexistente',
      barCode: '0000000000000',
      variableDescription: 'Este produto não existe',
    };

    const response = await request(app).put(`/products/${nonExistentId}`).send(updatedProduct);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Produto não encontrado');
  });
});

describe('PUT /products/:id - Atualizar produto com dados incompletos ou inválidos', () => {
  it.each([
    {
      case: 'Dados incompletos',
      productId: 1,
      updateProduct: {},
    },
    {
      case: 'Mais de 3 campos',
      productId: 1,
      updateProduct: {
        name: 'Produto inválido',
        barCode: '1234567890123',
        variableDescription: 'Descrição do Produto Inválido',
        extraField: 'Campo Extra',
      },
    },
  ])(
    'Deve retornar 400 se os dados do produto estiverem incompletos ou inválidos - $case',
    async ({ productId, updateProduct }) => {
      const response = await request(app).put(`/products/${productId}`).send(updateProduct);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Dados do produto inválidos ou incompletos');
    },
  );
});

describe('PUT /products/:id - Atualizar produto com nome e código de barras já existentes', () => {
  it('Deve retornar 400 se o nome ou código de barras já existirem', async () => {
    const productId = 1; // Substitua pelo ID do produto que você deseja testar
    const existingProduct = {
      name: 'Produto Teste 2',
      barCode: '1234567890124',
      variableDescription: 'Descrição do Produto Teste',
    };
    const response = await request(app).put(`/products/${productId}`).send(existingProduct);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'error',
      'Produto com nome ou código de barras já existente',
    );
  });
});

describe('DELETE /products/:id - Excluir produto', () => {
  it('Deve retornar status 200 e mensagem de sucesso ao excluir um produto existente', async () => {
    const productId = 1; // Substitua pelo ID do produto que você deseja testar

    const response = await request(app).delete(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Produto excluído com sucesso');
  });

  it('Deve retornar status 404 ao tentar excluir um produto inexistente', async () => {
    const nonExistentId = 9999; // ID que não existe no banco de dados

    const response = await request(app).delete(`/products/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Produto não encontrado');
  });
});
