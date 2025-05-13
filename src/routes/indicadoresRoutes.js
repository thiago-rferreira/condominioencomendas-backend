// routes/indicadoresRoutes.js
const express = require('express');
const router = express.Router();
const IndicadoresController = require('../controllers/indicadoresController');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware'); // Se necessário

// Aplica middleware de API Key (se necessário)
router.use(apiKeyMiddleware);

// Rota para buscar os indicadores do condomínio
router.get('/:condominioId', IndicadoresController.obterIndicadores);

module.exports = router;
