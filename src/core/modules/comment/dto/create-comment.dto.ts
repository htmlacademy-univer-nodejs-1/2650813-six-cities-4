import {IsDateString, IsMongoId, IsNumber, IsString, Length} from 'class-validator';
import {CreateCommentMessages} from './create-comment-messages.js';


export default class CreateCommentDto {
  @IsString({message: CreateCommentMessages.text.invalidFormat})
  @Length(5, 1024, {message: 'min = 5, max = 1024 '})
  public text!: string;

  @IsMongoId({message: CreateCommentMessages.offerId.invalidFormat})
  public offerId!: string;

  public userId!: string;

  @IsDateString({}, {message: CreateCommentMessages.date.invalidFormat})
  public date!: Date;

  @IsNumber({}, {message: CreateCommentMessages.rating.invalidFormat})
  public rating!: number;
}
