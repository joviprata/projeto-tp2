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

const putSupermarketByManagerId = async (Id, supermarketData) => {
  try {
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { managerId: parseInt(Id, 10) },
    });
    if (!supermarket) {
      return { status: 404, error: 'Supermercado não encontrado' };
    }
    await prismaDatabase.user.update({
      where: { id: parseInt(Id, 10) },
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

const getCheapestSupermarket = async (listId) => {
  try {
    const shoppingListItems = await prismaDatabase.listItem.findMany({
      where: { listId: parseInt(listId, 10) },
      select: { productId: true, quantity: true },
    });

    if (shoppingListItems.length === 0) {
      return { status: 404, error: 'Lista de compras não encontrada ou vazia' };
    }

    const productIds = shoppingListItems.map((item) => item.productId);
    const priceRecords = await prismaDatabase.priceRecord.findMany({
      where: { productId: { in: productIds }, available: true },
      include: { supermarket: true, product: true },
      orderBy: [{ productId: 'asc' }, { price: 'asc' }, { recordDate: 'desc' }],
    });

    // Agrupar produtos por supermercado, pegando apenas o menor preço de cada produto
    const supermarketsMap = new Map();

    shoppingListItems.forEach((item) => {
      const productPrices = priceRecords.filter((p) => p.productId === item.productId);

      // Agrupar por supermercado e pegar o menor preço de cada produto em cada supermercado
      const pricesBySupermarket = new Map();
      productPrices.forEach((record) => {
        const supermarketId = record.supermarket.id;
        if (
          !pricesBySupermarket.has(supermarketId) ||
          pricesBySupermarket.get(supermarketId).price > record.price
        ) {
          pricesBySupermarket.set(supermarketId, record);
        }
      });

      // Adicionar o melhor preço de cada supermercado ao mapa principal
      pricesBySupermarket.forEach((record) => {
        const { id } = record.supermarket;
        if (!supermarketsMap.has(id)) {
          supermarketsMap.set(id, {
            id,
            name: record.supermarket.name,
            address: record.supermarket.address,
            totalPrice: 0,
            products: [],
          });
        }
        const sm = supermarketsMap.get(id);

        // Verificar se já existe um produto com este ID para evitar duplicatas
        const existingProductIndex = sm.products.findIndex((p) => p.productId === record.productId);
        if (existingProductIndex === -1) {
          sm.products.push({
            productId: record.productId,
            productName: record.product.name,
            price: record.price,
            quantity: item.quantity,
            subtotal: item.quantity * record.price,
          });
          sm.totalPrice += item.quantity * record.price;
        }
      });
    });

    // Filtrar apenas supermercados que têm todos os produtos da lista
    const result = Array.from(supermarketsMap.values()).filter((sm) => {
      const ids = new Set(sm.products.map((p) => p.productId));
      return productIds.every((pid) => ids.has(pid));
    });

    result.sort((a, b) => a.totalPrice - b.totalPrice);

    if (result.length === 0) {
      return {
        status: 404,
        error: 'Nenhum supermercado encontrado com todos os produtos da lista',
      };
    }

    return { status: 200, supermarkets: result };
  } catch {
    return { status: 500, error: 'Erro interno do servidor' };
  }
};

module.exports = {
  getAllSupermarkets,
  updateSupermarket,
  getSupermarketById,
  deleteSupermarket,
  putSupermarketByManagerId,
  getCheapestSupermarket,
};
