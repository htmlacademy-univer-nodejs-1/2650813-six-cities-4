import { IRepository } from '../../db/repository.interface.js';
import { Comment } from './comment.dbo.js';
import mongoose from 'mongoose';

export interface ICommentService extends IRepository<Comment> {
  deleteByOfferId(offerId: mongoose.Types.ObjectId): Promise<void>;
  findByOfferId(offerId: mongoose.Types.ObjectId, limit: number): Promise<Comment[]>;
}
