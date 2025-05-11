import CreateCommentDto from './dto/create-comment.dto.js';
import {CommentEntity} from './comment.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;

  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;

  deleteByOfferId(offerId: string): Promise<number | null>;
}
