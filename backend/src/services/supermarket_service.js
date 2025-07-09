const prismaDatabase = require('../prismaClient');

const getAllSupermarkets = async () => {
  try {
    const supermarkets = await prismaDatabase.supermarket.findMany();
    return { status: 200, supermarkets };
  } catch {
    return {
      status: 500,
      error: 'Erro interno do servidor',
    };
  }
};
const updateSupermarket = async (id, supermarketData) => {
  try {
    await prismaDatabase.supermarket.update({
      where: { id: parseInt(id, 10) },
      data: supermarketData,
    });
    return { status: 200, message: 'Supermercado atualizado com sucesso' };
  } catch (error) {
    if (error.code === 'P2025') {
      return { status: 404, error: 'Supermercado não encontrado' };
    }
    return { status: 501, error: 'Erro interno do servidor' };
  }
};
const getSupermarketById = async (id) => {
  try {
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!supermarket) {
      return { status: 404, error: 'Supermercado não encontrado' };
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
  } catch {
    return { status: 500, error: 'Erro interno do servidor' };
  }
};
const deleteSupermarket = async (id) => {
  try {
    const deletedSupermarket = await prismaDatabase.supermarket.delete({
      where: { id: parseInt(id, 10) },
    });

    await prismaDatabase.user.delete({
      where: { id: deletedSupermarket.managerId },
    });

    return { status: 204 };
  } catch (error) {
    if (error.code === 'P2025') {
      return { status: 404, error: 'Supermercado não encontrado' };
    }

    return { status: 500, error: 'Erro interno do servidor' };
  }
};

const putSupermarketByManagerId = async (id, supermarketData) => {
  try {
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { managerId: parseInt(id, 10) },
    });
    if (!supermarket) {
      return { status: 404, error: 'Supermercado não encontrado' };
    }
    await prismaDatabase.user.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: supermarketData.name,
        email: supermarketData.email,
        password: supermarketData.password,
      },
    });
    await prismaDatabase.supermarket.update({
      where: { id: parseInt(supermarket.id, 10) },
      data: {
        name: supermarketData.name,
        address: supermarketData.address,
      },
    });
    return { status: 200, message: 'Supermercado atualizado com sucesso' };
  } catch (error) {
    if (error.code === 'P2025') {
      return { status: 404, error: 'Supermercado não encontrado' };
    }
    return { status: 500, error: 'Error' };
  }
};

module.exports = {
  getAllSupermarkets,
  updateSupermarket,
  getSupermarketById,
  deleteSupermarket,
  putSupermarketByManagerId,
};
