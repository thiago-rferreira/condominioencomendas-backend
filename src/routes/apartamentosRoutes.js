const express = require('express');
const router = express.Router();
const controller = require('../controllers/apartamentosController');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

router.use(apiKeyMiddleware);

router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);
router.get('/condominio/:id', controller.buscarPorCondominio);
router.get('/torre/:id', controller.buscarPorTorre);

module.exports = router;
