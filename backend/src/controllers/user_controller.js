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
  try {
    const { id } = req.params;
    const results = await userService.getUserById(id);
    if (results.status === 200) {
      return res.status(200).json(results.data);
    }
    // if (results.status === 404) {
    //   return res.status(404).json({ error: 'Usuário não encontrado' });
    // }
    return res.status(500).json({ message: 'Service Error' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
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
