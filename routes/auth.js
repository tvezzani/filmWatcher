const express = require('express');
const User = require('../models/user');
const { body } = require('express-validator')

const authController = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /auth/signup
router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject('Email address already exists.');
            }
        });
    })
    .normalizeEmail(),
    body("password").trim().isLength({ min: 5 })
], authController.signup);

router.post('/login', authController.login);

router.put('/logout', isAuth, function(req, res) {
    const token = jwt.sign({
            email: "",
            userId: ""
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1' }
    );
    return res.status(200).json({ token: token });
});

module.exports = router;