import { withdrawFunds } from '../modules/wallet/walletService';
import database from '../config/database';

jest.mock('../config/database', () => ({
  transaction: jest.fn(),
}));

describe('Wallet Withdrawal', () => {
  let balances: Record<number, number>;

  beforeEach(() => {
    balances = { 1: 200 };
  });

  const mockTransaction = (fn: any) =>
    fn((table: string) => {
      if (table === 'wallets') {
        return {
          where: ({ user_id }: { user_id: number }) => ({
            first: async () => {
              const balance = balances[user_id];
              return balance !== undefined
                ? { id: user_id, balance }
                : null;
            },
            update: async (data: { balance: number }) => {
              balances[user_id] = data.balance;
              return 1;
            },
          }),
        };
      }

      if (table === 'transactions') {
        return { insert: async () => 1 };
      }
    });

  it('successfully withdraws funds', async () => {
    (database.transaction as jest.Mock).mockImplementation(mockTransaction);

    const newBalance = await withdrawFunds(1, 50);

    expect(newBalance).toBe(150);
  });

  it('fails if wallet does not exist', async () => {
    (database.transaction as jest.Mock).mockImplementation((fn: any) =>
      fn((table: string) => ({
        where: () => ({
          first: async () => null,
        }),
        update: async () => 1,
      }))
    );

    await expect(withdrawFunds(99, 50)).rejects.toThrow('Wallet not found');
  });

  it('fails if insufficient funds', async () => {
    balances = { 1: 20 };
    (database.transaction as jest.Mock).mockImplementation(mockTransaction);

    await expect(withdrawFunds(1, 50)).rejects.toThrow('Insufficient funds');
  });

  it('fails if amount is invalid', async () => {
    await expect(withdrawFunds(1, -10)).rejects.toThrow('Invalid amount');
  });
});
