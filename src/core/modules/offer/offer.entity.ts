import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {City} from '../../../types/city.enum.js';
import {Convenience} from '../../../types/convenience.enum.js';
import {Housing} from '../../../types/housing.enum.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: [10, 'min length for name = 10'],
    maxlength: [100, 'max length for name = 100']
  })
  public name!: string;

  @prop({
    required: true,
    minlength: [20, 'min length for description = 20'],
    maxlength: [1024, 'max length for description = 1024']
  })
  public description!: string;

  @prop({required: true})
  public date!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({
    required: true,
    type: () => String,
  })
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public isFavourite!: boolean;

  @prop({required: true})
  public rating!: 1 | 2 | 3 | 4 | 5;

  @prop({
    required: true,
    type: () => String,
    enum: Housing
  })
  public housing!: Housing;

  @prop({required: true})
  public roomsCount!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @prop({required: true})
  public peopleCount!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @prop({
    required: true,
    min: [100, 'min length for price = 100'],
    max: [100000, 'max length for price = 100000'],
  })
  public price!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Convenience
  })
  public convenience!: Convenience;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({
    required: true,
    type: () => String,
  })

  @prop({required: true})
  public coordinates!: number[];
}

export const OfferModel = getModelForClass(OfferEntity);
