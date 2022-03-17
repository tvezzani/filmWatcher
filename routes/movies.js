const express = require('express');
const moviesController = require('../controllers/movies');
const router = express.Router();


// GET /movies
router.get('/', moviesController.getMovies );

// Approve movie
router.post('/approve-movie/:movieId', moviesController.approveMovie);

// Approve movie
router.delete('/deny-movie/:movieId', moviesController.denyMovie);

router.post('/add-movie', moviesController.addMovie);

module.exports = router;