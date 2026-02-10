import express from 'express';
import db from '../config/database';
import { createUserWithWallet } from '../modules/users/userService';
import { checkKarmaBlacklist } from '../modules/karmaService';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const blacklisted = await checkKarmaBlacklist(email);
    if (blacklisted) {
      return res.status(403).json({ error: 'User is blacklisted by Karma' });
    }

    const userId = await createUserWithWallet(name, email)

      res.status(201).json({ message: 'User and wallet created', userId });
    
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
