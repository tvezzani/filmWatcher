const express = require('express');
const moviesController = require('../controllers/movies');
const router = express.Router();


// Get movies
router.get('/', moviesController.getMovies);

// Get movie details
router.get('/details/:movieId', moviesController.getMovieDetails);

// Get suggested movies
router.get('/suggestions', moviesController.getSuggestions);

// Approve movie
router.post('/approve-movie/:movieId', moviesController.approveMovie);

// Approve movie
router.delete('/deny-movie/:movieId', moviesController.denyMovie);

// Add New Movie
router.post('/add-movie', moviesController.addMovie);

// Delete Movie
router.delete('/delete-movie/:movieId', moviesController.deleteMovie);

module.exports = router;