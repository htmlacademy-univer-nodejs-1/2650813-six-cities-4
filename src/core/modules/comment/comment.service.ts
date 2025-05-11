import CreateCommentDto from './dto/create-comment.dto';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../../types/app-component.enum.js';
import {CommentServiceInterface} from './comment-service.interface';
import {CommentEntity} from './comment.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
