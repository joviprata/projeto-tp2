const authService = require('../services/auth_service');

const login = async (req, res) => {
  if (Object.keys(req.body).length === 0 || Object.keys(req.body).length > 2) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  try {
    const loginData = req.body;
    const results = await authService.login(loginData);
    if (results.status === 401) {
      return res.status(401).json({ error: results.error });
    }
    if (results.status === 200) {
      return res.status(200).json({
        message: results.message,
        userId: results.userId,
        role: results.role,
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const registerGerente = async (req, res) => {
  if (Object.keys(req.body).length === 0 || Object.keys(req.body).length > 4) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  if (!req.body || !req.body.name || !req.body.email || !req.body.password || !req.body.address) {
    return res.status(400).json({ error: 'Requisição inválida' });
  }
  try {
    const gerenteData = req.body;
    const results = await authService.registerGerente(gerenteData);
    if (results.status === 201) {
      return res.status(201).json({
        message: results.message,
        supermarketId: results.supermarketId,
      });
    }
    if (results.status === 409) {
      return res.status(409).json({ error: results.error });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const results = await authService.registerUser(userData);
    if (results.status === 400) {
      return res.status(400).json({ error: results.error });
    }
    res.status(results.status);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  login,
  registerGerente,
  registerUser,
};
