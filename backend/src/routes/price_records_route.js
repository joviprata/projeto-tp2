const express = require('express');

const router = express.Router();
const priceRecordsController = require('../controllers/price_records_controller');

router.post('/', priceRecordsController.createPriceRecord);
router.get('/', priceRecordsController.getAllPriceRecords);
router.get('/:id', priceRecordsController.getPriceRecordById);
router.put('/:id', priceRecordsController.updatePriceRecord);
router.delete('/:id', priceRecordsController.deletePriceRecord);
router.get('/supermarket/:supermarketId', priceRecordsController.getPriceRecordsBySupermarketId);
router.get('/product/:productId', priceRecordsController.getPriceRecordsByProductId);

module.exports = router;
