const express = require('express');

const router = express.Router();
const supermarketController = require('../controllers/supermarket_controller');

router.put('/:id', supermarketController.updateSupermarket);
router.get('/:id', supermarketController.getSupermarketById);
router.get('/', supermarketController.getAllSupermarkets);
router.delete('/:id', supermarketController.deleteSupermarket);
router.put('/manager/:id', supermarketController.putSupermarketByManagerId);
// router.get('/:listId/products', supermarketController.getCheapestSupermarket);
module.exports = router;
