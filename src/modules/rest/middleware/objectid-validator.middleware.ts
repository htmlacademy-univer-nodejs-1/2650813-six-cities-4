import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from '../middleware.interface.js';
import mongoose from 'mongoose';

export class ObjectIdValidatorMiddleware implements IMiddleware {
  constructor(private param: string) {}

  public execute(request: Request, response: Response, next: NextFunction): void {
    const objectId = request.params[this.param];

    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      response.status(StatusCodes.BAD_REQUEST)
        .send(`${this.param} is invalid`);
      return;
    }

    next();
  }
}
