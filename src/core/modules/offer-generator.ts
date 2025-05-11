import {generateRandomValue, getRandomItem, getRandomItems} from '../helpers/random.js';
import dayjs from 'dayjs';
import {OfferGeneratorInterface} from './offer-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {City} from '../../types/city.enum.js';
import {Housing} from '../../types/housing.enum.js';
import {FIRST_WEEK_DAY, LAST_WEEK_DAY, MAX_COST, MIN_COST} from '../helpers/constants.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.name);
    const description = getRandomItem<string>(this.mockData.description);
    const date = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem([City.Amsterdam, City.Cologne, City.Brussels, City.Paris, City.Hamburg, City.Dusseldorf]);
    const rating = getRandomItem([1, 2, 3, 4, 5]);
    const housing = getRandomItem([Housing.House, Housing.Hotel, Housing.Room, Housing.Apartment]);
    const isPremium = getRandomItem([true, false]);
    const isFavourite = getRandomItem([true, false]);
    const roomsCount = getRandomItem([1, 2, 3, 4, 5, 6, 7, 8]);
    const peopleCount = getRandomItem([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const previewImage = getRandomItem<string>(this.mockData.previewImage);
    const price = generateRandomValue(MIN_COST, MAX_COST).toString();
    const images = getRandomItem<string>(this.mockData.images);
    const conveniences = getRandomItems<string>(this.mockData.conveniences);
    const author = getRandomItem<string>(this.mockData.author);
    const commentsCount = getRandomItem<string>(this.mockData.commentsCount);
    const coordinates = getRandomItem<string>(this.mockData.coordinates);
    return [name, description, date, city, previewImage, images, isPremium, isFavourite, rating, housing, roomsCount, peopleCount, price, conveniences, author, commentsCount, coordinates].join('\t');
  }
}
