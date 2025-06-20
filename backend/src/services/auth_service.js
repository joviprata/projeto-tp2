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
  return { status: "500" };
};

module.exports = {
  login,
  registerGerente,
};
