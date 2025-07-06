const express = require('express');
const router = express.Router();
const productListsController = require('../controllers/product_lists_controller');

// rota para gerenciar listas de produtos
router.post('/', productListsController.createProductList); // Create a new product list
router.get('/user/:userId', productListsController.getListsByUserId); // Get all product lists for a user
router.post('/:listId/products', productListsController.addProductToList); // Add a product to a specific list
router.put('/:listId/products/:productId', productListsController.updateProductFromList); // Update a product in a specific list
router.delete('/:listId/products/:productId', productListsController.deleteProductFromList); // Delete a product from a specific list
router.delete('/:listId', productListsController.deleteList); // Delete a specific product list

module.exports = router;
