import { transferFunds } from '../modules/wallet/walletService';
import db from '../config/database';

jest.mock('../config/database', () => ({
  transaction: jest.fn(),
}));

describe('Wallet Transfer', () => {
  let balances: Record<number, number>;

  beforeEach(() => {
    balances = { 1: 200, 2: 100 };
  });

  // Fixed mock transaction helper with proper types
  const mockTransaction = async (fn: any) => {
    return await fn((table: string) => {
      if (table === 'wallets') {
        return {
          // Handle both .where('user_id', value) and .where({ user_id: value })
          where: (key: string | { user_id: number }, value?: number) => {
            const userId = typeof key === 'string' ? value! : key.user_id;
            
            return {
              first: async () => {
                const balance = balances[userId];
                return balance !== undefined ? { id: userId, balance } : null;
              },
              update: async (data: { balance: number }) => {
                balances[userId] = data.balance;
                return 1;
              },
            };
          },
        };
      }

      if (table === 'transactions') {
        return { insert: async () => [1] };
      }
    });
  };

  it('successfully transfers funds between wallets', async () => {
    (db.transaction as jest.Mock).mockImplementation(mockTransaction);

    const result = await transferFunds(1, 2, 50);

    expect(result.fromBalance).toBe(150); // 200 - 50
    expect(result.toBalance).toBe(150);   // 100 + 50
  });

  it('fails if sender wallet does not exist', async () => {
    (db.transaction as jest.Mock).mockImplementation(async (fn: any) =>
      fn((table: string) => {
        if (table === 'wallets') {
          return {
            where: (key: string | { user_id: number }, value?: number) => {
              const userId = typeof key === 'string' ? value! : key.user_id;
              return {
                first: async () => (userId === 99 ? null : { id: userId, balance: 100 }),
                update: async () => 1,
              };
            },
          };
        }
        return { insert: async () => [1] };
      })
    );

    await expect(transferFunds(99, 2, 50)).rejects.toThrow('Sender wallet not found');
  });

  it('fails if receiver wallet does not exist', async () => {
    (db.transaction as jest.Mock).mockImplementation(async (fn: any) =>
      fn((table: string) => {
        if (table === 'wallets') {
          return {
            where: (key: string | { user_id: number }, value?: number) => {
              const userId = typeof key === 'string' ? value! : key.user_id;
              return {
                first: async () => (userId === 99 ? null : { id: userId, balance: balances[userId] || 200 }),
                update: async () => 1,
              };
            },
          };
        }
        return { insert: async () => [1] };
      })
    );

    await expect(transferFunds(1, 99, 50)).rejects.toThrow('Receiver wallet not found');
  });

  it('fails if insufficient funds', async () => {
    balances = { 1: 20, 2: 100 }; // sender has less than transfer
    (db.transaction as jest.Mock).mockImplementation(mockTransaction);

    await expect(transferFunds(1, 2, 50)).rejects.toThrow('Insufficient funds');
  });
});