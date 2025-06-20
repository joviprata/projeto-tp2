const prismaDatabase = require("../prismaClient");

const login = async (loginData) => {
  return { status: "500" };
};
const registerGerente = async (gerenteData) => {
  if (
    Object.keys(gerenteData).length === 0 ||
    Object.keys(gerenteData).length > 4
  ) {
    return { status: "400", error: "Requisição inválida" };
  }
  if (
    !gerenteData ||
    !gerenteData.name ||
    !gerenteData.email ||
    !gerenteData.password ||
    !gerenteData.address
  ) {
    return { status: "400", error: "Requisição inválida" };
  }
  try {
    newGerente = await prismaDatabase.user.create({
      data: {
        name: gerenteData.name,
        email: gerenteData.email,
        password: gerenteData.password,
        role: "GERENTE",
      },
    });
    const newSupermarket = await prismaDatabase.supermarket.create({
      data: {
        name: gerenteData.name,
        address: gerenteData.address,
        manager: {
          connect: {
            id: newGerente.id,
          },
        },
      },
    });
    return {
      status: "201",
      message: "Gerente registrado com sucesso",
      supermarketId: newSupermarket.id,
    };
  } catch (error) {
    console.error("Erro ao registrar gerente:", error);
    return { status: "500", error: "Erro interno do servidor" };
  }
  return { status: "500" };
};

module.exports = {
  login,
  registerGerente,
};
