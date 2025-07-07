const prismaDatabase = require('../prismaClient');

const createProductList = async (userId, listName) => {
  try {
    const userExists = await prismaDatabase.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return { status: 404, error: 'Usuário não encontrado' };
    } else if (userExists.role === 'GERENTE') {
      return { status: 403, error: 'Apenas usuários clientes podem criar listas de compras' };
    }
    const newList = await prismaDatabase.shoppingList.create({
      data: {
        listName,
        userId,
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
  try {
    const listExists = await prismaDatabase.shoppingList.findUnique({
        where: { id: listId },
    });
    if (!listExists) {
        return { status: 404, error: 'Lista de compras não encontrada' };
    }
    const listItem = await prismaDatabase.listItem.upsert({
      where: {
        listId_productId: {
          listId: listId,
          productId: productId,
        },
      },
      update: {
        quantity: {
          increment: quantity, // Incrementa a quantidade se o item já existe
        },
      },
      create: {
        listId: listId,
        productId: productId,
        quantity: quantity,
      },
    });
    return {
      status: 201,
      data: listItem,
      message: 'Produto adicionado/atualizado na lista com sucesso.',
    };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor' };
  }
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
