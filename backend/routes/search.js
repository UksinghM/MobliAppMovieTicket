const express = require('express');
const router = express.Router();
const { saveSearch, getUserHistory } = require('../controllers/SearchController');

// POST /search - Save a user's search
router.post('/search', saveSearch);

// GET /history/:userId - Get user's search history
router.get('/history/:userId', getUserHistory);

module.exports = router;
