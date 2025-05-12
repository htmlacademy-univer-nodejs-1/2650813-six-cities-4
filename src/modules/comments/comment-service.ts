import { injectable } from 'inversify';
import { ICommentService } from './comment-service.interface.js';
import { Comment, CommentDbo } from './comment.dbo.js';
import { RentalOfferDbo } from '../rental-offers/rental-offer.dbo.js';
import mongoose from 'mongoose';

@injectable()
export class CommentService implements ICommentService {
  async findByOfferId(offerId: mongoose.Types.ObjectId, count: number): Promise<Comment[]> {
    return CommentDbo.find({rentalOfferId: offerId})
      .sort({ createdAt: -1 })
      .limit(count)
      .exec();
  }

  async deleteByOfferId(offerId: mongoose.Types.ObjectId): Promise<void> {
    await CommentDbo.deleteMany({rentalOfferId: offerId}).exec();
  }

  async find(query: Partial<Comment>): Promise<Comment[]> {
    return CommentDbo.find(query).exec();
  }

  async create(document: Comment): Promise<Comment> {
    const newComment = new CommentDbo(document);
    const result = await newComment.save();
    await this.updateRentalOfferRating(document.rentalOfferId);
    return result;
  }

  async updateRentalOfferRating(rentalOfferId: string): Promise<void> {
    const comments = await CommentDbo.find({rentalOfferId: rentalOfferId}).exec();
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const avgRating = comments.length > 0 ? totalRating / comments.length : 0;
    const commentsCount = comments.length;
    const roundedRating = Math.round(avgRating * 10) / 10;

    await RentalOfferDbo.findByIdAndUpdate(
      rentalOfferId,
      {
        rating: roundedRating,
        commentsCount: commentsCount
      }
    );
  }
}
