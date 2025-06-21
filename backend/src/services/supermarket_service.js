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
  try {
    const updatedSupermarket = await prismaDatabase.supermarket.update({
      where: { id: parseInt(id) },
      data: supermarketData,
    });
    return { status: 200, message: "Supermercado atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar supermercado:", error);
    if (error.code === "P2025") {
      return { status: 404, error: "Supermercado não encontrado" };
    }
  }
};
const getSupermarketById = async (id) => {
  try {
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { id: parseInt(id) },
    });
    if (!supermarket) {
      return { status: 404, error: "Supermercado não encontrado" };
    }
    const manager = await prismaDatabase.user.findUnique({
      where: { id: supermarket.managerId },
    });

    return {
      status: 200,
      name: supermarket.name,
      email: manager.email,
      address: supermarket.address,
      managerId: supermarket.managerId,
    };
  } catch (error) {
    console.error("Erro ao buscar supermercado:", error);
    return { status: 500, error: "Erro interno do servidor" };
  }
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
