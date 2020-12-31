import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CompleteRecord {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(
    withTransactions = false,
  ): Promise<Balance | CompleteRecord> {
    const transactions = await this.find();

    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    transactions.forEach(trans => {
      balance[trans.type] += trans.value;
    });

    balance.total = balance.income - balance.outcome;

    if (!withTransactions) return balance;

    return { transactions, balance };
  }
}

export default TransactionsRepository;
