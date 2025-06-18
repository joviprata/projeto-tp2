const registerGerente = async (body) => {
  if (!body || Object.keys(body).length === 0) {
    return { status: 400, error: "Dados incompletos" };
  }
};
module.exports = {
  registerGerente,
};
