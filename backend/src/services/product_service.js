// Aqui fica o registerProduto que será chamado no controller
const prismaDatabase = require("../prismaClient");

const registerProduct = async (body) => {
    try {
        const newProduct = await prismaDatabase.product.create({
            data: body,
        });
        return { status: 201, data: newProduct };
    } catch (error) {
        console.error("Erro ao registrar produto:", error);
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
    return { status: 500 };
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

