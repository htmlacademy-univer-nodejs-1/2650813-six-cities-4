import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import {City} from '../../../../types/city.enum.js';
import {Housing} from '../../../../types/housing.enum.js';
import {Convenience} from '../../../../types/convenience.enum.js';
import {CreateOfferMessages} from './create-offer-messages.js';

export default class CreateOfferDto {
  @MinLength(10, {message: CreateOfferMessages.name.minLength})
  @MaxLength(100, {message: CreateOfferMessages.name.maxLength})
  public name!: string;

  @MinLength(20, {message: CreateOfferMessages.name.minLength})
  @MaxLength(1024, {message: CreateOfferMessages.name.maxLength})
  public description!: string;

  @IsDateString({}, {message: CreateOfferMessages.date.invalidFormat})
  public date!: Date;

  @IsString({message: CreateOfferMessages.city.invalidFormat})
  public city!: City;

  @IsString({message: CreateOfferMessages.previewImage.invalidFormat})
  public previewImage!: string;

  @IsArray({message: CreateOfferMessages.images.invalidFormat})
  public images!: string[];

  @IsBoolean({message: CreateOfferMessages.isPremium.invalidFormat})
  public isPremium!: boolean;

  @IsBoolean({message: CreateOfferMessages.isFavourite.invalidFormat})
  public isFavourite!: boolean;

  @IsNumber({}, {message: CreateOfferMessages.rating.invalidFormat})
  public rating!: 1 | 2 | 3 | 4 | 5;

  @IsString({message: CreateOfferMessages.housing.invalidFormat})
  public housing!: Housing;

  @IsInt({message: CreateOfferMessages.roomsCount.invalidFormat})
  public roomsCount!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @IsInt({message: CreateOfferMessages.peopleCount.invalidFormat})
  public peopleCount!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @IsNumber({}, {message: CreateOfferMessages.price.invalidFormat})
  public price!: number;

  @IsString({message: CreateOfferMessages.conveniences.invalidFormat})
  public convenience!: Convenience;

  public userId!: string;

  public commentsCount!: number;

  @IsArray({message: CreateOfferMessages.coordinates.invalidFormat})
  public coordinates!: number[];
}
