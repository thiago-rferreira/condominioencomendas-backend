const express = require('express');
const router = express.Router();
const validacaoController = require('./../controllers/validacaoController');

router.post('/solicitar', validacaoController.solicitarCodigo);
router.post('/confirmar', validacaoController.confirmarCodigo);

module.exports = router;
