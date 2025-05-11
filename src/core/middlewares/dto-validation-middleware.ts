import {ClassConstructor, plainToInstance} from 'class-transformer';
import {NextFunction, Request, Response} from 'express';
import {validate} from 'class-validator';
import {MiddlewareInterface} from './middleware.interface.js';
import ValidationError from '../errors/validation-error.js';
import {transformErrors} from '../helpers/common.js';

export class DtoValidationMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {
  }

  public async execute(request: Request, _response: Response, next: NextFunction): Promise<void> {
    const {body} = request;
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`${errors} Validation error: "${request.path}"`, transformErrors(errors));
    }

    next();
  }
}
