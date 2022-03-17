
const User = require('../models/user');

const bcrypt = require('bcryptjs');

/*************************************************
 * SIGN UP
 *************************************************/
exports.signup = (req,res,next) =>{
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     const error = new Error('Validation failed.');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
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