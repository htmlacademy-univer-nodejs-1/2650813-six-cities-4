import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from './controller.abstract.js';
import { Logger } from 'pino';
import { ICommentService } from '../../comments/comment-service.interface.js';
import mongoose from 'mongoose';
import { Comment, CreateCommentDto } from '../dto/index.js';
import { UserService } from '../../users/user-service.interface.js';
import { TokenService } from '../../token-service/token-service.interface.js';
import { ObjectIdValidatorMiddleware } from '../middleware/objectid-validator.middleware.js';
import { DtoValidationMiddleware } from '../middleware/dto-validation.middleware.js';
import { IRentalService } from '../../rental-offers/rental-service.interface.js';
import { DocumentExistsMiddleware } from '../middleware/document-exists.middleware.js';

@injectable()
export class CommentsController extends BaseController {
  constructor(
    @inject('Log') protected readonly logger: Logger,
    @inject('UserService') protected readonly userService: UserService,
    @inject('CommentService') private readonly commentService: ICommentService,
    @inject('RentalService') private readonly rentalService: IRentalService,
    @inject('Token') private readonly tokenService: TokenService
  ) {
    super(logger);

    this.logger.info('CommentsController routes setup...');

    this.registerRoute({
      path: '/offers/:offerId/comments',
      httpMethod: 'get',
      handler: this.getComments,
      middlewares: [
        new ObjectIdValidatorMiddleware('offerId'),
        new DocumentExistsMiddleware(
          async (id) => !!(await this.rentalService.findById(id)),
          'Rental offer',
          'offerId'
        )
      ]
    });

    this.registerRoute({
      path: '/offers/:offerId/comments',
      httpMethod: 'post',
      handler: this.addComment,
      middlewares: [
        new ObjectIdValidatorMiddleware('offerId'),
        new DtoValidationMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(
          async (id) => !!(await this.rentalService.findById(id)),
          'Rental offer',
          'offerId'
        )
      ]
    });
  }

  public async getComments({params}: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(new mongoose.Types.ObjectId(offerId), 50);

    const commentsDto: (Comment | undefined)[] = (await Promise.all(comments.map(async (c) => {
      if (!c) {
        return undefined;
      }
      const user = await this.userService.findById(new mongoose.Types.ObjectId(c.userId));
      if (!user) {
        return undefined;
      }
      return {
        id: c.id,
        text: c.text,
        rating: c.rating,
        postedAt: c.createdAt?.toDateString(),
        user: {
          id: user.id.toString(),
          name: user.name,
          avatarUrl: user.avatar,
          email: user.email,
          type: user.type
        }
      };
    }))).filter((c) => c !== undefined);

    this.ok(res, commentsDto);
  }

  public async addComment(req: Request, res: Response): Promise<void> {
    const authToken = req.headers.authorization?.split(' ')[1];
    const userEmail = authToken ? await this.tokenService.findById(authToken)
      .then((token) => token?.userId)
      .then((userId) => userId
        ? this.userService.findById(new mongoose.Types.ObjectId(userId))
        : null
      )
      .then((user) => user?.id) : null;

    const {offerId} = req.params;
    await this.commentService.create({
      ...req.body,
      offerId,
      userId: userEmail
    });
    this.created(res, null);
  }
}
