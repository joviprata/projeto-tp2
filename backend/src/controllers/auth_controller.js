const authService = require("../services/auth_service");

const login = async (req, res) => {
  try {
    const loginData = req.body;
    const results = await authService.login(loginData);
    res.status(results.status);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const registerGerente = async (req, res) => {
  try {
    const gerenteData = req.body;
    const results = await authService.registerGerente(gerenteData);
    if (results.status === "400") {
      return res.status(400).json({ error: results.error });
    }
    if (results.status === "201") {
      return res.status(201).json({
        message: results.message,
        supermarketId: results.supermarketId,
      });
    }
    res.status(results.status);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  login,
  registerGerente,
};
