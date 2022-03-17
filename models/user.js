const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  watchList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
      }
    ],
  favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
   ]
});

module.exports = mongoose.model('User', userSchema);