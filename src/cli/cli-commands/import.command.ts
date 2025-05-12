import fs from 'node:fs';
import chalk from 'chalk';
import { initializeDBConnection } from '../../db/connect.js';
import { RentalOfferDbo } from '../../modules/rental-offers/rental-offer.dbo.js';
import {pino} from 'pino';

export const importOffers = async (filePath: string) => {
  try {
    await initializeDBConnection(pino());

    if (!fs.existsSync(filePath)) {
      console.error(chalk.red('Указанный файл не найден!'));
      return;
    }

    const fileContents = fs.readFileSync(filePath, 'utf-8');
    if (!fileContents) {
      console.error(chalk.red('Не удалось прочитать содержимое файла!'));
      return;
    }

    const rows = fileContents.split('\n').slice(1);
    const offers = rows
      .filter((line) => line)
      .map((line) => {
        const [
          name,
          description,
          publishDate,
          city,
          previewImage,
          photos,
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          amenities,
          author,
          commentsCount,
          coordinates
        ] = line.split('\t');

        return {
          name,
          description,
          publishDate,
          city,
          previewImage,
          photos: photos.split(';'),
          isPremium: isPremium === 'Да',
          isFavorite: isFavorite === 'Да',
          rating: parseFloat(rating),
          type,
          rooms: parseInt(rooms, 10),
          guests: parseInt(guests, 10),
          price: parseInt(price, 10),
          amenities: amenities.split(';'),
          author,
          commentsCount,
          coordinates,
        };
      });

    await RentalOfferDbo.insertMany(offers);
    console.log(chalk.green('Импорт данных завершён успешно!'));
  } catch (err) {
    console.error(chalk.red('Не удалось импортировать данные:'), err);
  }
};
