import {AppComponent} from '../../../../types/app-component.enum.js';
import {LoggerInterface} from '../../../logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {BaseController} from '../../../controller/base-controller.js';
import {HttpMethod} from '../../../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {OfferServiceInterface} from '../offer-service.interface.js';
import {fillDTO} from '../../../helpers/common.js';
import {OfferRdo} from '../rdo/offer.rdo.js';
import CreateOfferDto from '../dto/create-offer.dto.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';
import {OfferIdParams} from '../../../../types/offer-id-params.type.js';
import {CommentService} from '../../comment/comment.service.js';
import {CommentRdo} from '../../comment/rdo/comment.rdo.js';
import {ObjectIdValidationMiddleware} from '../../../middlewares/object-id-validation-middleware.js';
import {DtoValidationMiddleware} from '../../../middlewares/dto-validation-middleware.js';
import {DocumentExistMiddleware} from '../../../middlewares/document-exist-middleware.js';
import {PrivateRouteMiddleware} from '../../../middlewares/private-root-middleware.js';
import {UnknownRecord} from '../../../../types/unknown-record.type.js';
import {ConfigInterface} from '../../../config/config.interface.js';
import {RestSchema} from '../../../config/rest.schema.js';
import {UserServiceInterface} from '../../user/user-service.interface.js';
import {FavoriteOfferDto} from '../dto/favorite-offer.dto.js';
import {CityParams} from '../../../../types/city-params.type.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offersService: OfferServiceInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentService,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DtoValidationMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ObjectIdValidationMiddleware('offerId'),
        new DocumentExistMiddleware(this.offersService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ObjectIdValidationMiddleware('offerId'),
        new DocumentExistMiddleware(this.offersService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ObjectIdValidationMiddleware('offerId'),
        new DtoValidationMiddleware(UpdateOfferDto),
        new DocumentExistMiddleware(this.offersService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ObjectIdValidationMiddleware('offerId')]
    });
    this.addRoute({
      path: '/users/favorite',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremium
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ObjectIdValidationMiddleware('offerId'),
        new DocumentExistMiddleware(this.offersService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ObjectIdValidationMiddleware('offerId'),
        new DocumentExistMiddleware(this.offersService, 'Offer', 'offerId')
      ]
    });
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offersService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    {body, user}: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response): Promise<void> {
    const result = await this.offersService.create({...body, userId: user.id});
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async delete({params}: Request<OfferIdParams>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offersService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({body, params}: Request<OfferIdParams, UnknownRecord, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offersService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async show({params}: Request<OfferIdParams>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offersService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async showFavorites(req: Request, _res: Response): Promise<void> {
    const {user} = req;
    const offers = await this.userService.findFavoriteOffers(user.id);
    this.ok(_res, fillDTO(FavoriteOfferDto, offers));
  }

  public async showPremium({params}: Request<CityParams>, res: Response): Promise<void> {
    const offers = await this.offersService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getComments(
    {params}: Request<OfferIdParams, UnknownRecord, UnknownRecord>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async addFavorite({params: {offerId}, user: {id: userId}}: Request<OfferIdParams>, res: Response): Promise<void> {
    await this.offersService.addFavorite(offerId, userId);
    this.noContent(res, {});
  }

  public async deleteFavorite({params: {offerId}, user: {id: userId}}: Request<OfferIdParams>, res: Response): Promise<void> {
    await this.offersService.deleteFavorite(offerId, userId);
    this.noContent(res, {});
  }
}
