const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/login', controller.login);
router.get('/me', verifyToken, controller.me); // 🧑‍💻 Rota protegida

module.exports = router;
