import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://uptime-auction-api.azurewebsites.net/api/Auction');
    const auctions = response.data; 
    res.json(auctions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const auctionsController = router;
