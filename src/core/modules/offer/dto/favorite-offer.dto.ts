import {Expose} from 'class-transformer';
import {City} from '../../../../types/city.enum.js';
import {Housing} from '../../../../types/housing.enum.js';

export class FavoriteOfferDto {
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose({name: 'createdAt'})
    date!: Date;

  @Expose()
    description!: string;

  @Expose()
    city!: City;

  @Expose()
    previewImage!: string;

  @Expose()
    isPremium!: boolean;

  isFavourite = true;

  @Expose()
    rating!: number;

  @Expose()
    housing!: Housing;

  @Expose()
    price!: number;

  @Expose()
    commentsCount!: number;
}
