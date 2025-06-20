const prismaDatabase = require("../prismaClient");

const getAllSupermarkets = async () => {
  try {
    const supermarkets = await prismaDatabase.supermarket.findMany();
    return { status: 200, supermarkets };
  } catch (error) {
    console.error("Erro ao buscar supermercados:", error);
    return {
      status: 500,
      error: "Erro interno do servidor",
    };
  }
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
