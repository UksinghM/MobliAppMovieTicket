const SearchHistory = require('../models/SearchHistory');

// Save search history
exports.saveSearch = async (req, res) => {
  try {
    const { userId, searchTerm, movie } = req.body;
    const newHistory = new SearchHistory({
      userId,
      searchTerm,
      movieId: movie.id,
      movieTitle: movie.title,
      posterUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    });
    await newHistory.save();
    res.status(201).json({ message: 'Search history saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user history
exports.getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await SearchHistory.find({ userId }).sort({ searchedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
