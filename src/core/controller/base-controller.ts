import {injectable} from 'inversify';
import asyncHandler from 'express-async-handler';
import {Response, Router} from 'express';
import {RouteInterface} from '../../types/route.interface.js';
import {StatusCodes} from 'http-status-codes';
import {ControllerInterface} from './controller.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {RestSchema} from '../config/rest.schema.js';
import {ConfigInterface} from '../config/config.interface.js';
import {getFullServerPath, transformObject} from '../helpers/common.js';
import {UnknownRecord} from '../../types/unknown-record.type.js';
import {STATIC_RESOURCE_FIELDS} from '../helpers/constants.js';

@injectable()
export abstract class BaseController implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface<RestSchema>,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(this: BaseController, route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );
    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath(data: UnknownRecord): void {
    const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownRecord);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
