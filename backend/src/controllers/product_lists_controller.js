const productListsService = require('../services/product_lists_service');

const createProductList = async (req, res) => {
  const { userId, listName } = req.body;
  if (!userId || !listName) {
    return res.status(400).json({ error: 'ID do usuário e nome da lista são obrigatórios' });
  }
  try {
    const result = await productListsService.createProductList(userId, listName);
    return res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

const getListsByUserId = async (req, res) => {
  return { status: 500, message: 'Not implemented yet' };
};

const addProductToList = async (req, res) => {
  return { status: 500, message: 'Not implemented yet' };
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
