const express = require('express');
const axios = require('axios'); // Use axios to make HTTP requests

const app = express();
const port = 3001;

app.use(express.json()); // For parsing application/json

// Translation endpoint
app.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: 'en', // Source language can be dynamic based on your need
      target: targetLanguage,
    });

    const translatedText = response.data.translatedText;
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: 'Failed to translate text. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
