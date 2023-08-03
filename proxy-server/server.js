const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(express.json());

// Proxy route to fetch robots.txt
app.get('/robots', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL parameter is missing.');
  }

  try {
    console.log('Query to ' + url);
    const response = await axios.get(url + 'robots.txt');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching robots.txt:', error.message);
    res.status(500).send('Failed to fetch robots.txt');
  }
});

// Ping route to check if the server is running
app.get('/ping', (req, res) => {
  res.send('Server is running. Pong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
