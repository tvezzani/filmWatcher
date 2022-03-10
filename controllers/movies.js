const Movie = require('../models/movie');


/*************************************************
 * GET ALL MOVIES
 *************************************************/
exports.getMovies = (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json({
        message: "Movies fetched successfully!",
        movies: movies,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error occurred",
        error: err,
      });
    });
};