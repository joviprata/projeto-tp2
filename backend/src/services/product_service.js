const prismaDatabase = require('../prismaClient');

const registerProduct = async (body) => {
  try {
    if (!body.name.trim()) {
      return { status: 400, error: 'Nome do produto não pode ser vazio' };
    }
    if (!body.name || !body.barCode || !body.variableDescription) {
      return { status: 400, error: 'Dados do produto incompletos' };
    }
    const existingProduct = await prismaDatabase.product.findFirst({
      where: {
        OR: [{ name: body.name }, { barCode: body.barCode }],
      },
    });

    if (existingProduct) {
      return { status: 400, error: 'Produto com este nome ou código de barras já existe' };
    }

    const newProduct = await prismaDatabase.product.create({
      data: body,
    });
    return { status: 200, data: newProduct };
  } catch {
    return { status: 500, error: 'Internal Server Error' };
  }
};

const updateProduct = async (id, productData) => {
  try {
    const existingProduct = await prismaDatabase.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingProduct) {
      return { status: 404, error: 'Produto não encontrado' };
    }
    if (!productData.name || !productData.barCode || !productData.variableDescription) {
      return {
        status: 400,
        error: 'Dados do produto inválidos ou incompletos',
      };
    }

    // Verifica se o array de campos é maior que 3
    const fields = Object.keys(productData);
    if (fields.length > 3) {
      return {
        status: 400,
        error: 'Dados do produto inválidos ou incompletos',
      };
    }

    // Atualiza o produto
    const updatedProduct = await prismaDatabase.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: productData.name,
        barCode: productData.barCode,
        variableDescription: productData.variableDescription,
      },
    });

    return { status: 200, data: updatedProduct };
  } catch (error) {
    if (error.code === 'P2002') {
      return {
        status: 400,
        error: 'Produto com nome ou código de barras já existente',
      };
    }
    return { status: 500, error: 'Internal Server Error' };
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await prismaDatabase.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!product) {
      return {
        status: 404,
        error: 'Produto não encontrado',
      };
    }

    await prismaDatabase.product.delete({
      where: { id: parseInt(id, 10) },
    });

    return {
      status: 200,
      data: { message: 'Produto excluído com sucesso' },
    };
  } catch {
    return {
      status: 500,
      data: { error: 'Internal Server Error' },
    };
  }
};

const getAllProducts = async () => {
  try {
    const products = await prismaDatabase.product.findMany();
    return { status: 200, data: products };
  } catch {
    return { status: 500, error: 'Internal Server Error' };
  }
};

const getProductById = async (id) => {
  try {
    const product = await prismaDatabase.product.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!product) {
      return { status: 404, error: 'Produto não encontrado' };
    }
    return { status: 200, data: product };
  } catch {
    return { status: 500, error: 'Internal Server Error' };
  }
};

const getAllProductsWithPriceRecords = async () => {
  try {
    const products = await prismaDatabase.product.findMany({
      include: {
        priceRecords: {
          include: {
            supermarket: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [
            {
              price: 'asc', // Ordenar por preço (mais barato primeiro)
            },
            {
              recordDate: 'desc', // Em caso de empate, mais recente primeiro
            },
          ],
        },
      },
    });

    // Pegar apenas os 3 registros de preço mais baratos por produto
    const productsWithCheapestPrices = products.map((product) => {
      // Pegar apenas os 3 primeiros registros (que já estão ordenados por preço)
      const cheapestPriceRecords = product.priceRecords.slice(0, 3);

      // Agrupar por supermercado para manter a estrutura esperada pelo frontend
      const pricesBySupermarket = {};

      cheapestPriceRecords.forEach((record) => {
        const supermarketId = record.supermarket.id;
        if (!pricesBySupermarket[supermarketId]) {
          pricesBySupermarket[supermarketId] = {
            supermarket: record.supermarket,
            priceRecords: [],
          };
        }
        pricesBySupermarket[supermarketId].priceRecords.push({
          id: record.id,
          price: record.price,
          recordDate: record.recordDate,
          available: record.available,
          verified: record.verified,
          user: record.user,
        });
      });

      return {
        ...product,
        priceRecords: undefined, // Remove o array original
        pricesBySupermarket: Object.values(pricesBySupermarket),
      };
    });

    return { status: 200, data: productsWithCheapestPrices };
  } catch (error) {
    return { status: 500, error: 'Internal Server Error' };
  }
};

module.exports = {
  registerProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getAllProductsWithPriceRecords,
};
