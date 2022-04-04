const express = require('express');
const moviesController = require('../controllers/movies');
const { body } = require('express-validator')
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// Get movies
router.get('/', moviesController.getMovies);

// Get movie details
router.get('/details/:movieId', moviesController.getMovieDetails);

// Get watchlist
router.get('/watchlist', isAuth, moviesController.getWatchlist);

// Add to watchlist
router.post('/watchlist/:movieId', isAuth, moviesController.addToWatchlist);

// Remove from watchlist
router.delete('/watchlist/:movieId', isAuth, moviesController.removeFromWatchlist);

// Clear watchlist
router.delete('/watchlist', isAuth, moviesController.clearWatchlist);

// Get FAVORITES
router.get('/favorites', isAuth, moviesController.getFavorites);

// Add to FAVORITES
router.post('/favorites/:movieId', isAuth, moviesController.addToFavorites);

// Remove from FAVORITES
router.delete('/favorites/:movieId', isAuth, moviesController.removeFromFavorites);

// Clear FAVORITES
router.delete('/favorites', isAuth, moviesController.clearFavorites);

// Get suggested movies
router.get('/suggestions', isAuth, //uncomment this once tokens are implemented
    moviesController.getSuggestions);

// Approve movie
router.post('/approve-movie/:movieId', isAuth, moviesController.approveMovie);

// Deny movie
router.delete('/deny-movie/:movieId', isAuth, moviesController.denyMovie);

// Add New Movie
router.post('/add-movie', isAuth, [
    body("title").trim().isLength({ min: 4 }),
    body("description").trim().isLength({ min: 5 }),
], moviesController.addMovie);

// Delete Movie
router.delete('/delete-movie/:movieId', isAuth, moviesController.deleteMovie);

// Update Movie
router.put('/update-movie/:movieId', isAuth, [
        body("title").trim().isLength({ min: 5 }),
        body("description").trim().isLength({ min: 5 }),
    ],
    moviesController.updateMovie);

module.exports = router;