const express = require('express');
const moviesController = require('../controllers/movies');
const router = express.Router();


// GET /movies
router.get('/', moviesController.getMovies);

// GET movie details
router.get('/details/:movieId', moviesController.getMovieDetails);

// Approve movie
router.post('/approve-movie/:movieId', moviesController.approveMovie);

// Approve movie
router.delete('/deny-movie/:movieId', moviesController.denyMovie);

// Add New Movie
router.post('/add-movie', moviesController.addMovie);

// Delete Movie
router.delete('/delete-movie/:movieId', moviesController.deleteMovie);

module.exports = router;