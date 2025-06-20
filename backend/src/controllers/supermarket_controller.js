const supermarketService = require("../services/supermarket_service");

const getAllSupermarkets = async (req, res) => {
  try {
    const results = await supermarketService.getAllSupermarkets();
    res
      .status(results.status)
      .json({ supermarkets: results.supermarkets || [] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateSupermarket = async (req, res) => {
  try {
    const { id } = req.params;
    const supermarketData = req.body;
    const results = await supermarketService.updateSupermarket(
      id,
      supermarketData
    );
    res.status(results.status);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSupermarketById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await supermarketService.getSupermarketById(id);
    res.status(results.status);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteSupermarket = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await supermarketService.deleteSupermarket(id);
    res.status(results.status);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getAllSupermarkets,
  updateSupermarket,
  getSupermarketById,
  deleteSupermarket,
};
