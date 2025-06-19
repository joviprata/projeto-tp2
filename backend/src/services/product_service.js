// Aqui fica o registerProduto que será chamado no controller

const registerProduct = async (body) => {
    if (!body || Object.keys(body).length === 0) {
        return { status : 400, error: "Dados imcompletos ou inválidos" };
    }
};

module.exports = {
    registerProduct
};

