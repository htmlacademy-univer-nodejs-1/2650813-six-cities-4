import {Housing} from './housing.type.js';
import {Convenience} from './convenience.type.js';
import {User} from './user.type.js';
import {City} from './city.type.js';
import {Coordinate} from './coordinate.type.js';

export type Offer = {
  name: string;
  description: string;
  date: Date;
  city: City;
  previewImg: string;
  images: string[];
  flagIsPremium: boolean;
  flagIsFavourites: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  typeHousing: Housing;
  countRooms: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  countPeople: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  price: number;
  conveniences: Convenience;
  author: User;
  countComments: number;
  coordinates: Coordinate;
}
