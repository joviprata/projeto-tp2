// Aqui fica o registerProduto que será chamado no controller
const prismaDatabase = require("../prismaClient");

const registerProduct = async (body) => {
    try {
        if (!body.name || !body.barCode || !body.variableDescription) {
            return { status: 400, error: "Dados do produto incompletos"};
        }
        const newProduct = await prismaDatabase.product.create({
            data: body,
        });
        return { status: 200, data: newProduct };
    } catch (error) {
        console.error("Erro ao registrar produto:", error);
        if (error.code === 'P2002') {
            return { status: 400, error: "Produto já existe" };
        }
        return { status: 500, error: "Internal Server Error" };
    }
};

const updateProduct = async (id, productData) => {
    return { status: 500 };
};

const deleteProduct = async (id) => {
    return { status: 500 };
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
    return { status: 500 };
};

module.exports = {
    registerProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById
};

