const prismaDatabase = require("../prismaClient");

const login = async (loginData) => {
  try {
    const { email, password } = loginData;
    const user = await prismaDatabase.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { status: "401", error: "Email inválido" };
    }
    if (user.password !== password) {
      return { status: "401", error: "Senha inválida" };
    }
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return { status: "500", error: "Erro interno do servidor" };
  }
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
    existingGerente = await prismaDatabase.user.findUnique({
      where: {
        email: gerenteData.email,
      },
    });
    if (existingGerente) {
      return { status: "409", error: "Email já em uso" };
    }
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
