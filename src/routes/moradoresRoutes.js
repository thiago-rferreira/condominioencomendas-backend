const express = require('express');
const router = express.Router();
const controller = require('../controllers/moradoresController');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

router.use(apiKeyMiddleware);

router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);
router.get('/apartamento/:id', controller.listarPorApartamento);
router.post('/cadastro-whatsapp', controller.criarViaWhatsApp);
router.get('/condominio/:condominio_id', controller.buscarPorCondominio);
router.get('/whatsapp/:whatsapp', controller.buscarPorTelefone);


module.exports = router;
