const userService = require('../services/user_service');

const getAllUsers = async (req, res) => {
  return res.status(500).json({ message: '' });
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
