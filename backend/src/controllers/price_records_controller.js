const priceRecordsService = require('../services/price_records_service');

const createPriceRecord = async (req, res) => {
  try {
    const result = await priceRecordsService.createPriceRecord(req.body);
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllPriceRecords = async (req, res) => {
  try {
    const result = await priceRecordsService.getAllPriceRecords();
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPriceRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await priceRecordsService.getPriceRecordById(id);
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePriceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await priceRecordsService.updatePriceRecord(id, req.body);
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deletePriceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await priceRecordsService.deletePriceRecord(id);
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).send();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPriceRecordsBySupermarketId = async (req, res) => {
  try {
    const { supermarketId } = req.params;
    const result = await priceRecordsService.getPriceRecordsBySupermarketId(supermarketId);
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPriceRecordsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await priceRecordsService.getPriceRecordsByProductId(productId);
    if (result.status >= 400) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createPriceRecord,
  getAllPriceRecords,
  getPriceRecordById,
  updatePriceRecord,
  deletePriceRecord,
  getPriceRecordsBySupermarketId,
  getPriceRecordsByProductId,
};
