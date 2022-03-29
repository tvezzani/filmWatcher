const express = require('express');
const moviesController = require('../controllers/movies');

const isAuth = require('../middleware/is-auth');

const router = express.Router();


// Get movies
router.get('/', moviesController.getMovies);

// Get movie details
router.get('/details/:movieId', moviesController.getMovieDetails);

// Get watchlist
router.get('/watchlist', //isAuth,
    moviesController.getWatchlist);

// Get suggested movies
router.get('/suggestions', //isAuth, //uncomment this once tokens are implemented
    moviesController.getSuggestions);

// Approve movie
router.post('/approve-movie/:movieId', moviesController.approveMovie);

// Approve movie
router.delete('/deny-movie/:movieId', moviesController.denyMovie);

// Add New Movie
router.post('/add-movie', moviesController.addMovie);

// Delete Movie
router.delete('/delete-movie/:movieId', moviesController.deleteMovie);

// Update Movie
router.put('/update-movie/:movieId', moviesController.updateMovie);

module.exports = router;