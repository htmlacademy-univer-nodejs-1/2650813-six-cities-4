import {Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';
import {ExceptionFilterInterface} from './exception-filter.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {ServiceError} from '../../types/service-error.enum.js';
import {HttpError} from '../errors/http-error.js';
import {createErrorObject} from '../helpers/common.js';

@injectable()
export default class HttpErrorExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, request: Request, response: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${request.path} # ${error.message}`);

    response
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }
}
