import {RentalOffer} from '../../modules/rental-offers/rental-offer.dbo.js';
import fs from 'node:fs';
import axios from 'axios';

export async function generateOffers(n: number, url: string): Promise<RentalOffer[]> {
  const offers: RentalOffer[] = [];

  for (let i = 0; i < n; i++) {
    const response = await axios.get<RentalOffer>(`${url}/${i % 8}`);
    const data = response.data;
    data.publishDate = new Date(data.publishDate);
    data.price = Math.floor(Math.random() * 1000);
    offers.push(data);
  }

  return offers;
}

export function saveOffersToFile(offers: RentalOffer[], filepath: string) {
  const tsvData = offers.map((offer) => [
    offer.name,
    offer.description,
    offer.publishDate.toISOString(),
    offer.city,
    offer.previewImage,
    offer.photos.join(','),
    offer.isPremium,
    offer.isFavorite,
    offer.rating,
    offer.type,
    offer.rooms,
    offer.guests,
    offer.price,
    offer.amenities.join(','),
    offer.author,
    offer.commentsCount,
    [offer.coordinates.lat,offer.coordinates.lng].join(',')
  ].join('\t')).join('\n');

  fs.writeFileSync(filepath, tsvData);
}
