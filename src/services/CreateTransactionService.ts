import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome')
      throw new AppError(
        'Transaction type must be either "income" or "outcome"',
      );

    const transactionsRepo = getCustomRepository(
      TransactionsRepository,
    );

    if (type === 'outcome') {
      const { total } = await transactionsRepo.getBalance();

      if (total < value) throw new AppError('Insufficient funds.');
    }

    const categoriesRepo = getRepository(Category);
    const categoryExists = await categoriesRepo.findOne({
      where: { title: category },
    });
    let newCategory;
    if (!categoryExists) {
      newCategory = categoriesRepo.create({
        title: category,
      });

      await categoriesRepo.save(newCategory);
    } else {
      newCategory = categoryExists;
    }

    const transaction = transactionsRepo.create({
      title,
      value,
      type,
      category: newCategory,
    });

    await transactionsRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
