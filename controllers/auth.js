const {validationResult} = require('express-validator');

const User = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

/*************************************************
 * SIGN UP
 *************************************************/
exports.signup = (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt
      .hash(password, 12)
      .then(hashedPw => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPw,
        });
        return user.save();
      })
      .then(result => {
          res.status(201).json({message: 'User Created', userId: result._id});
      })
      .catch((err) => {
        res.status(500).json({
            message: "An error occurred",
            error: err,
          });
      });
}

/*************************************************
 * LOGIN
 *************************************************/
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({email: email})
  .then(user => {
    if (!user) {
      res.status(401).json({
        message: 'A user with this email could not be found.',
        error: err
      });
    }
    loadedUser = user;
    return bcrypt.compare(password, user.password);
  })
  .then(isEqual => {
    if (!isEqual) {
      res.status(401).json({
        message: 'Incorrect password.',
        error: err
      });
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  })
  .catch(err => {
    res.status(500).json({
      message: 'An error has occurred.',
      error: err
    });
  })
}