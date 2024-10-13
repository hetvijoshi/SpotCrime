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
    res.status(500).json({ error: 'Database error' });
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

app.get('/api/crimes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM californiacrimereport'); // Replace 'your_table' with the table you're querying
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/crimes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id > 0) {
      const result = await pool.query(`SELECT * FROM californiacrimereport where reportId = ${id}`); // Replace 'your_table' with the table you're querying
      let data = result.rows.length > 0 ? result.rows[0] : null;
      if (data) {
        data.vote = data.vote + 1;
        if (!data.tb && data.vote >= 5) {
          data.tb = true;
          let insertQuery = `INSERT INTO californiacrime (crm_cd_desc, date_rptd, date_occ, time_occ, location, lat, lon) VALUES ('${data.crm_cd_desc}', '${new Date(data.date_rptd).toISOString().slice(0,10)}', '${new Date(data.date_occ).toISOString().slice(0,10)}', '${data.time_occ}', '${data.location}', ${data.lat}, ${data.lon})`;
          await pool.query(insertQuery);
        }
        const result2 = await pool.query(`UPDATE californiacrimereport SET vote=${data.vote}, tb=${data.tb} WHERE reportId = ${id}`);
        res.json({ message: "Data updated successfully...", data: result2.rows, status: true });
      } else {
        res.json({ message: "Data not found...", data: null, status: false });
      }
    } else {
      res.json({ message: "Invalid id...", data: null, status: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/crimes', async (req, res) => {
  try {
    const placeId = req.body.placeId;
    const category = req.body.crimeCategory;
    const respone = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCGCejPxj93O5lcGEezTVJ7QhO6YvC-oMw`)
    const location = respone.data.result.geometry.location;
    let ranges
    if (location) {
      ranges = getLatLonRange(location.lat, location.lng, 1);
    }
    const result = await pool.query(`SELECT CRM_CD_DESC,COUNT(*) FROM CALIFORNIACRIME WHERE ( LAT BETWEEN ${ranges.minLat} AND ${ranges.maxLat} )AND ( LON BETWEEN ${ranges.minLon} AND ${ranges.maxLon}) GROUP BY CRM_CD_DESC ORDER BY COUNT(*) DESC LIMIT 5;`); // Replace 'your_table' with the table you're querying
    let data = {
      description: req.body.description,
      crm_cd_desc: category,
      date_rptd: req.body.crimeDate,
      date_occ: req.body.crimeDate,
      time_occ: req.body.crimeTime,
      location: respone.data.result.name,
      lat: location.lat,
      lon: location.lng,
      tb: false,
      vote: 1
    }
    if (result.rows.findIndex(x => x.crm_cd_desc == category) >= 0) {
      data.tb = true;
      let insertQuery = `INSERT INTO californiacrime (crm_cd_desc, date_rptd, date_occ, time_occ, location, lat, lon) VALUES ('${data.crm_cd_desc}', '${data.date_rptd}', '${data.date_occ}', '${data.time_occ}', '${data.location}', ${data.lat}, ${data.lon})`;
      await pool.query(insertQuery);
    }

    let insertQuery = `INSERT INTO californiacrimereport (description, crm_cd_desc, date_rptd, date_occ, time_occ, location, lat, lon, tb, vote) VALUES ('${data.description}', '${data.crm_cd_desc}', '${data.date_rptd}', '${data.date_occ}', '${data.time_occ}', '${data.location}', ${data.lat}, ${data.lon}, ${data.tb}, ${data.vote})`;
    await pool.query(insertQuery);
    res.json({ message: "Data inserted into tableau successfully...", data: data, status: true });
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error));
  }
});

function getLatLonRange(lat, lon, radiusInMiles = 1) {
  const milesPerDegreeLat = 69.0; // Approximation
  const milesPerDegreeLonAtEquator = 69.172; // At equator, varies with latitude

  // Convert the radius in miles to latitude/longitude degrees
  const latRange = radiusInMiles / milesPerDegreeLat;
  const lonRange = radiusInMiles / (milesPerDegreeLonAtEquator * Math.cos(lat * Math.PI / 180));

  // Latitude range
  const minLat = lat - latRange;
  const maxLat = lat + latRange;

  // Longitude range
  const minLon = lon - lonRange;
  const maxLon = lon + lonRange;

  return {
    minLat,
    maxLat,
    minLon,
    maxLon
  };
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
