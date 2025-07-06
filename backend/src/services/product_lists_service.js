const prismaDatabase = require('../prismaClient');

const createProductList = async (userId, listName) => {
  return { status: 500, message: 'Not implemented yet' };
};

const getListsByUserId = async (userId) => {
  return { status: 500, message: 'Not implemented yet' };
};

const addProductToList = async (listId, productId, quantity) => {
  return { status: 500, message: 'Not implemented yet' };
};

const updateProductFromList = async (listId, productId, quantity) => {
  return { status: 500, message: 'Not implemented yet' };
};

const deleteProductFromList = async (listId, productId) => {
  return { status: 500, message: 'Not implemented yet' };
};

const deleteList = async (listId) => {
  return { status: 500, message: 'Not implemented yet' };
};

module.exports = {
  createProductList,
  getListsByUserId,
  addProductToList,
  updateProductFromList,
  deleteProductFromList,
  deleteList,
};
