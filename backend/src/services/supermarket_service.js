const prismaDatabase = require("../prismaClient");

const getAllSupermarkets = async () => {
  return { status: "500" };
};
const updateSupermarket = async (id, supermarketData) => {
  return { status: "500" };
};
const getSupermarketById = async (id) => {
  return { status: "500" };
};
const deleteSupermarket = async (id) => {
  return { status: "500" };
};

module.exports = {
  getAllSupermarkets,
  updateSupermarket,
  getSupermarketById,
  deleteSupermarket,
};
