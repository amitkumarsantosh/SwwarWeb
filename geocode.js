const express = require('express');
const axios = require('axios');
const app= express()
const router = express.Router();

router.post('/geocode', async (req, res) => {
  const address = req.body.address;
  const apiKey = process.env.MAP_API;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: apiKey,
      },
    });

    const result = response.data.results[0];

    if (!result) return res.status(404).json({ error: 'No result found' });

    const { lat, lng } = result.geometry.location;
    res.json({ lat, lng });
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

module.exports = router;
