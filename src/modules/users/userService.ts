import db from '../../config/database';

export async function createUserWithWallet(name: string, email: string) {
  return db.transaction(async (trx) => {
    const [userId] = await trx('users').insert({ name, email });
    await trx('wallets').insert({ user_id: userId, balance: 0 });
    return userId;
  });
}
