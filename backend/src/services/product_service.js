// Aqui fica o registerProduto que será chamado no controller

const registerProduct = async (body) => {
    if (!body || Object.keys(body).length === 0) {
        return { status : 400, error: "Dados imcompletos ou inválidos" };
    }

    const { name, CodigoDeBarras, Data, Descricao } = body;

    if (!name || name.trim() === "") {
        return { status: 400, error: "O campo nome é obrigatório" };
    }

    if (!CodigoDeBarras || CodigoDeBarras.trim() === "") {
        return { status: 400, error: "O campo Código de Barras é obrigatório" };
    }

    if (!Data || Data.trim() === "") {
        return { status: 400, error: "O campo Data é obrigatório" };
    }

    if (!Descricao || Descricao.trim() === "") {
        return { status: 400, error: "O campo Descrição é obrigatório" };
    }
};

module.exports = {
    registerProduct
};

