const prismaDatabase = require('../prismaClient');

const registerUser = async (userData) => {
    return {
        status: 500,
        message: ""
    };
}

const getAllUsers = async () => {
    return {
        status: 500,
        message: ""
    };
}

const getUserById = async (id) => {
    return {
        status: 500,
        message: ""
    };
}

const updateUser = async (id, userData) => {
    return {
        status: 500,
        message: ""
    };
}

const deleteUser = async (id) => {
    return {
        status: 500,
        message: ""
    };
}

module.exports = {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};