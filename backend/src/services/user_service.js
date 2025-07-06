const prismaDatabase = require('../prismaClient');

const getAllUsers = async () => {
  try {
    const users = await prismaDatabase.user.findMany();
    return { status: 200, users };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
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
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return { status: 500, error: 'Erro interno do servidor' };
  }
};

const updateUser = async (id, userData) => {
  return {
    status: 500,
    message: '',
  };
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
