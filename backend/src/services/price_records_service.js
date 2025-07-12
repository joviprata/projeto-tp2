const prismaDatabase = require('../prismaClient');

const createPriceRecord = async (data) => {
  const { price, productId, supermarketId, userId, available, verified } = data;

  if (!price || !productId || !supermarketId || !userId) {
    return { status: 400, error: 'Dados incompletos para criar o registro de preço.' };
  }

  try {
    const [product, supermarket, user] = await Promise.all([
      prismaDatabase.product.findUnique({ where: { id: productId } }),
      prismaDatabase.supermarket.findUnique({ where: { id: supermarketId } }),
      prismaDatabase.user.findUnique({ where: { id: userId } }),
    ]);

    if (!product) {
      return { status: 404, error: 'Produto não encontrado.' };
    }
    if (!supermarket) {
      return { status: 404, error: 'Supermercado não encontrado.' };
    }
    if (!user) {
      return { status: 404, error: 'Usuário não encontrado.' };
    }

    const newPriceRecord = await prismaDatabase.priceRecord.create({
      data: {
        price,
        productId,
        supermarketId,
        userId,
        available,
        verified,
      },
    });
    return { status: 201, data: newPriceRecord };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
  }
};

const getAllPriceRecords = async () => {
  try {
    const priceRecords = await prismaDatabase.priceRecord.findMany();
    return { status: 200, data: priceRecords };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
  }
};

const getPriceRecordById = async (id) => {
  try {
    const priceRecord = await prismaDatabase.priceRecord.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!priceRecord) {
      return { status: 404, error: 'Registro de preço não encontrado.' };
    }
    return { status: 200, data: priceRecord };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
  }
};

const updatePriceRecord = async (id, data) => {
  const { price, available, verified } = data;

  if (price === undefined && available === undefined && verified === undefined) {
    return { status: 400, error: 'Nenhum dado para atualizar.' };
  }

  try {
    const existingRecord = await prismaDatabase.priceRecord.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingRecord) {
      return { status: 404, error: 'Registro de preço não encontrado.' };
    }

    const updatedRecord = await prismaDatabase.priceRecord.update({
      where: { id: parseInt(id, 10) },
      data: {
        price,
        available,
        verified,
      },
    });
    return { status: 200, data: updatedRecord };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
  }
};

const deletePriceRecord = async (id) => {
  try {
    const existingRecord = await prismaDatabase.priceRecord.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingRecord) {
      return { status: 404, error: 'Registro de preço não encontrado.' };
    }

    await prismaDatabase.priceRecord.delete({
      where: { id: parseInt(id, 10) },
    });
    return { status: 204 };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
  }
};

const getPriceRecordsBySupermarketId = async (supermarketId) => {
  try {
    const supermarket = await prismaDatabase.supermarket.findUnique({
      where: { id: parseInt(supermarketId, 10) },
    });

    if (!supermarket) {
      return { status: 404, error: 'Supermercado não encontrado.' };
    }

    const priceRecords = await prismaDatabase.priceRecord.findMany({
      where: { supermarketId: parseInt(supermarketId, 10) },
    });
    return { status: 200, data: priceRecords };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
  }
};

const getPriceRecordsByProductId = async (productId) => {
  try {
    const product = await prismaDatabase.product.findUnique({
      where: { id: parseInt(productId, 10) },
    });

    if (!product) {
      return { status: 404, error: 'Produto não encontrado.' };
    }

    const priceRecords = await prismaDatabase.priceRecord.findMany({
      where: { productId: parseInt(productId, 10) },
    });
    return { status: 200, data: priceRecords };
  } catch (error) {
    return { status: 500, error: 'Erro interno do servidor.' };
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
