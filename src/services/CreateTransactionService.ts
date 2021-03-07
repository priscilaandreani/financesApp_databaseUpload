import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    const { total: totalBalance } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value >= totalBalance) {
      throw new AppError({
        statusCode: 400,
        message: 'O valor de retirada está acima do saldo total!',
      });
    }

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id;

    if (!categoryExists) {
      const categoryObj = categoryRepository.create({
        title: category,
      });

      const categoryRef = await categoryRepository.save(categoryObj);

      category_id = categoryRef.id;
    } else {
      category_id = categoryExists.id;
    }

    const transactionObj = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transactionObj);
    return transactionObj;
  }
}

export default CreateTransactionService;
