import {Convenience} from './convenience.enum.js';
import {User} from './user.type.js';
import {City} from './city.enum.js';
import {Housing} from './housing.enum.js';

export type Offer = {
  name: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  housing: Housing;
  roomsCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  peopleCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  price: number;
  convenience: Convenience;
  author: User;
  commentsCount: number;
  coordinates: number[];
}
