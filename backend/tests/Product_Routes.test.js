const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

// Função auxiliar para criar um produto via API
const createProduct = async (name, barCode, variableDescription) => {
  const response = await request(app).post('/products').send({
    name,
    barCode,
    variableDescription,
  });
  return response.body;
};

// Função auxiliar para limpar o banco de dados
const cleanupDatabase = async () => {
  const tableNames = [
    'itens_da_lista',
    'listas_de_compra',
    'registros_de_preco',
    'produtos',
    'supermercado',
    'users',
  ];
  tableNames.forEach(async (tableName) => {
    await prismaDatabase.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
    );
  });
};

beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await prismaDatabase.$disconnect();
});

describe('Rotas de Produtos', () => {
  describe('POST /products - Registrar um novo produto', () => {
    it('deve retornar 200 e os dados do produto criado', async () => {
      const newProduct = {
        name: 'Produto Novo',
        barCode: '9876543210987',
        variableDescription: 'Descrição do Produto Novo',
      };
      const response = await request(app).post('/products').send(newProduct);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.barCode).toBe(newProduct.barCode);
    });

    it('deve retornar 400 se os dados do produto estiverem incompletos', async () => {
      const incompleteProduct = { name: 'Produto Incompleto' };
      const response = await request(app).post('/products').send(incompleteProduct);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Dados do produto incompletos');
    });

    it('deve retornar 400 se o código de barras já existir', async () => {
      await createProduct('Produto Existente', '1234567890123', 'Descricao');
      const response = await request(app).post('/products').send({
        name: 'Outro Produto',
        barCode: '1234567890123',
        variableDescription: 'Outra Descricao',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'Produto com este nome ou código de barras já existe',
      );
    });
  });

  describe('GET /products - Obter todos os produtos', () => {
    it('deve retornar status 200 e um array de produtos', async () => {
      await createProduct('Produto 1', '1111111111111', 'Desc 1');
      await createProduct('Produto 2', '2222222222222', 'Desc 2');

      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /products/:id - Obter produto por ID', () => {
    it('deve retornar status 200 e os dados do produto', async () => {
      const product = await createProduct('Produto para Buscar', '3333333333333', 'Desc 3');
      const response = await request(app).get(`/products/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', product.id);
      expect(response.body.name).toBe('Produto para Buscar');
    });

    it('deve retornar status 404 se o produto não for encontrado', async () => {
      const nonExistentId = 9999;
      const response = await request(app).get(`/products/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Produto não encontrado');
    });
  });

  describe('PUT /products/:id - Atualizar produto', () => {
    it('deve retornar status 200 e os dados do produto atualizado', async () => {
      const product = await createProduct('Produto Original', '4444444444444', 'Desc 4');
      const updatedData = {
        name: 'Produto Atualizado',
        barCode: '4444444444445',
        variableDescription: 'Descrição Atualizada',
      };

      const response = await request(app).put(`/products/${product.id}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.barCode).toBe(updatedData.barCode);
    });

    it('deve retornar status 404 se o produto não for encontrado', async () => {
      const nonExistentId = 9999;
      const response = await request(app).put(`/products/${nonExistentId}`).send({
        name: 'Inexistente',
        barCode: '000',
        variableDescription: 'Desc',
      });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Produto não encontrado');
    });

    it('deve retornar 400 ao tentar atualizar para um código de barras que já existe', async () => {
      await createProduct('Produto 1', '1111111111111', 'Desc 1');
      const product2 = await createProduct('Produto 2', '2222222222222', 'Desc 2');

      const response = await request(app).put(`/products/${product2.id}`).send({
        name: 'Produto 2 Atualizado',
        barCode: '1111111111111',
        variableDescription: 'Desc Atualizada',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'Produto com nome ou código de barras já existente',
      );
    });
  });

  describe('DELETE /products/:id - Excluir produto', () => {
    it('deve retornar status 200 e mensagem de sucesso', async () => {
      const product = await createProduct('Produto para Deletar', '5555555555555', 'Desc 5');
      const response = await request(app).delete(`/products/${product.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Produto excluído com sucesso');
    });

    it('deve retornar status 404 ao tentar excluir um produto inexistente', async () => {
      const nonExistentId = 9999;
      const response = await request(app).delete(`/products/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Produto não encontrado');
    });
  });

  describe('GET /products/with-price-records - Obter produtos com registros de preço', () => {
    it('deve retornar produtos com registros de preço agrupados por supermercado', async () => {
      const user = await prismaDatabase.user.create({
        data: {
          name: 'Usuário Teste',
          email: 'usuario@teste.com',
          password: 'senha123',
          role: 'MANAGER',
        },
      });
      const user2 = await prismaDatabase.user.create({
        data: {
          name: 'Usuário Teste 2',
          email: 'usuario2@teste.com',
          password: 'senha123',
          role: 'MANAGER',
        },
      });
      const supermarket1 = await prismaDatabase.supermarket.create({
        data: {
          name: 'Supermercado 1',
          address: 'Endereço 1',
          managerId: user.id,
        },
      });

      const supermarket2 = await prismaDatabase.supermarket.create({
        data: {
          name: 'Supermercado 2',
          address: 'Endereço 2',
          managerId: user2.id,
        },
      });

      // Criar produto
      const product = await createProduct('Produto Teste', '1111111111111', 'Descrição Teste');

      // Criar múltiplos registros de preço para o mesmo produto no mesmo supermercado
      await prismaDatabase.priceRecord.create({
        data: {
          price: 10.5,
          productId: product.id,
          supermarketId: supermarket1.id,
          userId: user.id,
          available: true,
          verified: false,
        },
      });

      await prismaDatabase.priceRecord.create({
        data: {
          price: 11,
          productId: product.id,
          supermarketId: supermarket1.id,
          userId: user.id,
          available: true,
          verified: true,
        },
      });

      await prismaDatabase.priceRecord.create({
        data: {
          price: 12,
          productId: product.id,
          supermarketId: supermarket2.id,
          userId: user.id,
          available: true,
          verified: false,
        },
      });

      const response = await request(app).get('/products/with-price-records');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const productWithPrices = response.body.find((p) => p.id === product.id);
      expect(productWithPrices).toBeDefined();
      expect(productWithPrices.pricesBySupermarket).toBeDefined();
      expect(Array.isArray(productWithPrices.pricesBySupermarket)).toBe(true);

      // Verificar se existem dois supermercados com preços
      expect(productWithPrices.pricesBySupermarket).toHaveLength(2);

      // Verificar se o primeiro supermercado tem múltiplos registros
      const supermarket1Data = productWithPrices.pricesBySupermarket.find(
        (s) => s.supermarket.id === supermarket1.id,
      );
      expect(supermarket1Data).toBeDefined();
      expect(supermarket1Data.priceRecords).toHaveLength(2);
      expect(supermarket1Data.supermarket.name).toBe('Supermercado 1');

      // Verificar se o segundo supermercado tem um registro
      const supermarket2Data = productWithPrices.pricesBySupermarket.find(
        (s) => s.supermarket.id === supermarket2.id,
      );
      expect(supermarket2Data).toBeDefined();
      expect(supermarket2Data.priceRecords).toHaveLength(1);
      expect(supermarket2Data.supermarket.name).toBe('Supermercado 2');
    });

    it('deve retornar produtos sem registros de preço', async () => {
      const product = await createProduct('Produto Sem Preço', '2222222222222', 'Sem preços');

      const response = await request(app).get('/products/with-price-records');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const productWithoutPrices = response.body.find((p) => p.id === product.id);
      expect(productWithoutPrices).toBeDefined();
      expect(productWithoutPrices.pricesBySupermarket).toEqual([]);
    });

    it('deve retornar array vazio quando não há produtos', async () => {
      const response = await request(app).get('/products/with-price-records');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve ordenar registros de preço por data (mais recentes primeiro)', async () => {
      const user = await prismaDatabase.user.create({
        data: {
          name: 'Usuário Teste',
          email: 'usuario@teste.com',
          password: 'senha123',
          role: 'client',
        },
      });

      const supermarket = await prismaDatabase.supermarket.create({
        data: {
          name: 'Supermercado Teste',
          address: 'Endereço Teste',
          managerId: user.id,
        },
      });

      const product = await createProduct('Produto Ordenação', '3333333333333', 'Teste ordenação');

      await prismaDatabase.priceRecord.create({
        data: {
          price: 15.0,
          productId: product.id,
          supermarketId: supermarket.id,
          userId: user.id,
          available: true,
          verified: false,
        },
      });

      // Simular delay
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      await prismaDatabase.priceRecord.create({
        data: {
          price: 16.0,
          productId: product.id,
          supermarketId: supermarket.id,
          userId: user.id,
          available: true,
          verified: false,
        },
      });

      const response = await request(app).get('/products/with-price-records');

      expect(response.status).toBe(200);
    });
  });
});
