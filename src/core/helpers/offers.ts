import {Offer} from '../../types/offer.type.js';
import {City} from '../../types/city.enum';
import {Housing} from '../../types/housing.enum';
import {Convenience} from '../../types/convenience.enum';
import {User} from '../../types/user.type.js';

export function createOffer(offerData: string): Offer {
  const [name, description, date, city, previewImage, images, flagIsPremium, flagIsFavourites, rating, typeHousing, countRooms, countPeople, price, conveniences, author, countComments, coordinates] = offerData.replace('\n', '').split('\t');
  return {
    name,
    description,
    date: new Date(date),
    city: city as City,
    previewImage: previewImage,
    images: images.split(';'),
    isPremium: flagIsPremium as unknown as boolean,
    isFavourite: flagIsFavourites as unknown as boolean,
    rating: rating as unknown as 1 | 2 | 3 | 4 | 5,
    housing: typeHousing as Housing,
    roomsCount: countRooms as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    peopleCount: countPeople as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    price: Number.parseInt(price, 10),
    convenience: conveniences as Convenience,
    author: author as unknown as User,
    commentsCount: Number.parseInt(countComments, 10),
    coordinates: coordinates.split(',') as unknown as number[]
  } as Offer;
}
