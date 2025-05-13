const express = require('express');
const router = express.Router();
const EncomendasController = require('../controllers/encomendasController');

router.get('/', EncomendasController.listar);
router.get('/:id', EncomendasController.buscar);
router.post('/', EncomendasController.criar);
router.put('/:id', EncomendasController.atualizar);
router.delete('/:id', EncomendasController.deletar);
router.get('/condominio/:id', EncomendasController.buscarPorCondominio);

module.exports = router;
