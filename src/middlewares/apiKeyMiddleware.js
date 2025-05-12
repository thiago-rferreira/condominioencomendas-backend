// src/middlewares/apiKeyMiddleware.js
require('dotenv').config();

const apiKeyMiddleware = (req, res, next) => {
  const chaveRecebida = req.headers['x-api-key'];

  if (!chaveRecebida || chaveRecebida !== process.env.API_KEY_BACK) {
    return res.status(403).json({ erro: 'Acesso negado: API Key inválida.' });
  }

  next();
};

module.exports = apiKeyMiddleware;
