const prismaDatabase = require('../prismaClient');

const getAllUsers = async () => {
  try {
    const users = await prismaDatabase.user.findMany();
    return { status: 200, users };
  } catch {
    return { status: 500, message: 'Erro interno do servidor' };
  }
};

const getUserById = async (id) => {
  try {
    const user = await prismaDatabase.user.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!user) {
      return { status: 404, error: 'Usuário não encontrado' };
    }
    return {
      status: 200,
      data: user,
    };
  } catch {
    return { status: 500, error: 'Erro interno do servidor' };
  }
};

const updateUser = async (id, userData) => {
  try {
    // Validação do ID
    const userId = parseInt(id, 10);
    if (Number.isNaN(userId)) {
      return { status: 400, message: 'ID inválido' };
    }

    // Verifica se o corpo da requisição está vazio
    if (Object.keys(userData).length === 0) {
      return { status: 400, message: 'Dados do usuário inválidos ou incompletos' };
    }

    // Validações de campos obrigatórios
    if (
      userData.name === undefined ||
      userData.email === undefined ||
      userData.password === undefined
    ) {
      return { status: 400, message: 'Campo(s) invalido(s)' };
    }

    if (userData.name === '' || userData.email === '' || userData.password === '') {
      return { status: 400, message: 'Campo(s) invalido(s)' };
    }

    // Verifica se usuário existe
    const existingUser = await prismaDatabase.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return { status: 404, message: 'Usuário não encontrado' };
    }

    // Verifica conflito de email
    if (userData.email !== existingUser.email) {
      const userWithSameEmail = await prismaDatabase.user.findUnique({
        where: { email: userData.email },
      });

      if (userWithSameEmail) {
        return { status: 400, message: 'Email já está em uso' };
      }
    }

    // Filtra apenas campos permitidos (ignora campos extras)
    const allowedFields = ['name', 'email', 'password'];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (userData[field] !== undefined) {
        filteredData[field] = userData[field];
      }
    });

    // Atualiza usuário apenas com campos permitidos
    const updatedUser = await prismaDatabase.user.update({
      where: { id: userId },
      data: filteredData,
    });

    // Retorna todos os dados incluindo a senha
    return { status: 200, data: updatedUser };
  } catch (error) {
    // Trata erro de email único (backup para caso a verificação manual falhe)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return { status: 400, message: 'Email já está em uso' };
    }

    return { status: 500, message: 'Erro interno do servidor' };
  }
};

const deleteUser = async (id) => {
  try {
    // Validação do ID
    const userId = parseInt(id, 10);
    if (!userId) {
      return { status: 400, message: 'ID inválido' };
    }

    // Verifica se o usuário existe
    const user = await prismaDatabase.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { status: 404, message: 'Usuário não encontrado' };
    }

    // Deleta o usuário
    await prismaDatabase.user.delete({
      where: { id: userId },
    });

    return { status: 200, message: 'Usuário deletado com sucesso' };
  } catch (error) {
    return { status: 500, message: 'Erro interno do servidor' };
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
