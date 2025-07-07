const productListsService = require('../services/product_lists_service');

const createProductList = async (req, res) => {
  const { userId, listName } = req.body;
  if (listName === '') {
    return res
      .status(400)
      .json({ error: 'O nome da lista não pode ser vazio' });
  } else if (!userId || !listName) {
    return res
      .status(400)
      .json({ error: 'ID do usuário e nome da lista são obrigatórios' });
  }
  try {
    const result = await productListsService.createProductList(userId, listName);
    if (result.status === 404) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

const getListsByUserId = async (req, res) => {
  return { status: 500, message: 'Not implemented yet' };
};

const addProductToList = async (req, res) => {
    // const { listId } = req.params;
    // const { productId, quantity } = req.body;
    // try {
    //     const result = await productListsService.addProductToList(parseInt(listId, 10), productId, quantity);
    //     return res.status(result.status).json({ data: result.data, message: result.message });
    // } catch (error) {
    //     return res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
    // }
};

const updateProductFromList = async (req, res) => {
  return { status: 500, message: 'Not implemented yet' };
};

const deleteProductFromList = async (req, res) => {
  return { status: 500, message: 'Not implemented yet' };
};

const deleteList = async (req, res) => {
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
