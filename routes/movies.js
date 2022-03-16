const express = require('express');
const moviesController = require('../controllers/movies');
const router = express.Router();


// GET /movies
router.get('/', moviesController.getMovies );

// Approve movie
router.get('/approve-movie/:movieId', moviesController.approveMovie);

module.exports = router;