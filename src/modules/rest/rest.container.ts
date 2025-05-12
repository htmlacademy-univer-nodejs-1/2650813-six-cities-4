import { ContainerModule } from 'inversify';
import { IExceptionFilter } from './exception-filter/exception-filter.interface.js';
import { ExceptionFilter } from './exception-filter/exception-filter.js';
import { IController } from './controller/controller.interface.js';
import { UserController } from './controller/user.controller.js';
import { OfferController } from './controller/offer.controller.js';
import {CommentsController} from './controller/comments.controller.js';
import {FavoritesController} from './controller/favorites.controller.js';

export const RestModule = new ContainerModule((bind) => {
  bind.bind<IExceptionFilter>('ExceptionFilter')
    .to(ExceptionFilter)
    .inSingletonScope();

  bind.bind<IController>('UsersController')
    .to(UserController)
    .inSingletonScope();

  bind.bind<IController>('OfferController')
    .to(OfferController)
    .inSingletonScope();

  bind.bind<IController>('CommentsController')
    .to(CommentsController)
    .inSingletonScope();

  bind.bind<IController>('FavoritesController')
    .to(FavoritesController)
    .inSingletonScope();
});
