const prismaDatabase = require('../prismaClient');

const createProductList = async (userId, listName) => {
  try {
    const userExists = await prismaDatabase.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return { status: 404, error: 'Usuário não encontrado' };
    }
    if (userExists.role === 'GERENTE') {
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
  try {
    const userExists = await prismaDatabase.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return { status: 404, error: 'Usuário não encontrado' };
    }
    const productLists = await prismaDatabase.shoppingList.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return { status: 200, data: productLists };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor' };
  }
};

const addProductToList = async (listId, productId, quantity) => {
  try {
    const productExists = await prismaDatabase.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return { status: 404, error: 'Produto não encontrado' };
    }
    const listExists = await prismaDatabase.shoppingList.findUnique({
      where: { id: listId },
    });
    if (!listExists) {
      return { status: 404, error: 'Lista de compras não encontrada' };
    }
    const listItem = await prismaDatabase.listItem.upsert({
      where: {
        listId_productId: {
          listId,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity, // Incrementa a quantidade se o item já existe
        },
      },
      create: {
        listId,
        productId,
        quantity,
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

const updateProductFromList = async (listId, productId, updateData) => {
  try {
    const updatedItem = await prismaDatabase.listItem.update({
      where: {
        listId_productId: {
          listId: listId,
          productId: productId,
        },
      },
      data: updateData,
  });
    return { status: 200, data: updatedItem, message: 'Produto atualizado na lista com sucesso.' };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor' };
  }
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
