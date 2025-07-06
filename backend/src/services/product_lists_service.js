const prismaDatabase = require('../prismaClient');

const createProductList = async (userId, listName) => {
  try {
    if (!userId || !listName) {
      return { status: 400, error: 'ID do usuário e nome da lista são obrigatórios' };
    }
    const newList = await prismaDatabase.shoppingList.create({
      data: {
        listName,
        userId
      },
    });
    return { status: 201, data: newList, message: 'Lista de compras criada com sucesso' };
  } catch (error) {
    return { status: 500, error: 'Internal Server Error' };
  }
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
