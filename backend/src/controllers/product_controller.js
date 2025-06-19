const produtoService = require('../services/product_service');

// Implementar registerProduct aqui

async function registerProduct(req, res) {
    try {
        const body = req.body;
        const result = await produtoService.registerProduct(body);
        if (result.status === 400) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(201).json({message: "Produto registrado com sucesso"});
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
}

module.exports = {
    registerProduct
};


