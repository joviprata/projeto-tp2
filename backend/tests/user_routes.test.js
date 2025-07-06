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

describe('DELETE /users/:id - Deletar usuário', () => {
  it('Deve retornar 200 e uma mensagem de sucesso ao deletar um usuário', async () => {
    // Cria um novo usuário para deletar
    const newUser = {
      name: 'Usuário para Deletar',
      email: 'delete@test.com',
      password: 'senha123',
    };

    const createResponse = await request(app).post('/auth/register/user').send(newUser);

    expect(createResponse.status).toBe(201);
    const { userId } = createResponse.body;

    // Deleta o usuário criado
    const deleteResponse = await request(app).delete(`/users/${userId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Usuário deletado com sucesso');
  });

  it('Deve retornar 404 ao tentar deletar um usuário que não existe', async () => {
    const nonExistentId = 9999;
    const response = await request(app).delete(`/users/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });

  it('Deve retornar 400 ao passar um ID inválido', async () => {
    const invalidId = 'abc';
    const response = await request(app).delete(`/users/${invalidId}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'ID inválido');
  });
});

describe('PUT /users/:id - Atualizar usuário', () => {
  let existingUserId;

  beforeAll(async () => {
    // Cria um usuário para ser usado nos testes
    const createResponse = await request(app).post('/auth/register/user').send({
      name: 'Usuário Original',
      email: 'original@email.com',
      password: 'senha123',
    });
    existingUserId = createResponse.body.userId;
  });

  // Teste de sucesso
  it('Deve retornar status 200 e os dados do usuário atualizado', async () => {
    const updatedUser = {
      name: 'Usuário Atualizado',
      email: 'novo@email.com',
      password: 'novasenha123',
    };

    const response = await request(app).put(`/users/${existingUserId}`).send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', existingUserId);
    expect(response.body.name).toBe(updatedUser.name);
    expect(response.body.email).toBe(updatedUser.email);
  });

  // Usuário não encontrado
  it('Deve retornar status 404 se o usuário não for encontrado', async () => {
    const nonExistentId = 9999;
    const updatedUser = {
      name: 'Usuário Inexistente',
      email: 'inexistente@email.com',
      password: 'senha123',
    };

    const response = await request(app).put(`/users/${nonExistentId}`).send(updatedUser);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });

  // Dados incompletos
  describe('Atualizar usuário com dados incompletos', () => {
    it.each([
      {
        case: 'Dados vazios',
        updateUser: {},
        expectedError: 'Dados do usuário inválidos ou incompletos',
      },
      {
        case: 'Nome ausente',
        updateUser: {
          email: 'email@teste.com',
          password: 'senha123',
        },
        expectedError: 'Campo(s) invalido(s)',
      },
      {
        case: 'Email ausente',
        updateUser: {
          name: 'Usuário sem email',
          password: 'senha123',
        },
        expectedError: 'Campo(s) invalido(s)',
      },
      {
        case: 'Password ausente',
        updateUser: {
          name: 'Usuário sem password',
          email: 'email@teste.com',
        },
        expectedError: 'Campo(s) invalido(s)',
      },
    ])('Deve retornar 400 para $case', async ({ updateUser, expectedError }) => {
      const response = await request(app).put(`/users/${existingUserId}`).send(updateUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', expectedError);
    });
  });

  // Conflitos de email
  describe('Atualizar usuário com email já existente', () => {
    let conflictingUserId;

    beforeAll(async () => {
      // Cria um usuário para causar conflito
      const createResponse = await request(app).post('/auth/register/user').send({
        name: 'Usuário Conflitante',
        email: 'conflito@email.com',
        password: 'senha123',
      });
      conflictingUserId = createResponse.body.userId;
    });

    it('Deve retornar 400 se o email já existir em outro usuário', async () => {
      const conflictingData = {
        name: 'Usuário Tentando Conflito',
        email: 'conflito@email.com', // Email do usuário criado no beforeAll
        password: 'senha123',
      };

      const response = await request(app)
        .put(`/users/${existingUserId}`) // Atualizando o usuário original, não o conflitante
        .send(conflictingData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email já está em uso');
    });

    it('Deve permitir atualização quando não há conflito com o próprio usuário', async () => {
      const updateData = {
        name: 'Usuário Original Atualizado',
        email: 'original@email.com', // Mesmo email do usuário original (não deve causar conflito)
        password: 'novasenha123',
      };

      const response = await request(app).put(`/users/${existingUserId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updateData.email);
    });
  });

  // Teste de campos extras
  it('Deve ignorar campos extras no payload', async () => {
    const updatedUser = {
      name: 'Usuário com Campos Extras',
      email: 'extra@email.com',
      password: 'senha123',
      campoExtra1: 'valor1',
      campoExtra2: 1234,
    };

    const response = await request(app).put(`/users/${existingUserId}`).send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('campoExtra1');
    expect(response.body).not.toHaveProperty('campoExtra2');
  });

  // Teste de ID inválido
  it('Deve retornar 400 ao passar ID inválido', async () => {
    const invalidId = 'abc';
    const updatedUser = {
      name: 'Usuário Teste',
      email: 'teste@email.com',
      password: 'senha123',
    };

    const response = await request(app).put(`/users/${invalidId}`).send(updatedUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'ID inválido');
  });

  // Teste de atualização com mais de 3 campos
  it('Deve permitir atualização com campos extras sem problemas', async () => {
    const updateWithExtraFields = {
      name: 'Usuário com Campos Extras',
      email: 'extrafields@email.com',
      password: 'senha123',
      extra1: 'valor1',
      extra2: 1234,
      extra3: true,
    };

    const response = await request(app).put(`/users/${existingUserId}`).send(updateWithExtraFields);

    expect(response.status).toBe(200);
    // Apenas verifica que a atualização foi bem sucedida, campos extras são ignorados
    expect(response.body.name).toBe(updateWithExtraFields.name);
    expect(response.body.email).toBe(updateWithExtraFields.email);
  });
});

