const registerGerente = async (body) => {
  if (!body || Object.keys(body).length === 0) {
    return { status: 400, error: "Dados incompletos" };
  }
  const { name, email, password, address } = body;
  if (!name || name.trim() === "") {
    return { status: 400, error: "Nome é obrigatório" };
  }
  if (!email || email.trim() === "") {
    return { status: 400, error: "Email é obrigatório" };
  }
  if (!password || password.trim() === "") {
    return { status: 400, error: "Senha é obrigatória" };
  }
  if (!address || address.trim() === "") {
    return { status: 400, error: "Endereço é obrigatório" };
  }
  return { status: 201, message: "Gerente registrado com sucesso" };
};

module.exports = {
  registerGerente,
};
