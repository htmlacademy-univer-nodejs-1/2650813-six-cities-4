import 'reflect-metadata';
import { Container } from 'inversify';
import { setupOfferDIContainer } from './modules/rental-offers/rental-offer.container.js';
import { setupUserDIContainer } from './modules/users/user-service.container.js';
import { setupCommentsDIContainer } from './modules/comments/comment-service.container.js';
import { Application } from './application.js';
import { Config } from 'convict';
import { AppConfig, config } from './config.js';
import { Logger } from 'pino';
import appLogger from './appLogger.js';
import { RestModule } from './modules/rest/rest.container.js';
import { TokenModule } from './modules/token-service/token-service.container.js';

export function create() {
  const diContainer = new Container();
  diContainer.bind<Application>('App').to(Application).inSingletonScope();
  diContainer.bind<Logger>('Log').toConstantValue(appLogger);
  diContainer.bind<Config<AppConfig>>('Config').toConstantValue(config);

  diContainer.loadSync(setupUserDIContainer());
  diContainer.loadSync(setupOfferDIContainer());
  diContainer.loadSync(setupCommentsDIContainer());
  diContainer.loadSync(RestModule);
  diContainer.loadSync(TokenModule);

  return diContainer;
}

