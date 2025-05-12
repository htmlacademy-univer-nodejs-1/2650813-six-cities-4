import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Either } from '../utils/either.js';
import { Logger } from 'pino';

dotenv.config();

export async function initializeDBConnection(logger: Logger): Promise<Either<string, void>> {
  const mongoUri = process.env.DB_HOST;
  if (mongoUri) {
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');
    return { kind: 'right', value: undefined };
  }
  return { kind: 'left', value: 'Ошибка: отсутствует переменная окружения DB_HOST' };
}
