const prismaDatabase = require('../prismaClient');

const getAllUsers = async () => {
    try {
        const users = await prismaDatabase.user.findMany();
        return {status:200, users: users};
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return {status: 500, message: 'Erro interno do servidor'};
    }
};

const getUserById = async (id) => {
  return {
    status: 500,
    message: '',
  };
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
