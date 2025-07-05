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
    // if (!user) {
    //   return { status: 404, error: 'Usuário não encontrado' };
    // }
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
  return {
    status: 500,
    message: '',
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
