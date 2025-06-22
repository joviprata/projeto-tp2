const prismaDatabase = require("../prismaClient");

const getAllSupermarkets = async () => {
  try {
    const supermarkets = await prismaDatabase.supermarket.findMany();
    return { status: 200, supermarkets };
  } catch (error) {
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
    return { status: 500, error: "Erro interno do servidor" };
  }
};
const deleteSupermarket = async (id) => {
  try {
    const deletedSupermarket = await prismaDatabase.supermarket.delete({
      where: { id: parseInt(id) },
    });

    await prismaDatabase.user.delete({
      where: { id: deletedSupermarket.managerId },
    });

    return { status: 204 };
  } catch (error) {
    if (error.code === "P2025") {
      return { status: 404, error: "Supermercado não encontrado" };
    }

    return { status: 500, error: "Erro interno do servidor" };
  }
};

module.exports = {
  getAllSupermarkets,
  updateSupermarket,
  getSupermarketById,
  deleteSupermarket,
};
