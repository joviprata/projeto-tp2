const prismaDatabase = require('../prismaClient');

const isPasswordValid = (inputPassword, storedPassword) => inputPassword === storedPassword;

const login = async ({ email, password }) => {
  try {
    const user = await prismaDatabase.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        status: 401,
        error: 'Email inválido',
      };
    }

    if (!isPasswordValid(password, user.password)) {
      return {
        status: 401,
        error: 'Senha inválida',
      };
    }
    return {
      status: 200,
      message: 'Login realizado com sucesso',
      userId: user.id,
      role: user.role,
    };
  } catch {
    return {
      status: 500,
      error: 'Erro interno do servidor',
    };
  }
};

const registerGerente = async ({ name, email, password, address }) => {
  try {
    const existingUser = await prismaDatabase.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        status: 409,
        error: 'Email já em uso',
      };
    }

    const newGerente = await prismaDatabase.user.create({
      data: {
        name,
        email,
        password,
        role: 'GERENTE',
      },
    });

    const newSupermarket = await prismaDatabase.supermarket.create({
      data: {
        name,
        address,
        manager: {
          connect: {
            id: newGerente.id,
          },
        },
      },
    });

    return {
      status: 201,
      message: 'Gerente registrado com sucesso',
      supermarketId: newSupermarket.id,
    };
  } catch {
    return {
      status: 500,
      error: 'Erro interno do servidor',
    };
  }
};

const registerUser = async (userData) => {
  try {
    const existingUser = await prismaDatabase.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      return { status: 409, error: 'Email já em uso' };
    }
    const newUser = await prismaDatabase.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'USER',
      },
    });
    return {
      status: 201,
      message: 'Usuário registrado com sucesso',
      userId: newUser.id,
    };
  } catch {
    return { status: 500, error: 'Erro interno do servidor' };
  }
};

module.exports = {
  login,
  registerGerente,
  registerUser,
};
