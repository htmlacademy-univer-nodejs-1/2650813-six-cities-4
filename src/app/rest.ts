import {LoggerInterface} from '../core/logger/logger.interface.js';
import cors from 'cors';
import {ConfigInterface} from '../core/config/config.interface.js';
import {RestSchema} from '../core/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../types/app-component.enum.js';
import {DbClientInterface} from '../core/db-client/db-client.interface.js';
import {getMongoURI} from '../core/helpers/db.js';
import {ExceptionFilterInterface} from '../core/exception-filters/exception-filter.interface.js';
import {BaseController} from '../core/controller/base-controller.js';
import express, {Express} from 'express';
import {getFullServerPath} from '../core/helpers/common.js';
// import {AuthenticationMiddleware} from '../core/middlewares/authentication-middleware.js';

@injectable()
export default class Application {
  private server: Express;

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
              @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
              @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DbClientInterface,
              @inject(AppComponent.HttpErrorExceptionFilter) private readonly httpErrorExceptionFilter: ExceptionFilterInterface,
              @inject(AppComponent.UserController) private readonly userController: BaseController,
              @inject(AppComponent.OfferController) private readonly offerController: BaseController,
              @inject(AppComponent.CommentController) private readonly commentController: BaseController,
              @inject(AppComponent.BaseExceptionFilter) private readonly baseExceptionFilter: ExceptionFilterInterface,
              @inject(AppComponent.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilterInterface,
  ) {
    this.server = express();
  }

  private async _initDb() {
    this.logger.info('Init database');
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    this.logger.info('Init database completed');
    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    this.logger.info('Try to init server');
    const port = this.config.get('PORT');
    this.server.listen(port);
    this.logger.info(`🚀Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }

  private async _initControllers(){
    this.logger.info('Controller init');
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
    this.logger.info('Controller completed');
  }

  private async _initMiddleware() {
    this.logger.info('Init middleware');
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    // const authenticateMiddleware = new AuthenticationMiddleware(this.config.get('JWT_SECRET'));
    // this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
    this.logger.info('Middleware init completed');
  }

  private async _initExceptionFilters() {
    this.logger.info('Init exception filters');
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpErrorExceptionFilter.catch.bind(this.httpErrorExceptionFilter));
    this.server.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
    this.logger.info('Exception filters completed');
  }


  public async init() {
    this.logger.info('Application init');
    await this._initDb();
    await this._initMiddleware();
    await this._initExceptionFilters();
    await this._initServer();
    await this._initControllers();
  }
}
