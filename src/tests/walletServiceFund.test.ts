import { fundWallet } from '../modules/wallet/walletService';
import db from '../config/database';

jest.mock('../config/database', () => ({
  transaction: jest.fn(),
}));

describe('fundWallet', () => {

  it('adds money to wallet balance', async () => {
    (db.transaction as jest.Mock).mockImplementation(async (fn) => {
      return fn((table: string) => {
        if (table === 'wallets') {
          return {
            where: () => ({
              first: async () => ({ id: 1, balance: 100 }),
              update: async () => {},
            }),
          };
        }

        if (table === 'transactions') {
          return {
            insert: async () => {},
          };
        }
      });
    });

    const result = await fundWallet(1, 50);

    expect(result).toBe(150);
  });

  it('throws error if wallet is missing', async () => {
    (db.transaction as jest.Mock).mockImplementation(async (fn) => {
      return fn(() => ({
        where: () => ({
          first: async () => null,
        }),
      }));
    });

    await expect(fundWallet(99, 50)).rejects.toThrow('Wallet not found');
  });

  it('throws error for invalid amount', async () => {
    await expect(fundWallet(1, 0)).rejects.toThrow('Invalid amount');
  });

});
