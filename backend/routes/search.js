const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET /api/top-movies?search=YOUR_SEARCH
router.get('/top-movies', async (req, res) => {
  try {
    const search = req.query.search ? req.query.search : '';
    // Use the search term in the Gemini prompt
    const prompt = `
      List 5 movies related to "${search}" in JSON format. 
      Include for each movie: title, a short about/description, poster (image url if possible), rating (0-5), ticketLink (URL for ticket booking; use a real or example link).
      Reply ONLY with the JSON array.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Log raw output for debugging
    console.log('Gemini raw response:', result.response.text());

    let movies = [];
    try {
      movies = JSON.parse(result.response.text());
    } catch (e) {
      console.log('Gemini response parse error:', e.message);
      return res.status(500).json({ error: "Invalid Gemini response format.", details: result.response.text() });
    }
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
