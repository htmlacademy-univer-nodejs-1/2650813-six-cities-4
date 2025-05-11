import {Expose} from 'class-transformer';
import {City} from '../../../../types/city.enum.js';
import {Housing} from '../../../../types/housing.enum.js';
import {Convenience} from '../../../../types/convenience.enum.js';
import {User} from '../../../../types/user.type.js';

export class OfferRdo {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavourite!: boolean;

  @Expose()
  public rating!: 1 | 2 | 3 | 4 | 5;

  @Expose()
  public housing!: Housing;

  @Expose()
  public roomsCount!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @Expose()
  public peopleCount!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @Expose()
  public price!: number;

  @Expose()
  public convenience!: Convenience;

  @Expose()
  public author!: User;

  @Expose()
  public coordinates!: number[];
}
