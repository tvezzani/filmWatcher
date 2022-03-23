const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// /auth/signup
router.post('/signup', authController.signup);

router.post('/login', authController.login);

module.exports = router;