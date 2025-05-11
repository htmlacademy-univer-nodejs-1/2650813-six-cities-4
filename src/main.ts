import 'reflect-metadata';
import Application from './app/rest.js';
import {Container} from 'inversify';
import {AppComponent} from './types/app-component.enum.js';
import {createRestApplicationContainer} from './app/rest.container.js';
import {createUserContainer} from './core/modules/user/user.container.js';
import {CreateCommentContainer} from './core/modules/comment/comment.container.js';
import {createOfferContainer} from './core/modules/offer/offer.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    CreateCommentContainer(),
  );
  const application = mainContainer.get<Application>(AppComponent.Application);
  await application.init();
}

bootstrap().then((value) => console.log(value));
