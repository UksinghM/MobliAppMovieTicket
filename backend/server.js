require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const searchRoutes = require('./routes/search'); // For search history

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Movie = require('./models/movie');

// Serve static folder for posters
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Backend server running!');
});

// Add a new movie
app.post('/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    // Format poster as absolute URL
    const formattedMovies = movies.map(m => ({
      ...m._doc,
      poster: m.poster
        ? `${process.env.BASE_URL || 'http://localhost:5000'}/${m.poster.replace(/^\/+/, '')}`
        : null
    }));

    res.json(formattedMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search history routes
app.use('/api', searchRoutes); // Add this line for search history endpoints

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
