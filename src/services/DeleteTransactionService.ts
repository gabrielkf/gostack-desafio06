import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepo = getCustomRepository(
      TransactionsRepository,
    );

    const transaction = await transactionsRepo.findOne(id);
    if (!transaction)
      throw new AppError('Transaction not found', 404);

    await transactionsRepo.delete({ id });
  }
}

export default DeleteTransactionService;
