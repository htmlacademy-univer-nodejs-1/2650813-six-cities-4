import {NextFunction, Request, Response} from 'express';
import {Types} from 'mongoose';
import {StatusCodes} from 'http-status-codes';
import {MiddlewareInterface} from './middleware.interface.js';
import {HttpError} from '../errors/http-error.js';

export class ObjectIdValidationMiddleware implements MiddlewareInterface {
  constructor(private param: string) {
  }

  public execute({params}: Request, _response: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid Object ID`,
      'ObjectIdValidationMiddleware'
    );
  }
}
