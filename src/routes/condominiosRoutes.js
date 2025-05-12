// src/routes/condominiosRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/condominiosController');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

// Rota protegida por API KEY
router.use(apiKeyMiddleware);

router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

module.exports = router;
