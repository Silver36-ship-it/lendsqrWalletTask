import express from 'express';
import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Lendsqr Wallet Service API',
    version: '1.0.0',
    endpoints: {
      users: 'POST /users',
      fundWallet: 'POST /wallets/fund',
      transfer: 'POST /wallets/transfer',
      withdraw: 'POST /wallets/withdraw'
    },
    status: 'API is running'
  });
});

app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
