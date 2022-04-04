const Movie = require('../models/movie');
const User = require('../models/user')
const router = require('../routes/auth');
const { validationResult } = require('express-validator');


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
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
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
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};

/*************************************************
 * GET WATCH LIST
 *************************************************/
exports.getWatchlist = (req, res, next) => {
    // const userId = '62427aaac8a83109e0fe44bf'
    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error('Did not find user');
                error.statusCode = 404;
                throw error;
            } else if (user.watchList.length == 0) {
                const error = new Error('You do not have any movies in your watchlist');
                error.statusCode = 404;
                throw error;
            } else {
                let movieArr = [];
                //console.log(user.watchList[0]);
                Movie.find({ _id: { $in: user.watchList } })
                    .then((movies) => {
                        res.status(200)
                            .json({ message: "Watch list retrieved", movies: movies });
                    })
            }
        })
        .catch((err) => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};

/*************************************************
 * ADD MOVIE TO WATCHLIST
 *************************************************/
 exports.addToWatchlist = (req, res, next) => {
    const errors = validationResult(req);
    const movieId = req.params.movieId;
    if(!errors.isEmpty()){
        const error = new Error('Invalid input data!');
        error.statusCode = 422;
        throw error;
    }
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error("Didn't find user with given id");
                err.statusCode = 401;
                throw err;
            }

            //Includes a duplicate id
            if (user.watchList.includes(movieId))
            {
                const err = new Error("This movie is already included in your watchlist");
                err.statusCode = 409;
                throw err;
            }

            user.watchList.push(movieId);
            user.save()
            //add id to watchlist
            .then((user) => {
                res.status(200)
                    .json({ message: `Updated watchlist with ${movieId}`});
            })
        })
        //error checking
        .catch(err => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};

/*************************************************
 * REMOVE FROM WATCHLIST
 *************************************************/
 exports.removeFromWatchlist = (req, res, next) => {
    const errors = validationResult(req);
    const movieId = req.params.movieId;
    if(!errors.isEmpty()){
        const error = new Error('Invalid input data!');
        error.statusCode = 422;
        throw error;
    }
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error("Didn't find user with given id");
                err.statusCode = 401;
                throw err;
            }

            //Includes a duplicate id
            if (!user.watchList.includes(movieId))
            {
                const err = new Error("This movie is not in your watchlist");
                err.statusCode = 409;
                throw err;
            }

            const pos = user.watchList.findIndex(id => id.toString() === movieId);
            user.watchList.splice(pos, 1);
            user.save()
            //add id to watchlist
            .then((user) => {
                // console.log(user); 
                res.status(200)
                    .json({ message: `Removed ${movieId} from watchlist`});
            })
        })
        //error checking
        .catch(err => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};
/*************************************************
 * CLEAR WATCHLIST
 *************************************************/
 exports.clearWatchlist = (req, res, next) => {
    const movieId = req.params.movieId;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error("Didn't find user with given id");
                err.statusCode = 401;
                throw err;
            }
            user.watchList = [];
            user.save()
            //add id to watchlist
            .then((user) => {
                res.status(200)
                    .json({ message: `Cleared watchlist`});
            })
        })
        //error checking
        .catch(err => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};

/*************************************************
 * GET SUGGESTED
 *************************************************/
exports.getSuggestions = (req, res, next) => {
    // const userId = '62427aaac8a83109e0fe44bf'

    //add validation if it is admin
    User.findById(req.userId) //this is going to be req.userId
        .then(user => {
            if (!user) {
                const error = new Error('Did not find user');
                error.statusCode = 404;
                throw error;
            } else if (!user.isAdmin) {
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
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};


/*************************************************
 * APPROVE MOVIE
 *************************************************/
exports.approveMovie = (req, res, next) => {
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     const error = new Error('Authorization failed!');
    //     error.statusCode = 403;
    //     throw error;
    // }

    const movieId = req.params.movieId;

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
            next(err);
        });
};


/*************************************************
 * DENY MOVIE
 *************************************************/
exports.denyMovie = (req, res, next) => {
    const movieId = req.params.movieId;

    //add validation if it is admin
    User.findById(req.userId) //this is going to be req.userId
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
            next(err);
        });
};

/*************************************************
 * ADD NEW MOVIE
 *************************************************/
exports.addMovie = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid input data!');
        error.statusCode = 422;
        throw error;
    }
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error("Didn't find user with given id");
                err.statusCode = 401;
                throw err;
            }

            // get the movie info from request
            const movie = {
                title: req.body.title,
                yearPublished: req.body.yearPublished,
                rating: req.body.rating,
                minutes: req.body.minutes,
                genre: req.body.genre,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                starRating: req.body.starRating,
                isApproved: user.isAdmin
            }

            // check to see if a movie with the title already exists in DB
            Movie.findOne({ title: movie.title })
                .then(result => {
                    if (result != null) {
                        const err = new Error("Movie already exists")
                        err.statusCode = 409;
                        next(err);
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
                            err.message = "Error saving new movie to DB";
                            err.statusCode = 400;
                            next(err);
                        })

                    // send a response
                    res.status(201).json({ message: "created movie" });
                    return
                })
                .catch(err => {
                    err.statusCode = err.statusCode ? err.statusCode : 500;
                    next(err);
                })
        })
        .catch(err => {
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};


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
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};

/*************************************************
 * UPDATE MOVIE
 *************************************************/
exports.updateMovie = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid input data!');
        error.statusCode = 422;
        throw error;
    }
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
        description: req.body.description,
        starRating: req.body.starRating
    };

    // Find the movie by the ID and then update it with the new info
    Movie.findByIdAndUpdate(movieId, updatedMovie)
        .then(oldMovie => {
            res.status(201).json({ message: "Successfully updated movie" });
        })
        .catch(err => {
            err.message = "Error updating movie";
            err.statusCode = err.statusCode ? err.statusCode : 500;
            next(err);
        });
};