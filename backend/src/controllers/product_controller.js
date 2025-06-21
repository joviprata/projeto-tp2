const produtoService = require('../services/product_service');

// Implementar registerProduct aqui

const registerProduct = async (req, res) => {
    try {
        const supermarketData = req.body;
        const result = await produtoService.registerProduct(supermarketData);
        res.status(result.status).json(result.data || { error: result.error});
    }
    catch (error) {
        console.error("Erro ao registrar produto:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const result = await produtoService.getAllProducts();
        res.status(result.status);
    } catch (error) {
        console.error("Erro ao obter produtos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await produtoService.getProductById(id);
        res.status(result.status);
    } catch (error) {
        console.error("Erro ao obter produto:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const result = await produtoService.updateProduct(id, productData);
        res.status(result.status);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await produtoService.deleteProduct(id);
        res.status(result.status);
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    registerProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};


