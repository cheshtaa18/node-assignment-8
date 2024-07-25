//setup
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.send(`File uploaded successfully: ${req.file.filename}`);
  } catch (error) {
    res.status(400).send('Error uploading file');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // Route causing error (for testing)
  app.get('/error', (req, res) => {
    throw new Error('This is a test error');
  });

//axios
const axios = require('axios');

// Define API key and endpoint
const API_KEY = 'your_openweathermap_api_key';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

// Weather route
app.get('/weather', async (req, res) => {
  const city = req.query.city || 'London';
  
  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching weather data');
  }
});

//express validate

const { body, validationResult } = require('express-validator');

app.post('/user', [
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('User data is valid');
});
