const userService = require('../services/user_service');

const getAllUsers = async (req, res) => {
    try {
        const results = await userService.getAllUsers();
        res.status(results.status).json({ users: results.users });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const getUserById = async (req, res) => {
  return res.status(500).json({ message: '' });
};

const updateUser = async (req, res) => {
  return res.status(500).json({ message: '' });
};

const deleteUser = async (req, res) => {
  return res.status(500).json({ message: '' });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
