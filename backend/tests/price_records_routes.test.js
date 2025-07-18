const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

let testUser;
let testSupermarket;
let testProduct;

beforeEach(async () => {
  await prismaDatabase.$executeRawUnsafe('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  await prismaDatabase.$executeRawUnsafe('TRUNCATE TABLE supermercado RESTART IDENTITY CASCADE;');
  await prismaDatabase.$executeRawUnsafe('TRUNCATE TABLE produtos RESTART IDENTITY CASCADE;');
  await prismaDatabase.$executeRawUnsafe(
    'TRUNCATE TABLE registros_de_preco RESTART IDENTITY CASCADE;',
  );

  testUser = await prismaDatabase.user.create({
    data: {
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123',
      role: 'USER',
    },
  });

  const manager = await prismaDatabase.user.create({
    data: {
      name: 'Test Manager',
      email: 'test.manager@example.com',
      password: 'password123',
      role: 'GERENTE',
    },
  });

  testSupermarket = await prismaDatabase.supermarket.create({
    data: {
      name: 'Test Supermarket',
      managerId: manager.id,
    },
  });

  testProduct = await prismaDatabase.product.create({
    data: {
      name: 'Test Product',
      barCode: '1234567890123',
      variableDescription: 'A test product',
    },
  });
});

afterAll(async () => {
  await prismaDatabase.$disconnect();
});

describe('Rotas de Registros de Preço', () => {
  describe('POST /price-records', () => {
    it('deve criar um novo registro de preço', async () => {
      const response = await request(app).post('/price-records').send({
        price: 9.99,
        productId: testProduct.id,
        supermarketId: testSupermarket.id,
        userId: testUser.id,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.price).toBe('9.99');
    });

    it('deve retornar 400 para dados incompletos', async () => {
      const response = await request(app).post('/price-records').send({ price: 9.99 });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Dados incompletos para criar o registro de preço.');
    });
  });

  describe('GET /price-records', () => {
    it('deve retornar todos os registros de preço', async () => {
      await prismaDatabase.priceRecord.create({
        data: {
          price: 9.99,
          productId: testProduct.id,
          supermarketId: testSupermarket.id,
          userId: testUser.id,
        },
      });

      const response = await request(app).get('/price-records');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /price-records/:id', () => {
    it('deve retornar um registro de preço pelo id', async () => {
      const priceRecord = await prismaDatabase.priceRecord.create({
        data: {
          price: 9.99,
          productId: testProduct.id,
          supermarketId: testSupermarket.id,
          userId: testUser.id,
        },
      });

      const response = await request(app).get(`/price-records/${priceRecord.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(priceRecord.id);
    });

    it('deve retornar 404 para um id inexistente', async () => {
      const response = await request(app).get('/price-records/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Registro de preço não encontrado.');
    });
  });

  describe('PUT /price-records/:id', () => {
    it('deve atualizar um registro de preço', async () => {
      const priceRecord = await prismaDatabase.priceRecord.create({
        data: {
          price: 9.99,
          productId: testProduct.id,
          supermarketId: testSupermarket.id,
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .put(`/price-records/${priceRecord.id}`)
        .send({ price: 10.99, verified: true });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe('10.99');
      expect(response.body.verified).toBe(true);
    });
  });

  describe('DELETE /price-records/:id', () => {
    it('deve deletar um registro de preço', async () => {
      const priceRecord = await prismaDatabase.priceRecord.create({
        data: {
          price: 9.99,
          productId: testProduct.id,
          supermarketId: testSupermarket.id,
          userId: testUser.id,
        },
      });

      const response = await request(app).delete(`/price-records/${priceRecord.id}`);
      expect(response.status).toBe(204);
    });
  });

  describe('GET /price-records/supermarket/:supermarketId', () => {
    it('deve retornar registros de preço pelo id do supermercado', async () => {
      await prismaDatabase.priceRecord.create({
        data: {
          price: 9.99,
          productId: testProduct.id,
          supermarketId: testSupermarket.id,
          userId: testUser.id,
        },
      });

      const response = await request(app).get(`/price-records/supermarket/${testSupermarket.id}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].supermarketId).toBe(testSupermarket.id);
    });
  });

  describe('GET /price-records/product/:productId', () => {
    it('deve retornar registros de preço pelo id do produto', async () => {
      await prismaDatabase.priceRecord.create({
        data: {
          price: 9.99,
          productId: testProduct.id,
          supermarketId: testSupermarket.id,
          userId: testUser.id,
        },
      });

      const response = await request(app).get(`/price-records/product/${testProduct.id}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].productId).toBe(testProduct.id);
    });
  });
});
