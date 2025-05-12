import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';
import { Config } from 'convict';
import { AppConfig } from './config.js';
import { IExceptionFilter } from './modules/rest/exception-filter/exception-filter.interface.js';
import { IController } from './modules/rest/controller/controller.interface.js';
import { OfferController } from './modules/rest/controller/offer.controller.js';
import { initializeDBConnection } from './db/connect.js';
import { UserController } from './modules/rest/controller/user.controller.js';
import { CommentsController } from './modules/rest/controller/comments.controller.js';
import { FavoritesController } from './modules/rest/controller/favorites.controller.js';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
};

@injectable()
export class Application {
  private express: Express;

  constructor(
    @inject('Log') public readonly logger: Logger,
    @inject('Config') private readonly config: Config<AppConfig>,
    @inject('ExceptionFilter') private readonly exceptionFilter: IExceptionFilter,
    @inject('OfferController') private readonly offersController: OfferController,
    @inject('UsersController') private readonly usersController: UserController,
    @inject('CommentsController') private readonly commentsController: CommentsController,
    @inject('FavoritesController') private readonly favoritesController: FavoritesController,
  ) {
    this.express = express();
  }

  public registerRoutes(controllers: IController[]): void {
    for (const controller of controllers) {
      this.express.use('/api', controller.router);
      this.logger.info(`Controller registered: ${controller.constructor.name}`);
    }
  }

  public async registerMiddlewares(): Promise<void> {
    const uploadDirectoryPath = this.config.get('UPLOAD_DIRECTORY_PATH');
    const avatarUploadPath = resolve(uploadDirectoryPath, 'avatars');
    const offerUploadPath = resolve(uploadDirectoryPath, 'offers');
    const tmpUploadPath = resolve(uploadDirectoryPath, 'tmp');

    await ensureDirectoryExists(uploadDirectoryPath);
    await ensureDirectoryExists(avatarUploadPath);
    await ensureDirectoryExists(offerUploadPath);
    await ensureDirectoryExists(tmpUploadPath);

    this.express.use(express.json());
    this.express.use('/uploads', express.static(uploadDirectoryPath));

    this.logger.info('Middleware express.json registered');
  }

  public registerExceptionFilters(): void {
    this.express.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    this.logger.info('Exception filter registered');
  }

  public async init(): Promise<void> {
    await this.registerMiddlewares();
    this.registerExceptionFilters();
    this.registerRoutes([this.offersController, this.commentsController, this.favoritesController, this.usersController]);

    await initializeDBConnection(this.logger);

    const port = this.config.get().PORT;
    this.express.listen(port, () => {
      this.logger.info(`Server started on http://localhost:${port}`);
    });
  }
}
