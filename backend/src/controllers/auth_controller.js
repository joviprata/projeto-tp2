const authService = require("../services/auth_service");

async function registerGerente(req, res) {
  try {
    const body = req.body;
    const result = await authService.registerGerente(body);
    if (result.status === 400) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({ message: "Gerente registrado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
module.exports = {
  registerGerente,
};
