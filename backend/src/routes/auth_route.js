const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/login', authController.login);
router.post('/register/manager', authController.registerGerente);
router.post('/register/user', authController.registerUser);

module.exports = router;
