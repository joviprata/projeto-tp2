const supermarketService = require('../services/supermarket_service');

const getAllSupermarkets = async (req, res) => {
  try {
    const results = await supermarketService.getAllSupermarkets();
    return res.status(results.status).json({ supermarkets: results.supermarkets || [] });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateSupermarket = async (req, res) => {
  if (Object.keys(req.body).length === 0 || Object.keys(req.body).length > 4) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  if (!req.body) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  try {
    const { id } = req.params;
    const supermarketData = req.body;
    const results = await supermarketService.updateSupermarket(id, supermarketData);
    if (results.status === 404) {
      return res.status(404).json({ error: 'Supermercado não encontrado' });
    }
    return res.status(200).json({ message: results.message });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

const putSupermarketByManagerId = async (req, res) => {
  if (Object.keys(req.body).length === 0 || Object.keys(req.body).length > 4) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  if (!req.body) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  try {
    const { id } = req.params;
    const supermarketData = req.body;
    const results = await supermarketService.putSupermarketByManagerId(id, supermarketData);
    if (results.status === 404) {
      return res.status(404).json({ error: 'Supermercado não encontrado' });
    }
    if (results.status === 200) {
      return res.status(200).json({ message: results.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  } catch (e) {
    return res.status(500).json({ error: 'error' });
  }
};

const getSupermarketById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await supermarketService.getSupermarketById(id);
    if (results.status === 404) {
      return res.status(404).json({ error: 'Supermercado não encontrado' });
    }
    return res.status(200).json({
      name: results.name,
      email: results.email,
      address: results.address,
      managerId: results.managerId,
    });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteSupermarket = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await supermarketService.deleteSupermarket(id);
    if (results.status === 404) {
      return res.status(404).json({ error: 'Supermercado não encontrado' });
    }
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCheapestSupermarket = async (req, res) => {
  try {
    const { listId } = req.params;
    const results = await supermarketService.getCheapestSupermarket(listId);
    if (results.status === 200) {
      return res.status(200).json({ supermarkets: results.supermarkets });
    }
    if (results.status === 404) {
      return res.status(404).json({ error: results.error });
    }
    return res.status(500).json({ error: 'Service error' });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSupermarketByManagerId = async (req, res) => {
  try {
    const { managerId } = req.params;
    const results = await supermarketService.getSupermarketByManagerId(managerId);
    if (results.status === 200) {
      return res.status(200).json(results.supermarket);
    }
    return res.status(results.status).json({ error: results.error });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllSupermarkets,
  updateSupermarket,
  putSupermarketByManagerId,
  getSupermarketById,
  deleteSupermarket,
  getCheapestSupermarket,
  getSupermarketByManagerId,
};
