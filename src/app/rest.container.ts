import Application from './rest.js';
import {AppComponent} from '../types/app-component.enum.js';
import {LoggerInterface} from '../core/logger/logger.interface.js';
import PinoService from '../core/logger/pino.service.js';
import {ConfigInterface} from '../core/config/config.interface.js';
import {RestSchema} from '../core/config/rest.schema.js';
import ConfigService from '../core/config/config.service.js';
import {DbClientInterface} from '../core/db-client/db-client.interface.js';
import MongoClientService from '../core/db-client/mongo-client.service.js';
import {Container} from 'inversify';
import HttpErrorExceptionFilter from '../core/exception-filters/http-error-exception-filter.js';
import ValidationExceptionFilter from '../core/exception-filters/validation-exception-filter.js';
import BaseExceptionFilter from '../core/exception-filters/base-exception-filter.js';
import {ExceptionFilterInterface} from '../core/exception-filters/exception-filter.interface.js';

export function createRestApplicationContainer() {
  const container = new Container();
  container.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  container.bind<DbClientInterface>(AppComponent.DatabaseClientInterface).to(MongoClientService).inSingletonScope();
  container.bind<ExceptionFilterInterface>(AppComponent.HttpErrorExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilterInterface>(AppComponent.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilterInterface>(AppComponent.BaseExceptionFilter).to(BaseExceptionFilter).inSingletonScope();

  return container;
}
