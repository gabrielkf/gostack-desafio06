import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category?: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepo = getRepository(Category);
    const categoryExists = await categoriesRepo.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoriesRepo.create({
        title: category,
      });

      await categoriesRepo.save(newCategory);
    }
  }
}

export default CreateTransactionService;
