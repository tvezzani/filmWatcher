const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: { 
      type: String, 
      required: true 
    },
  yearPublished: { 
      type: String, 
      required: true 
    },
  rating: { 
      type: String, 
      required: true 
    },
  minutes: { 
      type: String, 
      required: true 
    },
  genre: { 
      type: String, 
      required: true },
  imageUrl: { 
      type: String, 
      required: false 
    },
    status:{
      type:String,
      required: true
    }
});

module.exports = mongoose.model('Movie', movieSchema);