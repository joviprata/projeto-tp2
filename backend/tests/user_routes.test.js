const request = require('supertest');
const app = require('../src/server');
const prismaDatabase = require('../src/prismaClient');

const createUser = async (name, email, password) => {
  const response = await request(app).post('/auth/register/user').send({
    name,
    email,
    password,
  });
  expect(response.status).toBe(201);
  return response.body;
};

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
  await cleanupDatabase();
  await prismaDatabase.$disconnect();
});

describe('Rotas de Usuário', () => {
  describe('GET /users/ - Mostrar todos os usuários', () => {
    it('deve retornar status 200 e um array de usuários', async () => {
      await createUser('Cliente Teste', 'email@teste.com', 'senha123');
      const response = await request(app).get('/users/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBe(1);
    });
  });

  describe('GET /users/:id - Obter usuário por ID', () => {
    it('deve retornar 200 e os dados do usuário para um ID válido', async () => {
      const { userId } = await createUser('Cliente Para Buscar', 'buscar@test.com', 'senha123');
      const response = await request(app).get(`/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: userId,
          name: 'Cliente Para Buscar',
          email: 'buscar@test.com',
          role: 'USER',
        }),
      );
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      const nonExistentId = 9999;
      const response = await request(app).get(`/users/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
    });
  });

  describe('DELETE /users/:id - Deletar usuário', () => {
    it('deve retornar 200 e uma mensagem de sucesso na exclusão', async () => {
      const { userId } = await createUser('Usuário para Deletar', 'delete@test.com', 'senha123');
      const response = await request(app).delete(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuário deletado com sucesso');
    });

    it('deve retornar 404 ao tentar deletar um usuário inexistente', async () => {
      const nonExistentId = 9999;
      const response = await request(app).delete(`/users/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });

    it('deve retornar 400 para um ID inválido', async () => {
      const invalidId = 'abc';
      const response = await request(app).delete(`/users/${invalidId}`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'ID inválido');
    });
  });

  describe('PUT /users/:id - Atualizar usuário', () => {
    let existingUserId;

    beforeEach(async () => {
      const { userId } = await createUser('Usuário Original', 'original@email.com', 'senha123');
      existingUserId = userId;
    });

    it('deve retornar 200 e os dados do usuário atualizados', async () => {
      const updatedUser = {
        name: 'Usuário Atualizado',
        email: 'novo@email.com',
        password: 'novasenha123',
      };
      const response = await request(app).put(`/users/${existingUserId}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: existingUserId,
          name: updatedUser.name,
          email: updatedUser.email,
        }),
      );
    });
    it('deve retornar 404 se o usuário a ser atualizado não for encontrado', async () => {
      const nonExistentId = 9999;
      const response = await request(app).put(`/users/${nonExistentId}`).send({
        name: 'Inexistente',
        email: 'inexistente@email.com',
        password: 'senha',
      });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });

    it('deve retornar 400 se o e-mail já estiver em uso por outro usuário', async () => {
      await createUser('Usuário Conflitante', 'conflito@email.com', 'senha123');
      const conflictingData = {
        name: 'Tentando Conflito',
        email: 'conflito@email.com',
        password: 'senha123',
      };

      const response = await request(app).put(`/users/${existingUserId}`).send(conflictingData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email já está em uso');
    });

    it('deve ignorar campos extras no payload', async () => {
      const updatedUser = {
        name: 'Usuário Com Campos Extras',
        email: 'extra@email.com',
        password: 'senha123',
        campoExtra1: 'valor1',
      };
      const response = await request(app).put(`/users/${existingUserId}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('campoExtra1');
      expect(response.body.name).toBe(updatedUser.name);
    });

    it('deve retornar 400 para um ID inválido', async () => {
      const invalidId = 'abc';
      const response = await request(app).put(`/users/${invalidId}`).send({
        name: 'Teste',
        email: 'teste@email.com',
        password: 'senha',
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'ID inválido');
    });

    describe('com dados incompletos', () => {
      it.each([
        {
          payload: {},
          expectedError: 'Dados do usuário inválidos ou incompletos',
        },
        {
          payload: { email: 'email@teste.com', password: 'senha' },
          expectedError: 'Campo(s) invalido(s)',
        },
        {
          payload: { name: 'Sem Email', password: 'senha' },
          expectedError: 'Campo(s) invalido(s)',
        },
        {
          payload: { name: 'Sem Senha', email: 'email@teste.com' },
          expectedError: 'Campo(s) invalido(s)',
        },
      ])('deve retornar 400 para $expectedError', async ({ payload, expectedError }) => {
        const response = await request(app).put(`/users/${existingUserId}`).send(payload);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', expectedError);
      });
    });
  });
});
