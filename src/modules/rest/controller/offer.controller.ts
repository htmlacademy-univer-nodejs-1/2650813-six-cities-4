import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { Logger } from 'pino';
import { StatusCodes } from 'http-status-codes';
import { IRentalService } from '../../rental-offers/rental-service.interface.js';
import { CommentService } from '../../comments/comment-service.js';
import { CreateOfferDto, UpdateOfferDto } from '../dto/index.js';
import { TokenService } from '../../token-service/token-service.interface.js';
import { UserService } from '../../users/user-service.interface.js';
import { BaseController } from './controller.abstract.js';
import { ObjectIdValidatorMiddleware } from '../middleware/objectid-validator.middleware.js';
import { DtoValidationMiddleware } from '../middleware/dto-validation.middleware.js';
import { DocumentExistsMiddleware } from '../middleware/document-exists.middleware.js';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware.js';
import { Config } from 'convict';
import { AppConfig } from '../../../config.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject('Log') protected readonly logger: Logger,
    @inject('RentalService') private readonly offerService: IRentalService,
    @inject('CommentService') private readonly commentService: CommentService,
    @inject('TokenService') private readonly tokenService: TokenService,
    @inject('UserService') private readonly userService: UserService,
    @inject('Config') private readonly config: Config<AppConfig>
  ) {
    super(logger);

    this.registerRoute({
      path: '/offers',
      httpMethod: 'get',
      handler: asyncHandler(this.getOffers.bind(this))
    });

    this.registerRoute({
      path: '/offers',
      httpMethod: 'post',
      handler: asyncHandler(this.createOffer.bind(this)),
      middlewares: [new DtoValidationMiddleware(CreateOfferDto)]
    });

    this.registerRoute({
      path: '/offers/:offerId',
      httpMethod: 'get',
      handler: asyncHandler(this.getOfferById.bind(this)),
      middlewares: [new ObjectIdValidatorMiddleware('offerId')]
    });

    this.registerRoute({
      path: '/offers/:offerId',
      httpMethod: 'patch',
      handler: asyncHandler(this.updateOffer.bind(this)),
      middlewares: [
        new ObjectIdValidatorMiddleware('offerId'),
        new DtoValidationMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(
          async (id) => !!(await this.offerService.findById(id)),
          'Rental offer',
          'offerId'
        )
      ]
    });

    this.registerRoute({
      path: '/offers/:offerId',
      httpMethod: 'delete',
      handler: asyncHandler(this.deleteOffer.bind(this)),
      middlewares: [
        new ObjectIdValidatorMiddleware('offerId'),
        new DocumentExistsMiddleware(
          async (id) => !!(await this.offerService.findById(id)),
          'Rental offer',
          'offerId'
        )
      ]
    });

    this.registerRoute({
      path: '/offers/premium/:city',
      httpMethod: 'get',
      handler: asyncHandler(this.getPremiumOffers.bind(this))
    });

    this.registerRoute({
      path: '/offers/:offerId/image',
      httpMethod: 'post',
      handler: asyncHandler(this.uploadImage.bind(this)),
      middlewares: [
        new ObjectIdValidatorMiddleware('offerId'),
        new DocumentExistsMiddleware(
          async (id) => !!(await this.offerService.findById(id)),
          'Rental offer',
          'offerId'
        ),
        new FileUploadMiddleware(
          this.config.getProperties().UPLOAD_DIRECTORY_PATH,
          'offers',
          'image',
          ['image/jpeg', 'image/png']
        )
      ]
    });

    this.registerRoute({
      path: '/offers/:offerId/photos',
      httpMethod: 'post',
      handler: this.addPhoto,
      middlewares: [
        new ObjectIdValidatorMiddleware('offerId'),
        new DocumentExistsMiddleware(
          async (id) => !!(await this.offerService.findById(id)),
          'Rental offer',
          'offerId'
        ),
        new FileUploadMiddleware(
          this.config.getProperties().UPLOAD_DIRECTORY_PATH,
          'offers',
          'photo',
          ['image/jpeg', 'image/png', 'image/webp']
        )
      ]
    });
  }

  public async getOffers(req: Request, res: Response): Promise<void> {
    const max = req.query.limit ? parseInt(req.query.limit as string, 10) : 60;
    this.logger.info(`Fetching up to ${max} listings...`);
    const results = (await this.offerService.find({})).slice(0, max);
    this.ok(res, results);
  }

  public async createOffer(req: Request<object, object, CreateOfferDto>, res: Response): Promise<void> {
    this.logger.info('Adding a new offer');

    const authToken = req.headers.authorization?.split(' ')[1];
    const userEmail = authToken ? await this.tokenService.findById(authToken)
      .then((token) => token?.userId)
      .then((userId) => userId ? this.userService.findById(new mongoose.Types.ObjectId(userId)) : null)
      .then((user) => user?.email) : null;

    if (!userEmail) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const offer = await this.offerService.create({
      ...req.body,
      author: userEmail,
      publishDate: new Date(),
      rating: 0,
      commentsCount: 0,
      isFavorite: false,
      photos: req.body.images,
      rooms: req.body.bedrooms,
      name: req.body.title,
      guests: req.body.maxAdults,
      id: new mongoose.Schema.Types.ObjectId(req.body.id),
      coordinates: {lat: req.body.coordinates.lat, lng: req.body.coordinates.lng},
    });

    this.created(res, offer);
  }

  public async getOfferById(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    this.logger.info(`Get offer by id: ${offerId}`);
    const offer = await this.offerService.findById(new mongoose.Types.ObjectId(offerId));
    if (!offer) {
      this.send(res, StatusCodes.NOT_FOUND, {message: `Offer with id ${offerId} does not exist`});
      return;
    }
    this.ok(res, offer);
  }

  //eslint-disable-next-line
  public async updateOffer(req: Request<any, object, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const authToken = req.headers.authorization?.split(' ')[1];
    const userEmail = authToken ? await this.tokenService.findById(authToken)
      .then((token) => token?.userId)
      .then((userId) => userId ? this.userService.findById(new mongoose.Types.ObjectId(userId)) : null)
      .then((user) => user?.email) : null;

    this.logger.info(`Updating offer ${offerId}`);

    if (!userEmail) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const offer = (await this.offerService.find({id: new mongoose.Schema.Types.ObjectId(offerId)}))[0];

    if (!offer) {
      this.send(res, StatusCodes.NOT_FOUND, {message: `Offer with id ${offerId} does not exist`});
      return;
    }

    if (offer.author !== userEmail) {
      this.send(res, StatusCodes.FORBIDDEN, {message: 'Only the owner can update the offer'});
      return;
    }

    const updatedOffer = await this.offerService.update({
      ...req.body,
      author: userEmail,
      publishDate: new Date(),
      rating: 0,
      commentsCount: 0,
      isFavorite: false,
      photos: req.body.images,
      rooms: req.body.bedrooms,
      name: req.body.title,
      guests: req.body.maxAdults,
      id: new mongoose.Schema.Types.ObjectId(offerId),
      coordinates: req.body.coordinates ? {
        lat: req.body.coordinates.lat,
        lng: req.body.coordinates.lng
      } : undefined,
    });

    this.ok(res, updatedOffer);
  }

  public async deleteOffer(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const authToken = req.headers.authorization?.split(' ')[1];
    const userEmail = authToken ? await this.tokenService.findById(authToken)
      .then((token) => token?.userId)
      .then((userId) => userId ? this.userService.findById(new mongoose.Types.ObjectId(userId)) : null)
      .then((user) => user?.email) : null;

    this.logger.info(`Deleting offer ${offerId}`);

    if (!userEmail) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const offer = (await this.offerService.find({id: new mongoose.Schema.Types.ObjectId(offerId)}))[0];

    if (!offer) {
      this.send(res, StatusCodes.NOT_FOUND, {message: `Offer with id ${offerId} does not exist`});
      return;
    }

    if (offer.author !== userEmail) {
      this.send(res, StatusCodes.FORBIDDEN, {message: 'Only owner can delete offer'});
      return;
    }

    await this.offerService.deleteById(new mongoose.Types.ObjectId(offerId));
    await this.commentService.deleteByOfferId(new mongoose.Types.ObjectId(offerId));

    this.noContent(res);
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const {city} = req.params;
    const validCities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

    this.logger.info(`Get premium offers for city: ${city}`);

    const authToken = req.headers.authorization?.split(' ')[1];
    const user = authToken ? await this.tokenService.findById(authToken)
      .then((token) => token?.userId)
      .then((userId) => userId ? this.userService.findById(new mongoose.Types.ObjectId(userId)) : null)
      : null;

    if (!user) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    if (user.type !== 'pro') {
      this.send(res, StatusCodes.FORBIDDEN, {message: 'Only premium users can access this endpoint'});
      return;
    }

    if (!validCities.includes(city)) {
      this.send(res, StatusCodes.BAD_REQUEST, {
        message: `Invalid city. Must be one of: ${validCities.join(', ')}`
      });
      return;
    }

    const premiumOffers = await this.offerService.find({city: city, isPremium: true});

    this.ok(res, premiumOffers);
  }

  public async uploadImage(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const {image} = req.body;

    const authToken = req.headers.authorization?.split(' ')[1];
    if (!authToken) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    await this.offerService.updateImage(new mongoose.Types.ObjectId(offerId), image);

    this.ok(res, {image});
  }

  public async addPhoto(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const {photo} = req.body;

    const authToken = req.headers.authorization?.split(' ')[1];
    if (!authToken) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const userEmail = await this.tokenService.findById(authToken)
      .then((token) => token?.userId)
      .then((userId) => userId ? this.userService.findById(new mongoose.Types.ObjectId(userId)) : null)
      .then((user) => user?.email);

    if (!userEmail) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const offer = await this.offerService.findById(new mongoose.Types.ObjectId(offerId));

    if (!offer) {
      this.send(res, StatusCodes.NOT_FOUND, {message: `Offer with id ${offerId} does not exist`});
      return;
    }

    if (offer!.author !== userEmail) {
      this.send(res, StatusCodes.FORBIDDEN, {message: 'Only owner can add photos to offer'});
      return;
    }

    await this.offerService.addPhoto(new mongoose.Types.ObjectId(offerId), photo);

    this.ok(res, {photoUrl: photo});
  }
}
