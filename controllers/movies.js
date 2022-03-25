const Movie = require('../models/movie');
const User = require('../models/user')
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
            if (result.isApproved == true) {
                res.status(200)
                    .json({ message: "Movie details retrieved", movie: result });
            } else {
                const error = new Error('This movie has not been approved ');
                error.statusCode = 403;
                throw error;
            }
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(err.statusCode).json({
                message: err.message,
                error: err
            });
        });
};

/*************************************************
 * GET SUGGESTED
 *************************************************/
exports.getSuggestions = (req, res, next) => {
    const userId = '6232d0a61f48263258a321e5'
        //add validation if it is admin
    User.findById(userId) //this is going to be req.userId
        .then(user => {
            if (!user.isAdmin) {
                const error = new Error('Not Authenticated as Admin');
                error.statusCode = 403;
                throw error;
            }
            Movie.find({ isApproved: false })
                .then((movies) => {
                    res.status(200).json({
                        message: "Movies fetched successfully!",
                        movies: movies,
                    });
                })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(err.statusCode).json({
                message: err.message,
                error: err
            });
        });
};


/*************************************************
 * APPROVE MOVIE
 *************************************************/
exports.approveMovie = (req, res, next) => {
    const movieId = req.params.movieId;
    const userId = '6232d0a61f48263258a321e5'
        //add validation if it is admin
    User.findById(userId) //this is going to be req.userId
        .then(user => {
            if (!user.isAdmin) {
                const error = new Error('Not Authenticated as Admin');
                error.statusCode = 403;
                throw error;
            }
            Movie.findById(movieId)
                .then((movie) => {
                    movie.isApproved = movie.isApproved ? movie.isApproved : !movie.isApproved;
                    return movie.save();
                })
                .then((result) => {
                    res.status(201).json({ message: "Movie added to Library!", movie: result });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: "An error occurred",
                        error: err,
                    });
                });
        }).catch(err => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            res.status(err.statusCode).json({
                message: err.message,
                error: err,
            });
        });
};


/*************************************************
 * DENY MOVIE
 *************************************************/
exports.denyMovie = (req, res, next) => {
    const movieId = req.params.movieId;

    const userId = '6232d0a61f48263258a321e5'
        //add validation if it is admin
    User.findById(userId) //this is going to be req.userId
        .then(user => {
            if (!user.isAdmin) {
                const error = new Error('Not Authenticated as Admin');
                error.statusCode = 403;
                throw error;
            }
            Movie.findById(movieId)
                .then((movie) => {
                    if (!movie) {
                        const error = new Error('Could not find movie.');
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
                        message: err.message,
                        error: err,
                    });
                });
        }).catch(err => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            res.status(err.statusCode).json({
                message: err.message,
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
        description: req.body.description
    }

    // check to see if a movie with the title already exists in DB
    Movie.findOne({ title: movie.title })
        .then(result => {
            if (result != null) {
                console.log("Movie already exists");
                res.status(409).json({ message: "movie already exists" });
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
            res.status(201).json({ message: "created movie" });
            return
        })
}


/*************************************************
 * DELETE MOVIE
 *************************************************/
exports.deleteMovie = (req, res, next) => {
    // Get the movie id
    const movieId = req.params.movieId;

    // find the movie with matching Id in DB
    Movie.findById(movieId)
        .then((movie) => {
            // If it doesn't exist then return a cant delete error
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
            console.log("Deleted movie:", result.title);

            // return successful response
            res.status(200).json({ message: "Movie deleted" });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
                error: err,
            });
        });
};

/*************************************************
 * UPDATE MOVIE
 *************************************************/
exports.updateMovie = (req, res, next) => {
  // Get the movieId from url params
  const movieId = req.params.movieId;

  // create a movie object with the new information
  const updatedMovie = {
    title: req.body.title,
    yearPublished: req.body.yearPublished,
    rating: req.body.rating,
    minutes: req.body.minutes,
    genre: req.body.genre,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  };

  // Find the movie by the ID and then update it with the new info
  Movie.findByIdAndUpdate(movieId, updatedMovie)
    .then(oldMovie => {
      res.status(201).json({message: "Successfully updated movie"});
    })
    .catch(err => {
      res.status(500).json({
        message: "Error updating movie", 
        error: err
      });
    });
};