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
          res.status(201).json({message: 'User Created'});
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
  const _email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({email: _email})
  .then(user => {
    if (!user) {
      const error = new Error("There is no email by this name.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    return bcrypt.compare(password, user.password);
  })
  .then(isEqual => {
    if (!isEqual) {
      const error = new Error("Incorrect password.");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token });
  })
  .catch(err => {
    next(err);
  })
}