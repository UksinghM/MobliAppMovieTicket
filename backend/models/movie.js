const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ticketLink: { type: String, required: true },  // <-- for ticket link
  about: { type: String, required: true },
  rating: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
