import database from '../../config/database';

export async function fundWallet(userId: number, amount: number) {
  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  return database.transaction(async (trx) => {
    const wallet = await trx('wallets')
      .where('user_id', userId)
      .first();

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const newBalance = Number(wallet.balance) + amount;

    await trx('wallets')
      .where('user_id', userId)
      .update({ balance: newBalance });

    await trx('transactions').insert({
      wallet_id: wallet.id,
      type: 'FUND',
      amount,
    });

    return newBalance;
  });
}


export async function transferFunds(
  fromUserId: number,
  toUserId: number,
  amount: number
) {
  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  if (fromUserId === toUserId) {
    throw new Error('Cannot transfer to same user');
  }

  return database.transaction(async (trx) => {
    const fromWallet = await trx('wallets')
      .where('user_id', fromUserId)
      .first();

    const toWallet = await trx('wallets')
      .where('user_id', toUserId)
      .first();

    if (!fromWallet) throw new Error('Sender wallet not found');
    if (!toWallet) throw new Error('Receiver wallet not found');

    if (Number(fromWallet.balance) < amount) {
      throw new Error('Insufficient funds');
    }

    const newFromBalance = Number(fromWallet.balance) - amount;
    const newToBalance = Number(toWallet.balance) + amount;

    await trx('wallets')
      .where('user_id', fromUserId)
      .update({ balance: newFromBalance });

    await trx('wallets')
      .where('user_id', toUserId)
      .update({ balance: newToBalance });

    await trx('transactions').insert([
      {
        wallet_id: fromWallet.id,
        type: 'TRANSFER_OUT',
        amount,
        from_wallet_id: fromWallet.id,
        to_wallet_id: toWallet.id,
      },
      {
        wallet_id: toWallet.id,
        type: 'TRANSFER_IN',
        amount,
        from_wallet_id: fromWallet.id,
        to_wallet_id: toWallet.id,
      },
    ]);

    return {
      fromBalance: newFromBalance,
      toBalance: newToBalance,
    };
  });
}


export async function withdrawFunds(userId: number, amount: number) {
  if (amount <= 0) throw new Error('Invalid amount');

  return database.transaction(async (trx) => {
    const wallet = await trx('wallets')
      .where({ user_id: userId })
      .first();

    if (!wallet) throw new Error('Wallet not found');

    if (Number(wallet.balance) < amount) {
      throw new Error('Insufficient funds');
    }

    const newBalance = Number(wallet.balance) - amount;

    await trx('wallets')
      .where({ user_id: userId })
      .update({ balance: newBalance });

    await trx('transactions').insert({
      wallet_id: wallet.id,
      type: 'WITHDRAW',
      amount,
    });

    return newBalance;
  });
}


