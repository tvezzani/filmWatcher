const Movie = require('../models/movie');


/*************************************************
 * GET ALL MOVIES
 *************************************************/
exports.getMovies = (req, res, next) => {
    Movie.find({ isApproved: true })
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

/*************************************************
 * GET MOVIE DETAILS
 *************************************************/
exports.getMovieDetails = (req, res, next) => {
    const movieId = req.params.movieId;
    Movie.findById(movieId)
        .then((result) => {
            res.status(200)
                .json({ message: "Movie details retrieved", movie: result });
        })
        .catch((err) => {
            res.status(500).json({
                message: "An error occurred",
                error: err,
            });
        });
};

/*************************************************
 * APPROVE MOVIE
 *************************************************/
exports.approveMovie = (req, res, next) => {
    const movieId = req.params.movieId;

    //add validation if it is admin

    Movie.findById(movieId)
        .then((movie) => {
            movie.status === "pending" ? (movie.status = "approved") : "";
            return movie.save();
        })
        .then((result) => {
            res
                .status(201)
                .json({ message: "Movie added to Library!", movie: result });
        })
        .catch((err) => {
            res.status(500).json({
                message: "An error occurred",
                error: err,
            });
        });
};


/*************************************************
 * DENY MOVIE
 *************************************************/
exports.denyMovie = (req, res, next) => {
    const movieId = req.params.movieId;

    //add validation if it is admin
    Movie.findById(movieId)
        .then((movie) => {
            if (!movie) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            return Movie.findByIdAndRemove(movieId);
        })
        .then((result) => {
            console.log(result);
            res.status(200).json({ message: "Movie denied!" });
        })
        .catch((err) => {
            res.status(500).json({
                message: "An error occurred",
                error: err,
            });
        });
  };

/*************************************************
 * ADD NEW MOVIE
 *************************************************/
exports.addMovie = (req, res, next) => {
  // TODO: Check if admin
  // - true  -> set the isApproved to true
  // - false -> set the isApproved to false (default)

  // get the movie info out of the request
  const movie = {
    title: req.body.title,
    yearPublished: req.body.yearPublished,
    rating: req.body.rating,
    minutes: req.body.minutes,
    genre: req.body.genre,
    imageUrl: req.body.imageUrl,
  }

  // check to see if a movie with the title already exists in DB
  Movie.findOne({title: movie.title})
  .then(result => {
      if (result != null) {
          console.log("Movie already exists");
          res.status(409).json({message: "movie already exists"});
          return
      } 
      // create a new movie object based off our movie model
      const movieDBRef = new Movie(movie);
    
      // save the movie object to the database
      movieDBRef
        .save() 
        .then(result => {
          console.log("Created Movie")
        })
        .catch(err => {
          console.log(err);
        })
    
      // send a response
      res.status(201).json({message: "created movie"});
      return 
  })
}
