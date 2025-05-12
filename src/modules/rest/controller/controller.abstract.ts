import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { IRoute } from '../route.interface.js';
import { Logger } from 'pino';
import { IMiddleware } from '../middleware.interface.js';

@injectable()
export abstract class BaseController {
  private readonly internalRouter: Router;

  protected constructor(protected readonly logger: Logger) {
    this.internalRouter = Router();
  }

  get router() {
    return this.internalRouter;
  }

  public registerRoute(route: IRoute) {
    const middlewares = route.middlewares?.map(
      (middleware: IMiddleware) => middleware.execute.bind(middleware)
    ) || [];

    const handler = route.handler.bind(this);
    this.internalRouter[route.httpMethod](route.path, ...middlewares, handler);
    this.logger.info(`Route registered: ${route.httpMethod.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: StatusCodes, data: T): void {
    res.status(statusCode).json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
