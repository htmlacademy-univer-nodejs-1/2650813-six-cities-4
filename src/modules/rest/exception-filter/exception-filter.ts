import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './exception-filter.interface.js';
import { ErrorResponse } from '../dto/errors.js';
import { Logger } from 'pino';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(
    @inject('Log') private readonly logger: Logger
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: Error, req: Request, res: Response) {
    this.logger.error(`[${req.method}] ${req.originalUrl} - ${error.message}`);

    const errorResponse: ErrorResponse = {
      message: error.message,
    };

    res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    this.handleHttpError(error, req, res);
    next();
  }
}
