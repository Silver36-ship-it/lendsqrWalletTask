import express from 'express';
import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
