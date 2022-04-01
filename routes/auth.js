const express = require('express');
const User = require('../models/user');
const {body} = require('express-validator')

const authController = require('../controllers/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

// /auth/signup
router.post('/signup',[
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

router.put('/logout', function (req, res) {
  const authHeader = req.headers["Authorization"];
  jwt.sign(authHeader, "", { expiresIn: '1ms' }, (logout, err) => {
    if (logout) {
      res.status(201).json({message: 'You have been logged out'});
    }
    else {
      const error = new Error('Error logging out.');
      error.statusCode = 400;
      throw error;
    }
  })
  .catch((err) => {
    err.statusCode = err.statusCode ? err.statusCode : 500;next(err);
  });

});

module.exports = router;