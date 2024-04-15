const express = require('express');
const router = express.Router();
const axios = require('axios'); 

router.get('/auctions', async (req, res) => {
  try {
    const response = await axios.get('http://uptime-auction-api.azurewebsites.net/api/Auction');
    const auctions = response.data; 
    res.json(auctions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
