import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transactin_id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionResponse = await transactionsRepository.findOne(
      transactin_id,
    );

    if (!transactionResponse) {
      throw new AppError({
        statusCode: 404,
        message: 'This transaction does not exist!',
      });
    }

    await transactionsRepository.delete(transactin_id);
  }
}

export default DeleteTransactionService;
