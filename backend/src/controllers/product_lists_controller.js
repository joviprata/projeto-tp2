const productListsService = require('../services/product_lists_service');

const createProductList = async (req, res) => {
  const { userId, listName } = req.body;
  if (listName === '') {
    return res.status(400).json({ error: 'O nome da lista não pode ser vazio' });
  }
  if (!userId || !listName) {
    return res.status(400).json({ error: 'ID do usuário e nome da lista são obrigatórios' });
  }
  try {
    const result = await productListsService.createProductList(userId, listName);
    if (result.status === 404) {
      return res.status(404).json({ error: result.error });
    }
    if (result.status === 403) {
      return res.status(403).json({ error: result.error });
    }
    return res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

const getListsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await productListsService.getListsByUserId(parseInt(userId, 10));
    if (result.status === 404) {
      return res.status(404).json({ error: result.error });
    }
    return res.status(result.status).json({ data: result.data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
  }
};

const addProductToList = async (req, res) => {
  const { listId } = req.params;
  const { productId, quantity } = req.body;
  try {
    const result = await productListsService.addProductToList(
      parseInt(listId, 10),
      productId,
      quantity,
    );
    if (result.status === 404) {
      return res.status(404).json({ error: result.error });
    }
    return res.status(result.status).json({ data: result.data, message: result.message });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
  }
};

const updateProductFromList = async (req, res) => {
  const { listId, productId } = req.params;
  const updateData = req.body;
  try {
    const result = await productListsService.updateProductFromList(
      parseInt(listId, 10),
      parseInt(productId, 10),
      updateData,
    );
    if (result.status === 200) {
      return res.status(200).json({ data: result.data, message: result.message });
    }
    if (result.status === 400) {
      return res.status(400).json({ error: result.error });
    }
    if (result.status === 404) {
      return res.status(404).json({ error: result.error });
    }
    return res
      .status(result.status || 500)
      .json({ error: result.error || 'Erro interno do servidor' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteProductFromList = async (req, res) => {
  return { status: 500, message: 'Not implemented yet' };
};

const deleteList = async (req, res) => {
  const { listId } = req.params;
  try {
    const result = await productListsService.deleteList(parseInt(listId, 10));
    if (result.status === 204) {
      return res.status(204).send();
    }
    else if (result.status === 404) {
      return res.status(404).json({ error: result.error });
    }
    return res
      .status(result.status || 500)
      .json({ error: result.error || 'Erro interno do servidor' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


module.exports = {
  createProductList,
  getListsByUserId,
  addProductToList,
  updateProductFromList,
  deleteProductFromList,
  deleteList,
};
