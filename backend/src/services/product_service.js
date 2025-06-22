// Aqui fica o registerProduto que será chamado no controller
const prismaDatabase = require("../prismaClient");

const registerProduct = async (body) => {
  try {
    if (!body.name.trim()) {
        return { status: 400, error: "Nome do produto não pode ser vazio" };
    }
    if (!body.name || !body.barCode || !body.variableDescription) {
      return { status: 400, error: "Dados do produto incompletos" };
    }
    const newProduct = await prismaDatabase.product.create({
      data: body,
    });
    return { status: 200, data: newProduct };
  } catch (error) {
    if (error.code === "P2002") {
      return { status: 400, error: "Produto já existe" };
    }
    return { status: 500, error: "Internal Server Error" };
  }
};

const updateProduct = async (id, productData) => {
  try {
    // Verifica se o produto existe
    const existingProduct = await prismaDatabase.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return { status: 404, error: "Produto não encontrado" };
    }

    // Verifica se os dados do produto estão completos
    if (
      !productData.name ||
      !productData.barCode ||
      !productData.variableDescription
    ) {
      return {
        status: 400,
        error: "Dados do produto inválidos ou incompletos",
      };
    }

    // Verifica se o array de campos é maior que 3
    const fields = Object.keys(productData);
    if (fields.length > 3) {
      return {
        status: 400,
        error: "Dados do produto inválidos ou incompletos",
      };
    }

    // Atualiza o produto
    const updatedProduct = await prismaDatabase.product.update({
      where: { id: parseInt(id) },
      data: {
        name: productData.name,
        barCode: productData.barCode,
        variableDescription: productData.variableDescription,
      },
    });

    return { status: 200, data: updatedProduct };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        status: 400,
        error: "Produto com nome ou código de barras já existente",
      };
    }
    console.error("Erro ao atualizar produto:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await prismaDatabase.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return {
        status: 404,
        error: "Produto não encontrado",
      };
    }

    await prismaDatabase.product.delete({
      where: { id: parseInt(id) },
    });

    return {
      status: 200,
      data: { message: "Produto excluído com sucesso" },
    };
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return {
      status: 500,
      data: { error: "Internal Server Error" },
    };
  }
};

const getAllProducts = async () => {
  try {
    const products = await prismaDatabase.product.findMany();
    return { status: 200, data: products };
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

const getProductById = async (id) => {
  try {
    const product = await prismaDatabase.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return { status: 404, error: "Produto não encontrado" };
    }
    return { status: 200, data: product };
  } catch (error) {
    console.error("Erro ao obter produto:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

module.exports = {
  registerProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};
