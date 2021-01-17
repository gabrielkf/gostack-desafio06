import { join } from 'path';
import fs from 'fs';
import parse from 'csv-parse';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService, {
  Request,
} from './CreateTransactionService';
import { tmpFolder } from '../config/upload';

export default class ImportTransactionsService {
  public async execute(
    filename: string,
  ): Promise<any /* Transaction[] */> {
    const transactionsFile = join(tmpFolder, filename);
    const importedTransactions = await fs.promises.stat(
      transactionsFile,
    );

    const createTransactions = new CreateTransactionService();

    let rows;
    if (importedTransactions.isFile()) {
      rows = await this.processFile(transactionsFile);
      await fs.promises.unlink(transactionsFile);
    } else {
      throw new AppError('Error while importing file.');
    }

    const columns: string[] = [];
    try {
      rows[0].forEach((col: string) => {
        columns.push(col);
      });
    } catch {
      throw new AppError('Invalid CSV formatting.');
    }

    const transactions: Transaction[] = [];
    for (let i = 1; i < rows.length; i += 1) {
      const transaction = await createTransactions.execute({
        title: rows[i][0],
        type: rows[i][1],
        value: Number(rows[i][2]),
        category: rows[i][3],
      });

      transactions.push(transaction);
    }

    return transactions;
  }

  private async processFile(filePath: string): Promise<any> {
    const records = [];

    const parser = fs.createReadStream(filePath).pipe(parse());

    for await (const record of parser) {
      records.push(
        record.map((el: string) => {
          return el.trim();
        }),
      );
    }

    return records;
  }
}
