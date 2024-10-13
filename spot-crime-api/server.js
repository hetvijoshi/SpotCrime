const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');


// Initialize express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows requests from your React app
app.use(express.json()); // Parses incoming JSON requests

// PostgreSQL configuration
const pool = new Pool({
    user: 'academiverse_db', // Your PostgreSQL username
    host: 'academiverse.cjou44q26b2s.us-east-1.rds.amazonaws.com', // Hostname (usually 'localhost' if running locally)
    database: 'academiverse', // Your PostgreSQL database name
    password: 'Academiverse#2024', // Your PostgreSQL password
    port: 5432, // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false,  // Allow self-signed certificates
      },
});

// Connect to the database and check connection status
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// API Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js server' });
});

// to get distinct category of crimes
app.get('/api/crimecategory', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT crm_cd_desc FROM californiacrime'); // Replace 'your_table' with the table you're querying
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database error'});
  }
});

app.get('/api/autocomplete', async (req, res) => {
  const input = req.query.input;
  const location = "34.05327442582769,-118.26310435834333"; // Los Angeles
  const radius = 50000;

  try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&location=${location}&radius=${radius}&strictbounds=true&key=AIzaSyCGCejPxj93O5lcGEezTVJ7QhO6YvC-oMw`);
      response.data.predictions = response.data.predictions.map(prediction => {
          return {
              description: prediction.description,
              placeId: prediction.place_id
          }
      });
      res.json(response.data);  // Send the response back to the frontend
  } catch (error) {
    console.log(error)
      res.status(500).send(JSON.stringify(error));
  }
});

app.post('/api/crimes', async (req, res) => {
  try {
    const placeId = req.body.placeId;
    const respone = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCGCejPxj93O5lcGEezTVJ7QhO6YvC-oMw`)
    const location = respone.data.result.geometry.location;
    const result = await pool.query('SELECT DISTINCT crm_cd_desc FROM californiacrime'); // Replace 'your_table' with the table you're querying
  } catch (error) {
    res.status(500).send(JSON.stringify(error));
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
