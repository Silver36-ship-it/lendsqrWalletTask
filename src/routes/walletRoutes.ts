import express from 'express';
import db from '../config/database';
import { fundWallet,transferFunds, withdrawFunds } from '../modules/wallet/walletService';
const router = express.Router();

router.post('/fund', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: 'Valid userId and amount are required' });
  }

  try {
      const newBalance = fundWallet(Number(userId), Number(amount));
     
      res.status(200).json({ message: 'Wallet funded', newBalance });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/transfer', async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid fromUserId, toUserId, and amount are required' });
  }

  if (fromUserId === toUserId) {
    return res.status(400).json({ error: 'Cannot transfer to the same wallet' });
  }

  try {
    const result = await transferFunds(Number(fromUserId), Number(toUserId), Number(amount));

      res.status(200).json({
        message: 'Transfer successful',
       ...result
      });
    
  } catch (err: any) {
     if (
      [
        'Invalid amount',
        'Insufficient funds',
        'Sender wallet not found',
        'Receiver wallet not found',
        'Cannot transfer to same user',
      ].includes(err.message)
    ) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/withdraw', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount ) {
    return res.status(400).json({ error: 'Valid userId and amount are required' });
  }

  try {
    const newBalance = await withdrawFunds(userId, amount)      
      res.status(200).json({ message: 'Withdrawal successful', newBalance });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
