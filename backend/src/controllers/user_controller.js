const userService = require('../services/user_service');

const registerUser = async (req,res) => {
    return res.status(500).json({ message: "" });
}

const getAllUsers = async (req,res) => {
    return res.status(500).json({ message: "" });
}

const getUserById = async (req,res) => {
    return res.status(500).json({ message: "" });
}

const updateUser = async (req,res) => {
    return res.status(500).json({ message: "" });
}

const deleteUser = async (req,res) => {
    return res.status(500).json({ message: "" });
}

module.exports = {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}