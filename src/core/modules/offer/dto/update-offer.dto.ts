import {City} from '../../../../types/city.type.js';
import {Housing} from '../../../../types/housing.type.js';
import {Convenience} from '../../../../types/convenience.type.js';
import {User} from '../../../../types/user.type.js';
import {Coordinate} from '../../../../types/coordinate.type.js';

export default class UpdateOfferDto {
  name?: string;
  description?: string;
  date?: Date;
  city?: City;
  previewImg?: string;
  images?: string[];
  flagIsPremium?: boolean;
  flagIsFavourites?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  typeHousing?: Housing;
  countRooms?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  countPeople?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  price?: number;
  conveniences?: Convenience;
  author?: User;
  countComments?: number;
  coordinates?: Coordinate;
}
