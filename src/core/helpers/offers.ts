import {Offer} from '../../types/offer.type.js';
import {City} from '../../types/city.type.js';
import {Housing} from '../../types/housing.type.js';
import {Convenience} from '../../types/convenience.type.js';
import {User} from '../../types/user.type.js';
import {Coordinate} from '../../types/coordinate.type.js';

export function createOffer(offerData: string): Offer {
  const [name, description, date, city, previewImg, images, flagIsPremium, flagIsFavourites, rating, typeHousing, countRooms, countPeople, price, conveniences, author, countComments, coordinates] = offerData.replace('\n', '').split('\t');
  return {
    name,
    description,
    date: new Date(date),
    city: city as City,
    previewImg: previewImg,
    images: images.split(';'),
    flagIsPremium: flagIsPremium as unknown as boolean,
    flagIsFavourites: flagIsFavourites as unknown as boolean,
    rating: rating as unknown as 1 | 2 | 3 | 4 | 5,
    typeHousing: typeHousing as Housing,
    countRooms: countRooms as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    countPeople: countPeople as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    price: Number.parseInt(price, 10),
    conveniences: conveniences as Convenience,
    author: author as unknown as User,
    countComments: Number.parseInt(countComments, 10),
    coordinates: coordinates.split(',') as unknown as Coordinate
  } as Offer;
}
