const express = require('express');

const router = express.Router(); // importa o Router do Express
const productController = require('../controllers/product_controller'); // importa o controller de produtos

router.post('/', productController.registerProduct); // Rota para registrar um produto

router.get('/', productController.getAllProducts); // Rota para obter todos os produtos

router.get('/:id', productController.getProductById); // Rota para obter um produto por ID

router.put('/:id', productController.updateProduct); // Rota para atualizar um produto por ID

router.delete('/:id', productController.deleteProduct); // Rota para deletar um produto por ID

module.exports = router; // exporta o router para ser usado no servidor principal
