const produtoService = require('../services/product_service');

const registerProduct = async (req, res) => {
  try {
    const productData = req.body;
    const result = await produtoService.registerProduct(productData);
    res.status(result.status).json(result.data || { error: result.error });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await produtoService.getAllProducts();
    res.status(result.status).json(result.data || { error: result.error });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await produtoService.getProductById(id);
    res.status(result.status).json(result.data || { error: result.error });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const result = await produtoService.updateProduct(id, productData);
    res.status(result.status).json(result.data || { error: result.error });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await produtoService.deleteProduct(id);
    res.status(result.status).json(result.data || { error: result.error });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProductsWithPriceRecords = async (req, res) => {
  try {
    const result = await produtoService.getAllProductsWithPriceRecords();
    res.status(result.status).json(result.data || { error: result.error });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsWithPriceRecords,
};
