const Movie = require('../models/movie');
const router = require('../routes/auth');


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
  if (Movie.findOne({title: movie.title})) {
    console.log("Movie already exists");
    return res.status(409).json({message: "movie already exists"})
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
  return res.status(201).json({message: "created movie"});
}


exports.deleteMovie = (req, res, next) => {
    // Get the movie id
    const movieId = req.params.movieId;

    // find the movie with that Id in the database
    Movie.findById(movieId)
        .then((movie) => {
            // If it doesn't exist then return a cant delete response
            if (!movie) {
                const error = new Error('Could not find movie to delete.');
                error.statusCode = 404;
                error.message = 'Could not find movie to delete';
                throw error;
            }
            // If it exists then delete it
            return Movie.findByIdAndRemove(movieId);
        })
        .then((result) => {
            console.log("Deleted movie id", result._id);

            // return successful response
            res.status(200).json({ message: "Movie deleted" });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
                error: err,
            });
        });
}