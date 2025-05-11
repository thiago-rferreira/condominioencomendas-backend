const express = require('express');
const evolutionController = require('../controllers/evolutionController');

const router = express.Router();

// Rota para enviar mensagem simples (texto)
router.post('/send-message', evolutionController.sendMessage);

// Rota para enviar mensagem com imagem (com URL da imagem)
router.post('/send-message-with-image', evolutionController.sendMessageWithImage);

// Rota para enviar QR Code
router.post('/send-qr-code', evolutionController.sendQRCode);

// Rota para avisar encomenda
router.post('/send-order-notification', evolutionController.sendOrderNotification);

// Rota de teste
router.get('/send-teste-notification', evolutionController.sendMassNotification);

module.exports = router;
