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