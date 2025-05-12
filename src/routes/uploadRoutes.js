// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota para upload de imagem com compressão estilo WhatsApp e upload no Supabase
router.post('/', upload.single('imagem'), uploadController.uploadImagem);

module.exports = router;
