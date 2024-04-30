import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://uptime-auction-api.azurewebsites.net/api/Auction');
    const auctions = response.data;
    res.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/bid', async (req, res) => {
  try {
    console.log('Received bid request:', req.body);

    const { productId, bidTime, bid_amount, user_id, productName, productDescription, productCategory, biddingEndDate } = req.body;

    // Check if there is an existing bid for the product
    const existingBid = await prisma.auctionItemBidAmount.findFirst({
      where: {
        auctionItem_id: productId
      },
      orderBy: {
        bid_amount: 'desc'
      }
    });

    console.log('Existing bid:', existingBid);

    // If no existing bid or new bid amount is higher, save the bid to the database
    if (!existingBid || bid_amount > existingBid.bid_amount) {
      console.log('Saving bid to the database...');
      const bid = await prisma.auctionItemBidAmount.create({
        data: {
          AuctionItem: {
            connect: { id: productId } // Connect to the auction item
          },
          bid_time: bidTime,
          bid_amount: bid_amount,
          User: {
            connect: { id: user_id } // Connect to the user making the bid
          },
          productName: productName,
          productDescription: productDescription,
          productCategory: productCategory,
          biddingEndDate: new Date(biddingEndDate)
        }
      });

      res.json({ message: 'Bid saved successfully', bid });
    } else {
      console.log('Bid amount must be higher than the existing bid');
      res.status(400).json({ error: 'Bid amount must be higher than the existing bid' });
    }
  } catch (error) {
    console.error('Error saving bid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const auctionsController = router;
