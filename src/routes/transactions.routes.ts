import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (req, res) => {
  const transactionsRepo = getCustomRepository(
    TransactionsRepository,
  );

  const completeRecord = await transactionsRepo.getBalance(true);
  console.log(completeRecord);

  return res.json(completeRecord);
});

transactionsRouter.post('/', async (req, res) => {
  const { title, value, type, category } = req.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return res.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);

  return res.status(204).send();
});

transactionsRouter.post('/import', async (req, res) => {
  // TODO
});

export default transactionsRouter;
