const mongoose = require("mongoose");

const SearchHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },        // Unique ID for the user
  searchTerm: { type: String, required: true },    // The term the user searched
  movieId: { type: String, required: true },       // Unique ID for the movie (from TMDB or other source)
  movieTitle: { type: String, required: true },    // Movie's title
  posterUrl: { type: String },                     // URL for movie poster (optional)
  searchedAt: { type: Date, default: Date.now },   // When the search occurred
});

module.exports = mongoose.model("SearchHistory", SearchHistorySchema);
